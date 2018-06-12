/// <reference path="../../node_modules/@types/mocha/index.d.ts" />
/// <reference path="../../node_modules/@types/chai/index.d.ts" />

const { expect } = chai;

export const eventTests = (testElement: any) =>

    describe('events', () => {
        it('fires events', done => {
            const listener = () => eventFired = true;
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

        it('event has correct deatil', done => {
            const listener = ({ detail }: { detail: any }) => {
                expect(detail).to.be.true;
                testElement.removeEventListener('long-bool-changed', listener);
                done();
            };
            testElement.addEventListener('long-bool-changed', listener);

            testElement.longBool = true;
        });
    });