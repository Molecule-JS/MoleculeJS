import * as MoleculeLit from '../src/molecule-lit';

import { propTests } from '../../../test/common/props';
import { eventTests } from '../../../test/common/events';
import { attrTests } from '../../../test/common/attributes';
import { asyncPropTests } from '../../../test/common/async-props';

// declare var MoleculeLit: typeof import('../src/molecule-lit');

const { Element, html } = MoleculeLit;

describe('MoleculeLit', () => {
  const testElement = document.createElement('test-element-lit');
  document.body.appendChild(testElement);
  (window as any).observerVals = new Map<string, any>();

  before(() => {
    (window as any).observerVals = new Map<string, any>();

    class TestElementLit extends Element {
      [x: string]: any;
      static get properties() {
        return {
          shortBool: false,
          longBool: {
            type: Boolean,
            value: true,
            attribute: true,
            observer: 'boolObserver',
            event: true,
          },
          shortNumber: 0,
          longNumber: {
            type: Number,
            value: 123,
            attribute: true,
            observer: 'numberObserver',
            event: true,
          },
          stringProp: {
            type: String,
            value: 'StringProp',
          },
        };
      }

      render() {
        return html`
          <div id="results">
            <span id="shortBool">${this.shortBool}</span>
            <span id="longBool">${this.longBool}</span>

            <span id="shortNumber">${this.shortNumber}</span>
            <span id="longNumber">${this.longNumber}</span>
          </div>
        `;
      }

      boolObserver(bool: boolean) {
        (window as any).observerVals.set('bool', bool);
      }

      numberObserver(num: number) {
        (window as any).observerVals.set('number', num);
      }
    }

    customElements.define('test-element-lit', TestElementLit);
  });

  propTests(testElement);

  attrTests(testElement);

  eventTests(testElement);

  asyncPropTests(testElement);
});
