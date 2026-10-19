/**
 * Every prerendered route, so a new page cannot be added without the structural and axe assertions
 * noticing it. The 404 is a single file that answers any unknown path, so it is probed through one.
 *
 * `grids` marks the three home pages: they are the only routes with the services, case-study,
 * metric and contact grids that the 280 px rule applies to.
 */
export interface RouteSpec {
  path: string;
  grids: boolean;
}

export const ROUTES: RouteSpec[] = [
  { path: '/', grids: true },
  { path: '/ca/', grids: true },
  { path: '/es/', grids: true },
  { path: '/privacy/', grids: false },
  { path: '/ca/privacy/', grids: false },
  { path: '/es/privacy/', grids: false },
  { path: '/contact/thanks/', grids: false },
  { path: '/ca/contact/thanks/', grids: false },
  { path: '/es/contact/thanks/', grids: false },
  { path: '/this-page-does-not-exist', grids: false },
];

export const HOME_ROUTES = ROUTES.filter((route) => route.grids);
