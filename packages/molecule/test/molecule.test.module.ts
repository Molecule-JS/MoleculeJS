import { Element } from '../module/molecule.js';

import { propTests } from '../../../test/common-built/props.js';
import { eventTests } from '../../../test/common-built/events.js';
import { attrTests } from '../../../test/common-built/attributes.js';
import { asyncPropTests } from '../../../test/common-built/async-props.js';

describe('Molecule', () => {
  const testElement = document.getElementById('test-el');
  (window as any).observerVals = new Map<string, any>();
  const MoleculeSimple = Element((tmpl, container) => (container as any).innerHTML = tmpl);
  before(() => {
    (window as any).observerVals = new Map<string, any>();

    class TestElement extends MoleculeSimple {
      static get properties() {
        return {
          shortBool: Boolean,
          longBool: {
            type: Boolean,
            value: true,
            reflectToAttribute: true,
            observer: 'boolObserver',
            notify: true,
          },
          shortNumber: Number,
          longNumber: {
            type: Number,
            value: 123,
            reflectToAttribute: true,
            observer: 'numberObserver',
            notify: true,
          },
          stringProp: {
            type: String,
            value: 'StringProp',
          },
        };
      }

      render() {
        return `<div id="results">
                                        <span id="shortBool">${this.shortBool}</span>
                                        <span id="longBool">${this.longBool}</span>

                                        <span id="shortNumber">${this.shortNumber}</span>
                                        <span id="longNumber">${this.longNumber}</span>
                                    </div>`;
      }

      boolObserver(bool: boolean) {
        (window as any).observerVals.set('bool', bool);
      }

      numberObserver(num: number) {
        (window as any).observerVals.set('number', num);
      }
    }

    customElements.define('test-element', TestElement);
  });

  propTests(testElement);

  attrTests(testElement);

  eventTests(testElement);

  asyncPropTests(testElement);
});
