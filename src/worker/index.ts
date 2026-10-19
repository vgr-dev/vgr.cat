const SITEVERIFY = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

/** Must match `turnstileAction` in `src/config.ts`. */
const TURNSTILE_ACTION = 'contact';

const TOKEN_MAX_LENGTH = 2048;
const VERIFY_TIMEOUT_MS = 10_000;

const MAX_FIELD_LENGTH = 2000;
const MIN_ELAPSED_MS = 3000;
const CRLF_RE = /[\r\n]/;

/**
 * Pragmatic RFC 5322 dot-atom form. It rejects quotes, angle brackets, commas, parentheses and
 * control characters in the local part, because the address is handed to the mail provider as a
 * structured recipient and must never be able to widen into a list. Accepted trade-off: punycode
 * TLDs are rejected.
 */
const EMAIL_LOCAL =
  /^[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+)*$/;
const EMAIL_DOMAIN =
  /^(?:[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?\.)+[A-Za-z]{2,63}$/;
const EMAIL_MAX_LENGTH = 254;
const EMAIL_LOCAL_MAX_LENGTH = 64;

/** Rejected before `formData()` so an oversized body is never parsed. */
const MAX_BODY_BYTES = 16 * 1024;
const ALLOWED_CONTENT_TYPES = [
  'multipart/form-data',
  'application/x-www-form-urlencoded',
] as const;

/** Exactly the fields `ContactForm.astro` submits; anything else is pollution. */
const ALLOWED_FIELDS = new Set([
  'lang',
  'elapsed',
  'name',
  'email',
  'organization',
  'serviceType',
  'message',
  'form_guard',
  'cf-turnstile-response',
]);

const FROM = { email: 'noreply@vgr.cat', name: 'vgr.cat' };

/** Accepted `serviceType` keys, mapped to the label used in the notification. */
const SERVICE_TYPES: Record<string, string> = {
  regtech: 'RegTech / EPREL Integration / ESPR Readiness',
  entityResolution: 'Market Observability / Entity Resolution',
  infrastructure: 'Multi-Tenant Architecture / Tooling',
  iot: 'IoT Monitoring / Field Instrumentation',
  advisory: 'Technical Advisory / Speaking / Other',
};

const THANKS_PATH: Record<string, string> = {
  en: '/contact/thanks',
  ca: '/ca/contact/thanks',
  es: '/es/contact/thanks',
};

/** Auto-reply copy in the submitter's language; falls back to English. */
const REPLY_COPY: Record<string, { subject: string; text: string }> = {
  en: {
    subject: 'Message received',
    text: 'Thanks for getting in touch — a reply is on its way.',
  },
  ca: {
    subject: 'Missatge rebut',
    text: 'Gràcies per contactar amb mi — us respondré ben aviat.',
  },
  es: {
    subject: 'Mensaje recibido',
    text: 'Gracias por ponerse en contacto — le responderé en breve.',
  },
};

/** `public/_headers` does not apply to Worker-generated responses, so we set these here. */
const SECURITY_HEADERS: Record<string, string> = {
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  // A submission outcome is never cacheable; no zone rule caches POST today, so this is
  // defence in depth against a future cache rule rather than a live fix.
  'Cache-Control': 'no-store',
};

function problem(
  status: number,
  error: string,
  headers: Record<string, string> = {},
): Response {
  return new Response(JSON.stringify({ error }), {
    status,
    headers: {
      ...SECURITY_HEADERS,
      'content-type': 'application/json',
      ...headers,
    },
  });
}

function field(form: FormData, name: string): string {
  const value = form.get(name);
  return typeof value === 'string' ? value.trim() : '';
}

/** Length caps plus a dot-atom local part and a label-validated domain. */
function isValidEmail(value: string): boolean {
  if (value.length === 0 || value.length > EMAIL_MAX_LENGTH) return false;
  const at = value.lastIndexOf('@');
  if (at <= 0 || at === value.length - 1) return false;
  const local = value.slice(0, at);
  const domain = value.slice(at + 1);
  return (
    local.length <= EMAIL_LOCAL_MAX_LENGTH &&
    EMAIL_LOCAL.test(local) &&
    EMAIL_DOMAIN.test(domain)
  );
}

/** Provider errors can embed the recipient, so only the error's type is ever logged. */
function errorName(error: unknown): string {
  return error instanceof Error ? error.name : typeof error;
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

/**
 * Defence in depth in front of the zone's own rate-limit rule. Fails OPEN: a broken limiter
 * binding must not take the contact form down, and Turnstile plus the edge rule still gate every
 * submission. The log line carries no key, so no visitor IP is written to Workers Logs.
 */
async function withinRateLimit(request: Request, env: Env): Promise<boolean> {
  const key = request.headers.get('CF-Connecting-IP') ?? 'unknown';
  try {
    const { success } = await env.CONTACT_RATE_LIMITER.limit({ key });
    return success;
  } catch (error) {
    console.warn('rate limiter unavailable', { name: errorName(error) });
    return true;
  }
}

async function contact(request: Request, env: Env): Promise<Response> {
  // Cheapest gates first: nothing is parsed until every rejection that needs no parsing has run.
  if (request.method !== 'POST') {
    return problem(405, 'Method not allowed', { Allow: 'POST' });
  }

  if (!(await withinRateLimit(request, env))) {
    return problem(429, 'Too many requests');
  }

  const contentType = (request.headers.get('content-type') ?? '').toLowerCase();
  if (!ALLOWED_CONTENT_TYPES.some((type) => contentType.startsWith(type))) {
    return problem(415, 'Unsupported media type');
  }

  // `content-length` is advisory (and absent on chunked bodies), but rejecting it early keeps
  // the common oversize case from ever reaching the parser.
  const declaredLength = Number(request.headers.get('content-length') ?? '');
  if (Number.isFinite(declaredLength) && declaredLength > MAX_BODY_BYTES) {
    return problem(413, 'Payload too large');
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return problem(400, 'Malformed submission');
  }

  // An unlisted field is parameter pollution; a repeated one lets `get()` and a downstream
  // reader disagree about the value.
  const keys = [...form.keys()];
  if (
    keys.some((key) => !ALLOWED_FIELDS.has(key)) ||
    new Set(keys).size !== keys.length
  ) {
    return problem(400, 'Unexpected field');
  }

  // Honeypot: hidden from visitors, irresistible to naive bots.
  if (field(form, 'form_guard') !== '') return problem(400, 'Rejected');

  const elapsed = Number(field(form, 'elapsed'));
  if (!Number.isFinite(elapsed) || elapsed < MIN_ELAPSED_MS) {
    return problem(400, 'Rejected');
  }

  const name = field(form, 'name');
  const email = field(form, 'email');
  const organization = field(form, 'organization');
  const message = field(form, 'message');

  // CRLF anywhere near a header is email header injection, not a validation nit.
  for (const value of [name, email, organization, message]) {
    if (
      value.length === 0 ||
      value.length > MAX_FIELD_LENGTH ||
      CRLF_RE.test(value)
    ) {
      return problem(400, 'Invalid field');
    }
  }
  if (!isValidEmail(email)) return problem(400, 'Invalid email');

  const serviceType = field(form, 'serviceType');
  const serviceLabel = SERVICE_TYPES[serviceType];
  if (!serviceLabel) return problem(400, 'Invalid field');

  const token = field(form, 'cf-turnstile-response');
  if (token === '') return problem(403, 'Challenge missing');

  const secret = env.TURNSTILE_SECRET_KEY;
  if (!secret) return problem(500, 'Challenge not configured');
  const ip = request.headers.get('CF-Connecting-IP');
  if (!(await challengePasses(token, secret, ip, allowedHostnames(env)))) {
    return problem(403, 'Challenge failed');
  }

  const lang = field(form, 'lang');
  const thanks = THANKS_PATH[lang] ?? THANKS_PATH.en;
  const reply = REPLY_COPY[lang] ?? REPLY_COPY.en;

  try {
    await env.NOTIFY.send({
      // `to` is required by the type even though the binding pins it; the
      // binding's destination_address is the hard cap either way.
      to: env.CONTACT_DESTINATION,
      from: FROM,
      replyTo: { email, name },
      subject: `Contact: ${serviceLabel} — ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nOrganization: ${organization}\nPrimary focus: ${serviceLabel}\n\n${message}`,
    });
  } catch (error) {
    console.error('contact delivery failed', {
      binding: 'NOTIFY',
      name: errorName(error),
    });
    return problem(502, 'Delivery failed');
  }

  try {
    await env.REPLY.send({
      to: { email, name },
      from: FROM,
      subject: reply.subject,
      text: reply.text,
    });
  } catch (error) {
    console.error('contact delivery failed', {
      binding: 'REPLY',
      name: errorName(error),
    });
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
