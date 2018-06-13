/// <reference path="../../node_modules/@types/mocha/index.d.ts" />
/// <reference path="../../node_modules/@types/chai/index.d.ts" />
const { expect } = chai;
export const attrTests = (testElement) => describe('attributes', () => {
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
});
