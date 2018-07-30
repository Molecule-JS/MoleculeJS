import { Element } from '../dist/molecule';

import { propTests } from '../../../test/common/props';
import { eventTests } from '../../../test/common/events';
import { attrTests } from '../../../test/common/attributes';
import { asyncPropTests } from '../../../test/common/async-props';

/// <reference path="../../node_modules/@types/mocha/index.d.ts" />
/// <reference path="../../node_modules/@types/chai/index.d.ts" />

const { expect } = chai;

describe('Molecule', () => {
  const testElement = document.getElementById('test-el');
  (window as any).observerVals = new Map<string, any>();
  const MoleculeSimple = Element((tmpl, container) => (container as any).innerHTML = tmpl);
  before(() => {
    (window as any).observerVals = new Map<string, any>();

    class TestElement extends MoleculeSimple {
      [x: string]: any;
      static get properties() {
        return {
          undefinedValue: undefined,
          alreadyGiven: {
            value: 404,
            attribute: true,
            type: Number,
          },
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

  it('Preset attributes are used',
     () => chai.expect((testElement as any).alreadyGiven!).to.equal(303));

  propTests(testElement);

  attrTests(testElement);

  eventTests(testElement);

  asyncPropTests(testElement);

  describe('afterRender', () => {
    it('afterRender gets passed correct value', (done) => {
      let called = 0;
      class E extends MoleculeSimple {
        static get properties() {
          return {
            a: 0,
          };
        }

        render({ a }: { a: number }) {
          return `${a}`;
        }

        afterRender(first: boolean) {
          if (first) {
            called++;
          }
          if (!first && called === 1) {
            called = 2;
          }
        }
      }

      customElements.define('x-ar1', E);

      const e = new E();
      document.body.appendChild(e);

      expect(called).to.equal(1);
      (e as any).a = 1;
      setTimeout(() => {
        expect(called).to.equal(2);
        done();
      },
                 10);
    });

    it('afterRender gets called on repeat renders', (done) => {
      let called = 0;
      class E extends MoleculeSimple {
        static get properties() {
          return {
            a: 0,
          };
        }

        render({ a }: { a: number }) {
          return `${a}`;
        }

        afterRender() {
          called++;
        }
      }

      customElements.define('x-ar2', E);

      const e = new E();
      document.body.appendChild(e);

      expect(called).to.equal(1);
      (e as any).a = 1;
      setTimeout(() => {
        expect(called).to.equal(2);
        done();
      },
                 10);
    });
  });

  describe('setProperty', () => {
    it('setProperty forces update', (done) => {
      class E extends MoleculeSimple {
        a!: number[];
        static get properties() {
          return {
            a: {
              observer: '_aChanged',
              value: () => [1],
            },
          };
        }

        render({ a }: { a: number }) {
          return `${a}`;
        }

        _aChanged(a: number[]) {
          if (a.length === 2) {
            done();
          }
        }
      }

      customElements.define('x-sp1', E);

      const e = new E();
      document.body.appendChild(e);

      e.a.push(2);
      e.setProperty('a');
    });
  });
});
