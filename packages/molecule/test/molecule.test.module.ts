import * as Molecule from '../src/molecule';

import { propTests } from '../../../test/common/props';
import { eventTests } from '../../../test/common/events';
import { attrTests } from '../../../test/common/attributes';
import { asyncPropTests } from '../../../test/common/async-props';

/// <reference path="../../node_modules/@types/mocha/index.d.ts" />
/// <reference path="../../node_modules/@types/chai/index.d.ts" />
declare var sinon: typeof import('sinon');

(() => {
  const { expect } = chai;

  describe('Molecule', () => {
    const testElement = document.createElement('test-element');
    document.body.appendChild(testElement);
    testElement.setAttribute('already-given', '303');
    (window as any).observerVals = new Map<string, any>();

    abstract class MoleculeSimple extends Molecule.MoleculeElement<string> {
      renderer(template: string, container: Element | DocumentFragment) {
        return ((container as any).innerHTML = template);
      }
    }

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
                                        <span id="shortBool">${
                                          this.shortBool
                                        }</span>
                                        <span id="longBool">${
                                          this.longBool
                                        }</span>

                                        <span id="shortNumber">${
                                          this.shortNumber
                                        }</span>
                                        <span id="longNumber">${
                                          this.longNumber
                                        }</span>
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

    it('Preset attributes are used', () =>
      chai.expect((testElement as any).alreadyGiven!).to.equal(303));

    it('Preset props are kept', () => {
      const el = document.createElement('test-element');
      (el as any).shortBool = true;
      document.body.appendChild(el);
      expect((el as any).shortBool).to.be.true;
    });

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
        }, 10);
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
        }, 10);
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

    describe('$', () => {
      it('Items with id are in $', () => {
        class E extends MoleculeSimple {
          static get properties() {
            return {
              a: 'test-id-1',
            };
          }

          render({ a }: { a: number }) {
            return `<p id=${a}>item</p>`;
          }
        }

        customElements.define('x-sel', E);

        const e = new E();
        document.body.appendChild(e);

        expect(e.$['test-id-1'].tagName).to.equal('P');
        expect(e.$['test-id-1'].textContent).to.equal('item');
      });
    });

    describe('Lifecycle', () => {
      it('Connected gets called before render', () => {
        let called = false;

        class E extends MoleculeSimple {
          static get properties() {
            return {
              a: 'test-id-1',
            };
          }

          connected() {
            called = !called;
            expect(this.shadowRoot!.childElementCount).to.equal(0);
          }

          render({ a }: { a: number }) {
            return `<p id=${a}>item</p>`;
          }
        }

        customElements.define('x-con', E);

        const e = new E();

        expect(called).to.be.false;
        document.body.appendChild(e);
        expect(called).to.be.true;
      });

      it('Disonnected gets called', () => {
        let called = false;

        class E extends MoleculeSimple {
          static get properties() {
            return {
              a: 'test-id-1',
            };
          }

          disconnected() {
            called = !called;
          }

          render({ a }: { a: number }) {
            return `<p id=${a}>item</p>`;
          }
        }

        customElements.define('x-dis', E);

        const e = new E();
        document.body.appendChild(e);

        expect(called).to.be.false;
        document.body.removeChild(e);
        expect(called).to.be.true;
      });

      it('DisonnectedCallback works without disconnected', () => {
        // Make instanbul happy
        const called = false;

        class E extends MoleculeSimple {
          static get properties() {
            return { a: 'test-id-1' };
          }

          render({ a }: { a: number }) {
            return `<p id=${a}>item</p>`;
          }
        }

        customElements.define('x-dis2', E);

        const e = new E();
        document.body.appendChild(e);

        expect(called).to.be.false;
        document.body.removeChild(e);
        expect(called).to.be.false;
      });

      it('should work when reconnected', (done) => {
        class E extends MoleculeSimple {
          static get properties() {
            return { a: 'test-id-1' };
          }

          render({ a }: { a: number }) {
            return `<p id=${a}>item</p>`;
          }
        }

        customElements.define('x-rec-1', E);

        const e = new E();
        document.body.appendChild(e);

        document.body.removeChild(e);

        document.body.appendChild(e);

        done();
      });
    });

    it('Render callback get called', (done) => {
      class E extends MoleculeSimple {
        static get properties() {
          return {
            a: 'test-id-1',
          };
        }

        render({ a }: { a: number }) {
          return `<p id=${a}>item</p>`;
        }
      }

      customElements.define('x-rc', E);

      const e = new E();
      document.body.appendChild(e);

      e.refresh(() => {
        done();
      });
    });

    it('Observer methods can block render', () => {
      class E extends MoleculeSimple {
        a!: number;
        static get properties() {
          return {
            a: {
              observer: '_aC',
              value: 3,
            },
          };
        }

        _aC(a: number) {
          if (a === 3) return false;
          return true;
        }

        render({ a }: { a: number }) {
          return `<p>item ${a}</p>`;
        }
      }

      customElements.define('x-obs-1', E);

      const e = new E();
      document.body.appendChild(e);

      e.a++;
      expect(e.shadowRoot!.innerHTML).equal('<p>item 3</p>');
    });

    it('Not declaring render throws', () => {
      class E extends (MoleculeSimple as any) {
        static get properties() {
          return {
            a: 3,
          };
        }
      }

      customElements.define('x-throw', E);

      const e = new E();

      expect(e.render).to.throw;
    });

    describe('Warnings', () => {
      before(() => {
        sinon.stub(console, 'warn');
        sinon.stub(console, 'error');
      });

      after(() => {
        (console.warn as any).resetBehavior();
        (console.error as any).resetBehavior();
      });

      it('Warns of rich data attributes', () => {
        class E extends MoleculeSimple {
          static get properties() {
            return {
              a: {
                attribute: true,
                type: Object,
              },
              b: {
                attribute: true,
                type: Array,
              },
            };
          }

          render() {
            return '';
          }
        }

        customElements.define('x-warn-1', E);

        const e = new E();

        document.body.appendChild(e);

        expect((console.warn as any).calledTwice).to.be.true;
        expect(
          (console.warn as any).calledWith(
            // tslint:disable-next-line:quotemark
            "Property a: Rich Data shouldn't be set as attribute!",
          ),
        ).to.be.true;
        expect(
          (console.warn as any).calledWith(
            // tslint:disable-next-line:quotemark
            "Property b: Rich Data shouldn't be set as attribute!",
          ),
        ).to.be.true;
      });

      it('Warns of rich missing observers', () => {
        class E extends MoleculeSimple {
          static get properties() {
            return {
              a: {
                observer: 'doesNotExist',
              },
            };
          }

          render() {
            return '';
          }
        }

        customElements.define('x-warn-2', E);

        const e = new E();

        document.body.appendChild(e);

        expect((console.error as any).calledOnce).to.be.true;
        expect(
          (console.error as any).calledWith(
            // tslint:disable-next-line:quotemark
            'Property a: Method doesNotExist not defined!',
          ),
        ).to.be.true;
      });
    });
  });
})();
