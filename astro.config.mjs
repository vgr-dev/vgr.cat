import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
// Single source of truth for locales so switching the default is a one-line change.
import { locales, defaultLocale } from './src/i18n/config.ts';

export default defineConfig({
  site: 'https://vgr.cat',
  output: 'static',
  trailingSlash: 'ignore',
  build: { format: 'directory' },
  vite: { plugins: [tailwindcss()] },
  i18n: {
    defaultLocale,
    locales: [...locales],
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
        defaultLocale,
        locales: Object.fromEntries(locales.map((locale) => [locale, locale])),
      },
    }),
  ],
});
