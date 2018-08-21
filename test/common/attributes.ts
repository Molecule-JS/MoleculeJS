import Molecule from '../../packages/molecule/src/molecule';

/// <reference path="../../node_modules/@types/mocha/index.d.ts" />
/// <reference path="../../node_modules/@types/chai/index.d.ts" />

const MoleculeSimple = Molecule.createBase(
  (tmpl, container) => ((container as any).innerHTML = tmpl),
);

const { expect } = chai;

export const attrTests = (testElement: any) =>
  describe('attributes', () => {
    it('sets attributes after property changes', () => {
      testElement.longNumber = 123;
      expect(testElement.getAttribute('long-number')).to.equal('123');
    });

    it('removes false boolean properties', () => {
      testElement.longBool = false;
      expect(testElement.hasAttribute('long-bool')).to.be.false;
    });

    it('sets boolean attributes correctly', () => {
      testElement.longBool = true;
      expect(testElement.hasAttribute('long-bool')).to.be.true;
      expect(testElement.getAttribute('long-bool')).to.equal('');
    });

    it('changes the property', () => {
      testElement.setAttribute('long-number', '456');
      expect(testElement.longNumber).to.equal(456);

      testElement.longBool = true;
      testElement.removeAttribute('long-bool');
      expect(testElement.longBool).to.be.false;

      testElement.setAttribute('long-bool', '');
      expect(testElement.longBool).to.be.true;
    });

    it('Can change attribute name', () => {
      class E extends MoleculeSimple {
        a!: string;

        static get properties() {
          return {
            a: {
              attribute: 'a-changed',
              value: 'test',
            },
          };
        }

        render() {
          return `<p>test</p>`;
        }
      }

      customElements.define(
        `x-${Math.random()
          .toString()
          .substring(2)}-attr-1`,
        E,
      );

      const e = new E();
      document.body.appendChild(e);

      expect(e.getAttribute('a-changed')).to.equal('test');

      e.a = 'test2';

      expect(e.getAttribute('a-changed')).to.equal('test2');

      e.setAttribute('a-changed', 'test3');

      expect(e.a).to.equal('test3');
    });

    it('Removes empty atring attrs', () => {
      class E extends MoleculeSimple {
        a!: string;

        static get properties() {
          return {
            a: {
              attribute: true,
              value: 'test',
            },
          };
        }

        render() {
          return `<p>test</p>`;
        }
      }

      customElements.define(
        `x-${Math.random()
          .toString()
          .substring(2)}-attr-2`,
        E,
      );

      const e = new E();
      document.body.appendChild(e);

      e.setAttribute('a', '');
      expect(e.hasAttribute('a')).to.be.false;

      expect(e.a).to.equal('');

      e.setAttribute('a', 'null');
      expect(e.hasAttribute('a')).to.be.false;

      expect(e.a).to.equal('');

      e.setAttribute('a', 'undefined');
      expect(e.hasAttribute('a')).to.be.false;

      expect(e.a).to.equal('');

      e.removeAttribute('a');
      expect(e.hasAttribute('a')).to.be.false;

      expect(e.a).to.equal('');
    });

    it('Works when resetting same value', () => {
      class E extends MoleculeSimple {
        a!: string;
        b!: boolean;

        static get properties() {
          return {
            a: {
              attribute: true,
              value: 'test',
            },
            b: {
              attribute: true,
              value: true,
              type: Boolean,
            },
          };
        }

        render() {
          return `<p>test</p>`;
        }
      }

      customElements.define(
        `x-${Math.random()
          .toString()
          .substring(2)}-attr-3`,
        E,
      );

      const e = new E();
      document.body.appendChild(e);

      e.a = 'true';
      e.a = 'true';

      e.removeAttribute('b');

      expect(e.b).to.be.false;
    });
  });
