import { readdirSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Every prerendered route, so a new page cannot be added without the structural and axe assertions
 * noticing it. The 404 is a single file that answers any unknown path, so it is probed through one.
 *
 * The detail slugs are read from the content collections rather than copied into this file: adding a
 * case study or a service must not be able to leave a route untested. The locale prefixes are the
 * three the router emits (`/`, `/ca/`, `/es/`).
 *
 * `grids` marks routes that carry prose-bearing grids, which is what the 280 px rule in
 * `layout.spec.ts` applies to. Case-study detail pages are prose with no grid; service detail pages
 * carry the related-work card grid and the about page carries the experience `<dl>`.
 */
export interface RouteSpec {
  path: string;
  grids: boolean;
}

const CONTENT_DIR = join(process.cwd(), 'src/content');

function slugs(collection: 'caseStudies' | 'services'): string[] {
  return readdirSync(join(CONTENT_DIR, collection))
    .filter((name) => name.endsWith('.en.md'))
    .map((name) => name.slice(0, -'.en.md'.length))
    .sort();
}

const PREFIXES = ['', '/ca', '/es'];

function buildRoutes(): RouteSpec[] {
  const routes: RouteSpec[] = [];

  for (const prefix of PREFIXES) {
    routes.push({ path: `${prefix}/`, grids: true });
  }

  for (const prefix of PREFIXES) {
    routes.push({ path: `${prefix}/privacy/`, grids: false });
    routes.push({ path: `${prefix}/contact/thanks/`, grids: false });
    routes.push({ path: `${prefix}/about/`, grids: true });
    for (const slug of slugs('services')) {
      routes.push({ path: `${prefix}/services/${slug}/`, grids: true });
    }
    for (const slug of slugs('caseStudies')) {
      routes.push({ path: `${prefix}/work/${slug}/`, grids: false });
    }
  }

  routes.push({ path: '/this-page-does-not-exist', grids: false });

  return routes;
}

export const ROUTES = buildRoutes();

/** The three home pages: the only routes with the services, work, metric and contact grids. */
export const HOME_ROUTES = ROUTES.filter((route) =>
  ['/', '/ca/', '/es/'].includes(route.path),
);
