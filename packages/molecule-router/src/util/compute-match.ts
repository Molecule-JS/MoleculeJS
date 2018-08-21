import matchPath, { Match } from './match-path';
import { Router } from '../molecule-router';
import { Location } from 'history';

export const computeMatch = (
  {
    computedMatch,
    location,
    path,
    strict,
    exact,
    sensitive,
  }: {
    computedMatch: Match;
    location: Location;
    path: string;
    strict: boolean;
    exact: boolean;
    sensitive: boolean;
  },
  router: Router,
) => {
  if (computedMatch) return computedMatch; // <Switch> already computed the match for us

  const { current: route, match } = router;
  const pathname = (location || route).pathname;

  return matchPath(pathname, { path, strict, exact, sensitive }, match);
};
