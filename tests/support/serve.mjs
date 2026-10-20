/**
 * Static server for the Playwright suite, run in the **foreground** by
 * `playwright.config.ts`'s `webServer`.
 *
 * Why this exists: `astro preview` daemonises in Astro 7 (it prints a pid and exits), so it cannot be
 * Playwright's webServer command on its own, and it binds to `localhost` — which made the readiness
 * probe against `127.0.0.1` time out on a CI runner. This server is ~70 lines of `node:http` with no
 * dependencies, binds `127.0.0.1` explicitly, and reproduces the only static-asset behaviour the
 * suite depends on:
 *
 *   `/x/`  → `dist/x/index.html`
 *   `/x`   → `dist/x.html`, else `dist/x/index.html` with a trailing-slash redirect
 *   other  → `dist/404.html` with status 404
 */
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import { extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HOST = '127.0.0.1';
const PORT = Number(process.env.E2E_PORT ?? 4321);
const ROOT = resolve(
  fileURLToPath(new URL('.', import.meta.url)),
  '../../dist',
);

const CONTENT_TYPES = new Map([
  ['.html', 'text/html; charset=utf-8'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.css', 'text/css; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8'],
  ['.xml', 'application/xml; charset=utf-8'],
  ['.txt', 'text/plain; charset=utf-8'],
  ['.svg', 'image/svg+xml'],
  ['.ico', 'image/x-icon'],
  ['.png', 'image/png'],
  ['.woff2', 'font/woff2'],
]);

async function isFile(path) {
  try {
    return (await stat(path)).isFile();
  } catch {
    return false;
  }
}

/** Resolves a request path to a file inside `dist/`, or to the prerendered 404 page. */
async function resolveFile(pathname) {
  const trimmed = pathname.replace(/\/+$/, '');
  const candidates = [
    join(ROOT, `${trimmed}/index.html`),
    join(ROOT, `${trimmed}.html`),
    join(ROOT, trimmed),
  ];
  for (const candidate of candidates) {
    if (!candidate.startsWith(ROOT)) continue;
    if (await isFile(candidate)) return { file: candidate, status: 200 };
  }
  return { file: join(ROOT, '404.html'), status: 404 };
}

const server = createServer((request, response) => {
  const { pathname } = new URL(request.url ?? '/', `http://${HOST}`);

  resolveFile(decodeURIComponent(pathname))
    .then(({ file, status }) => {
      response.writeHead(status, {
        'content-type':
          CONTENT_TYPES.get(extname(file)) ?? 'application/octet-stream',
        'cache-control': 'no-store',
      });
      createReadStream(file).pipe(response);
    })
    .catch(() => {
      response.writeHead(500).end('server error');
    });
});

server.listen(PORT, HOST, () => {
  console.log(
    `e2e static server listening on http://${HOST}:${PORT} (dist: ${ROOT})`,
  );
});
