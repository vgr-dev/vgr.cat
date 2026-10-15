const SITEVERIFY = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

/** Must match `turnstileAction` in `src/config.ts`. */
const TURNSTILE_ACTION = 'contact';

const TOKEN_MAX_LENGTH = 2048;
const VERIFY_TIMEOUT_MS = 10_000;

const MAX_FIELD_LENGTH = 2000;
const MIN_ELAPSED_MS = 3000;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const CRLF_RE = /[\r\n]/;

const FROM = { email: 'noreply@vgr.cat', name: 'vgr.cat' };

const THANKS_PATH: Record<string, string> = {
  en: '/contact/thanks',
  ca: '/ca/contact/thanks',
  es: '/es/contact/thanks',
};

/** `public/_headers` does not apply to Worker-generated responses, so we set these here. */
const SECURITY_HEADERS: Record<string, string> = {
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
};

function problem(status: number, error: string): Response {
  return new Response(JSON.stringify({ error }), {
    status,
    headers: { ...SECURITY_HEADERS, 'content-type': 'application/json' },
  });
}

function field(form: FormData, name: string): string {
  const value = form.get(name);
  return typeof value === 'string' ? value.trim() : '';
}

interface VerifyOutcome {
  success?: boolean;
  action?: string;
  hostname?: string;
  'error-codes'?: string[];
}

function allowedHostnames(env: Env): Set<string> {
  return new Set(
    (env.TURNSTILE_HOSTNAMES ?? '')
      .split(',')
      .map((value) => value.trim())
      .filter(Boolean),
  );
}

/**
 * Canonical server-side Siteverify. Requires the token to be single-use valid, the
 * expected action, and a hostname on the deployment's allowlist — a bare
 * `success === true` would accept a token minted for any other site on the widget.
 */
async function challengePasses(
  token: string,
  secret: string,
  ip: string | null,
  hostnames: Set<string>,
): Promise<boolean> {
  if (token.length > TOKEN_MAX_LENGTH) return false;
  if (hostnames.size === 0) return false;

  const body = new URLSearchParams({ secret, response: token });
  if (ip) body.set('remoteip', ip);

  let outcome: VerifyOutcome;
  try {
    const response = await fetch(SITEVERIFY, {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body,
      signal: AbortSignal.timeout(VERIFY_TIMEOUT_MS),
    });
    if (!response.ok) return false;
    outcome = (await response.json()) as VerifyOutcome;
  } catch {
    return false;
  }

  const rejected = !(
    outcome.success === true &&
    outcome.action === TURNSTILE_ACTION &&
    typeof outcome.hostname === 'string' &&
    hostnames.has(outcome.hostname)
  );

  if (rejected) {
    // Safe to log: never includes the secret or the token.
    console.warn('siteverify rejected', {
      action: outcome.action ?? '(absent)',
      hostname: outcome.hostname ?? '(absent)',
      codes: outcome['error-codes'] ?? [],
    });
  }

  return !rejected;
}

async function contact(request: Request, env: Env): Promise<Response> {
  if (request.method !== 'POST') return problem(405, 'Method not allowed');

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return problem(400, 'Malformed submission');
  }

  // Honeypot: hidden from visitors, irresistible to naive bots.
  if (field(form, 'company') !== '') return problem(400, 'Rejected');

  const elapsed = Number(field(form, 'elapsed'));
  if (!Number.isFinite(elapsed) || elapsed < MIN_ELAPSED_MS) {
    return problem(400, 'Rejected');
  }

  const name = field(form, 'name');
  const email = field(form, 'email');
  const message = field(form, 'message');

  // CRLF anywhere near a header is email header injection, not a validation nit.
  for (const value of [name, email, message]) {
    if (
      value.length === 0 ||
      value.length > MAX_FIELD_LENGTH ||
      CRLF_RE.test(value)
    ) {
      return problem(400, 'Invalid field');
    }
  }
  if (!EMAIL_RE.test(email)) return problem(400, 'Invalid email');

  const token = field(form, 'cf-turnstile-response');
  if (token === '') return problem(403, 'Challenge missing');

  const secret = env.TURNSTILE_SECRET_KEY;
  if (!secret) return problem(500, 'Challenge not configured');
  const ip = request.headers.get('CF-Connecting-IP');
  if (!(await challengePasses(token, secret, ip, allowedHostnames(env)))) {
    return problem(403, 'Challenge failed');
  }

  const thanks = THANKS_PATH[field(form, 'lang')] ?? THANKS_PATH.en;

  try {
    await env.NOTIFY.send({
      // `to` is required by the type even though the binding pins it; the
      // binding's destination_address is the hard cap either way.
      to: env.CONTACT_DESTINATION,
      from: FROM,
      replyTo: { email, name },
      subject: `Contact: ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
    });
    await env.REPLY.send({
      to: { email, name },
      from: FROM,
      subject: 'Message received',
      text: 'Thanks for getting in touch — a reply is on its way.',
    });
  } catch (error) {
    console.error('contact delivery failed', error);
    return problem(502, 'Delivery failed');
  }

  return new Response(null, {
    status: 303,
    headers: { ...SECURITY_HEADERS, Location: thanks },
  });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const { pathname } = new URL(request.url);
    if (pathname === '/api/contact') return contact(request, env);

    // Static assets are served first, so reaching here means nothing matched.
    // Hand it back so the prerendered 404 page still wins.
    return env.ASSETS.fetch(request);
  },
};
