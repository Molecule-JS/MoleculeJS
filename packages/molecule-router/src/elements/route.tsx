import { h, Element, Class } from '../../../molecule-jsx/src/molecule-jsx';
import { Match } from '../util/match-path';

import { Location } from 'history';

import { Router } from '../molecule-router';
import { computeMatch } from '../util/compute-match';

export { h };

export default class MolRoute extends Element {
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

  render() {
    if (this.inactive) return null;

    this.match = computeMatch(
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
        return h(this.element, props);
      }
      return <slot />;
    }
    return null;
  }
}

customElements.define('mol-route', MolRoute);
