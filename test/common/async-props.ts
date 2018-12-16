/// <reference path="../../node_modules/@types/mocha/index.d.ts" />
/// <reference path="../../node_modules/@types/chai/index.d.ts" />

const { expect } = chai;

export const asyncPropTests = (testElement: any) =>
  describe('Handles async property setting', () => {
    it('Sets the resolved value of a Promise to a property', (done) => {
      testElement.longBool = false;
      testElement.longBool = new Promise((res) => {
        setTimeout(() => res(true), 10);
      });

      setTimeout(() => {
        expect(testElement.longBool).to.be.true;
        done();
      }, 30);
    });
  });
