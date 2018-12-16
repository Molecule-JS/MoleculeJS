import { h, Element } from '../../../molecule-jsx/src/molecule-jsx';

import { createLocation, Location } from 'history';

import { Router } from '../molecule-router';

export { h };

export const isModifiedEvent = (event: MouseEvent) =>
  !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);

const style = {
  color: 'inherit',
  'text-decoration': 'inherit',
  font: 'inherit',
};

export default class MolRouterLink extends Element {
  to!: string | Location;
  replace: boolean = false;
  router!: Router;
  current!: Location;
  target?: string;

  props!: {
    to: string | Location;
    replace?: boolean;
    target?: string;
  };

  static get properties() {
    return {
      to: {},
      target: {},
      current: undefined,
    };
  }

  connected() {
    this.router = (window as any).$molRouter;
    this.router.addLink(this);

    this.handleClick = this.handleClick.bind(this);
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

  render() {
    if (!this.router) return null;

    const location =
      typeof this.to === 'string'
        ? createLocation(this.to, null, undefined, this.current)
        : this.to;

    const href = this.router.history.createHref(location);

    return (
      <a
        target={this.target}
        href={href}
        onClick={this.handleClick}
        style={style}>
        <slot />
      </a>
    );
  }
}

customElements.define('mol-router-link', MolRouterLink);
