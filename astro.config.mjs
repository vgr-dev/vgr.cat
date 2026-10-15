import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://vgr.cat',
  output: 'static',
  trailingSlash: 'ignore',
  build: { format: 'directory' },
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'ca', 'es'],
    routing: { prefixDefaultLocale: false },
  },
  security: {
    // Emits a build-time <meta http-equiv="content-security-policy"> tag on every
    // prerendered page. Astro hashes the inline <style>/<script> blocks it emits and
    // places those hashes on style-src/script-src, so the inlined global.css keeps
    // working without 'unsafe-inline'. Directives added here are merged alongside them.
    csp: {
      directives: [
        "default-src 'self'",
        "img-src 'self' data:",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self'",
      ],
    },
  },
  integrations: [
    sitemap({
      i18n: {
        defaultLocale: 'en',
        locales: { en: 'en', ca: 'ca', es: 'es' },
      },
    }),
  ],
});
