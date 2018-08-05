import Molecule from '../../packages/molecule/src/molecule';

/// <reference path="../../node_modules/@types/mocha/index.d.ts" />
/// <reference path="../../node_modules/@types/chai/index.d.ts" />

const MoleculeSimple = Molecule.Element(
  (tmpl, container) => ((container as any).innerHTML = tmpl),
);

const { expect } = chai;

export const eventTests = (testElement: any) =>
  describe('events', () => {
    it('fires events', (done) => {
      const listener = () => (eventFired = true);
      let eventFired = false;
      setTimeout(() => {
        expect(eventFired, 'custom event did not fire').to.be.true;
        testElement.removeEventListener('long-bool-changed', listener);
        done();
      }, 20);

      testElement.addEventListener('long-bool-changed', listener);

      testElement.longBool = true;
      testElement.longBool = false;
    });

    it('event has correct detail', (done) => {
      const listener = ({ detail }: { detail: any }) => {
        expect(detail).to.be.true;
        testElement.removeEventListener('long-bool-changed', listener);
        done();
      };
      testElement.addEventListener('long-bool-changed', listener);

      testElement.longBool = true;
    });

    it('Can change event name', (done) => {
      class E extends MoleculeSimple {
        a!: string;

        static get properties() {
          return {
            a: {
              event: 'a-diff',
              value: '',
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
          .substring(2)}-ev-1`,
        E,
      );

      const e = new E();
      document.body.appendChild(e);

      e.addEventListener('a-diff', (e) => {
        expect((e as any).detail).to.equal('test');
        done();
      });

      e.a = 'test';
    });
  });
