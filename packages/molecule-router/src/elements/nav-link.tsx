import MoleculeJsx, { Class } from '../../../molecule-jsx/src/molecule-jsx';
import { Router } from '../molecule-router';
import matchPath, { Match } from '../util/match-path';
import { isModifiedEvent } from './link';
import { createLocation, Location } from 'history';

export default class MolNavLink extends MoleculeJsx.Element {
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
  activeClassName!: string;

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
    activeClassName?: string;
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
    };
  }

  handleClick(event: MouseEvent) {
    if (
      !event.defaultPrevented && // onClick prevented default
      event.button === 0 && // ignore everything but left clicks
      !this.target && // let browser handle "target=_blank" etc.
      !isModifiedEvent(event) // ignore clicks with modifier keys
    ) {
      event.preventDefault();

      const { history } = this.router;
      // tslint:disable-next-line:no-this-assignment
      const { replace, to } = this;

      if (replace) {
        const path = typeof to === 'string' ? to : to.pathname;
        history.replace(path);
      } else {
        const location = typeof to === 'string' ? createLocation(to) : to;
        history.push(location);
      }
    }
  }

  connected() {
    this.router = (window as any).$molRouter;
    this.router.addLink(this);

    this.handleClick = this.handleClick.bind(this);
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
    if (!this.router || this.inactive) return;

    const path =
      this.path || (typeof this.to === 'string' ? this.to : this.to.pathname);

    const match = this.computeMatch(
      {
        path,
        computedMatch: this.computedMatch!,
        location: this.current,
        strict: this.strict,
        exact: this.exact,
        sensitive: this.sensitive,
      },
      this.router,
    );

    const location =
      typeof this.to === 'string'
        ? createLocation(this.to, null, undefined, this.current)
        : this.to;

    const href = this.router.history.createHref(location);

    (this.__root as HTMLAnchorElement).href = href;

    return (
      <a
        class={!match ? '' : this.activeClassName}
        target={this.target}
        href={href}
        onClick={this.handleClick}
      >
        <slot />
      </a>
    );
  }
}

customElements.define('mol-nav-link', MolNavLink);
