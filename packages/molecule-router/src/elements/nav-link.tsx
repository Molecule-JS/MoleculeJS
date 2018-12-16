import { h, Element, Class } from '../../../molecule-jsx/src/molecule-jsx';
import { Router } from '../molecule-router';
import { Match } from '../util/match-path';
import Link from './link';
import { Location } from 'history';
import { computeMatch } from '../util/compute-match';

export { h };

export default class MolNavLink extends Element {
  to!: string | Location;
  replace: boolean = false;
  router!: Router;
  current!: Location;
  target?: string;

  computedMatch?: Match;
  path?: string;
  exact!: boolean;
  strict!: boolean;
  sensitive!: boolean;
  element?: Class<HTMLElement> | string;
  inactive = false;
  active: boolean = false;

  props!: {
    to: string;
    replace?: boolean;
    path?: string;
    target?: string;
    computedMatch?: Match;
    exact?: boolean;
    strict?: boolean;
    sensitive?: boolean;
    element?: Class<HTMLElement> | string;
    inactive?: boolean;
    active?: boolean;
  };

  static get properties() {
    return {
      to: {},
      target: {},
      current: {},
      exact: false,
      strict: false,
      activeClassName: 'router-link-active',
      inactive: false,
      computedMatch: undefined,
      path: undefined,
      sensitive: false,
      active: {
        type: Boolean,
        attribute: true,
      },
    };
  }

  connected() {
    this.router = (window as any).$molRouter;
    this.router.addLink(this);
  }

  render() {
    if (!this.router || this.inactive) return;

    const path =
      this.path || (typeof this.to === 'string' ? this.to : this.to.pathname);

    const escapedPath =
      path && path.replace(/([.+*?=^!:${}()[\]|/\\])/g, '\\$1');

    const match = computeMatch(
      {
        path: escapedPath,
        computedMatch: this.computedMatch!,
        location: this.current,
        strict: this.strict,
        exact: this.exact,
        sensitive: this.sensitive,
      },
      this.router,
    );

    this.active = !!match;

    return (
      <Link to={this.to}>
        <slot />
      </Link>
    );
  }
}

customElements.define('mol-nav-link', MolNavLink);
