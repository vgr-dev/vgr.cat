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
        'frame-src https://challenges.cloudflare.com',
        // Web Analytics is injected by Cloudflare at the edge (zone auto-install), not emitted
        // by this repo, so this entry is the only place the dependency is visible. Its beacon
        // reports to cloudflareinsights.com; without this directive `default-src 'self'` blocks
        // the report — silently, and only in production.
        "connect-src 'self' https://cloudflareinsights.com",
      ],
      // Turnstile's loader is a third-party script. `static.cloudflareinsights.com` is here for
      // the zone-injected Web Analytics beacon: an injected script is absent from Astro's hash
      // list, so its origin has to be allowed by host. Astro still owns the inline hashes.
      scriptDirective: {
        resources: [
          'https://challenges.cloudflare.com',
          'https://static.cloudflareinsights.com',
        ],
      },
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
