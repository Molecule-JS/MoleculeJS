import MoleculeJsx, { Class } from '@moleculejs/molecule-jsx';
import matchPath, { Match } from '../util/match-path';

import { Location } from 'history';

import { Router } from '../molecule-router';

export default class MolRoute extends MoleculeJsx.Element {
  match: Match | null = null;
  router!: Router;

  computedMatch?: Match;
  current!: Location;
  path?: string;
  exact!: boolean;
  strict!: boolean;
  sensitive!: boolean;
  element?: Class<HTMLElement> | string;
  inactive = false;

  props!: {
    inactive?: boolean;
    computedMatch?: Match;
    path?: string;
    exact?: boolean;
    strict?: boolean;
    sensitive?: boolean;
    element?: Class<HTMLElement> | string;
  };

  static get properties() {
    return {
      inactive: false,
      current: undefined,
      computedMatch: undefined,
      path: undefined,
      exact: false,
      strict: false,
      sensitive: false,
    };
  }

  connected() {
    this.router = (window as any).$molRouter;
    this.router.addRoute(this);
  }

  computeMatch(
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
  ) {
    if (computedMatch) return computedMatch; // <Switch> already computed the match for us

    const { current: route, match } = router;
    const pathname = (location || route).pathname;

    return matchPath(pathname, { path, strict, exact, sensitive }, match);
  }

  render() {
    if (this.inactive) return null;

    this.match = this.computeMatch(
      {
        computedMatch: this.computedMatch!,
        location: this.current,
        path: this.path!,
        strict: this.strict,
        exact: this.exact,
        sensitive: this.sensitive,
      },
      this.router,
    );

    if (this.match) {
      const props: { [key: string]: any } = {
        match: this.match,
        location: this.current,
        history: this.router.history,
      };

      for (const key in this.match.params) {
        const param = this.match.params[key];
        props[key] = param;
      }

      if (this.element) {
        return MoleculeJsx.createElement(this.element, props);
      }
      return <slot />;
    }
    return null;
  }
}

customElements.define('mol-route', MolRoute);
