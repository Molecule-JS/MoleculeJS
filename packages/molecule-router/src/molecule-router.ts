import {
  createBrowserHistory,
  History,
  BrowserHistoryBuildOptions,
  UnregisterCallback,
  Location,
} from 'history';
import { Match } from './util/match-path';

import Link from './elements/link';
import NavLink from './elements/nav-link';
import Redirect from './elements/redirect';
import Route from './elements/route';
import Switch from './elements/switch';

export class Router {
  app: HTMLElement;
  history: History;
  unlisten: UnregisterCallback;
  links: HTMLElement[] = [];
  routes: HTMLElement[] = [];
  current!: Location;
  match: Match = {
    path: '/',
    url: '/',
    params: {},
    isExact: false,
  };

  constructor(app: HTMLElement, config?: BrowserHistoryBuildOptions) {
    this.app = app;
    this.history = createBrowserHistory(config);
    (window as any).$molRouter = this;

    this.current = this.history.location;

    this.unlisten = this.history.listen(() => {
      this.current = this.history.location;

      for (const link of this.links) {
        (link as any).current = this.current;
      }
      for (const route of this.routes) {
        (route as any).current = this.current;
      }
    });
  }

  addLink(link: HTMLElement) {
    this.links.push(link);
    (link as any).current = this.current;
  }

  removeLink(link: HTMLElement) {
    const i = this.links.indexOf(link);
    if (i < 0) {
      return;
    }
    this.links = this.links.splice(i, 1);
  }

  addRoute(route: HTMLElement) {
    this.routes.push(route);
    (route as any).current = this.current;
  }

  removeRoute(route: HTMLElement) {
    const i = this.routes.indexOf(route);
    if (i < 0) {
      return;
    }
    this.routes = this.routes.splice(i, 1);
  }
}

export { Link, NavLink, Redirect, Route, Switch };

export default {
  Link,
  NavLink,
  Redirect,
  Route,
  Switch,
  Router,
};
