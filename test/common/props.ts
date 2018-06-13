/// <reference path="../../node_modules/@types/mocha/index.d.ts" />
/// <reference path="../../node_modules/@types/chai/index.d.ts" />

const { expect } = chai;

export const propTests = (testElement: any) =>
    describe('properties', () => {
        it('correct type', () => {
            expect(testElement.longBool).to.be.a('boolean');
            expect(testElement.longNumber).to.be.a('number');
            expect(testElement.stringProp).to.be.a('string');
        });

        it('correct value', () => {
            expect(testElement.longBool).to.be.true;
            expect(testElement.longNumber).to.equal(123);
            expect(testElement.stringProp).to.equal('StringProp')
        });

        it('changes the value', () => {
            testElement.longBool = false;
            expect(testElement.longBool).to.be.false;
            const random = Math.random() * 1000;
            testElement.longNumber = random;
            expect(testElement.longNumber).to.equal(random);
        });

        it('calls observer', () => {
            expect((window as any).observerVals.get('bool')).to.equal(testElement.longBool);
            expect((window as any).observerVals.get('number')).to.equal(testElement.longNumber);
        });

    });