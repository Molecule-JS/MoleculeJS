import { h, Element } from '../../../molecule-jsx/src/molecule-jsx';

import { Location } from 'history';
import { Match } from '../util/match-path';

import generatePath from '../util/generate-path';

export { h };

export default class MolRedirect extends Element {
  to!: string | Location;
  push!: boolean;
  from?: string;
  computedMatch?: Match;
  inactive: boolean = false;

  props!: {
    inactive?: boolean;
    to: string | Location;
    push?: boolean;
    from?: string;
    computedMatch?: Match;
  };

  static get properties() {
    return {
      inactive: {
        observer: 'perform',
      },
    };
  }

  computeTo(to: string | Location, computedMatch?: Match) {
    if (computedMatch) {
      if (typeof to === 'string') {
        return generatePath(to, computedMatch.params);
      }
      return {
        ...to,
        pathname: generatePath(to.pathname, computedMatch.params),
      };
    }

    return to;
  }

  connected() {
    this.perform();
  }

  perform() {
    if (this.inactive) return;

    const { history } = (window as any).$molRouter;
    // tslint:disable-next-line:no-this-assignment
    const { push } = this;

    const to = this.computeTo(this.to, this.computedMatch);

    if (push) {
      history.push(to);
    } else {
      history.replace(to);
    }
  }

  render() {
    return null;
  }
}

customElements.define('mol-redirect', MolRedirect);
