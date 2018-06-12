import { Molecule } from '../src/molecule.js';

import { propTests } from '../../../test/common/props';
import { eventTests } from '../../../test/common/events';
import { attrTests } from '../../../test/common/attributes';
import { asyncPropTests } from '../../../test/common/async-props';

//mocha.setup('bdd');

describe('molecule', () => {
    let testElement: any;
    let observerVals = new Map<string, any>();
    const MoleculeSimple = Molecule((tmpl, container) => (container as any).innerHTML = tmpl);
    before(() => {
        observerVals = new Map<string, any>();
        testElement = document.getElementById('test-el');

        class TestElement extends MoleculeSimple {
            static get properties() {
                return {
                    shortBool: Boolean,
                    longBool: {
                        type: Boolean,
                        value: true,
                        reflectToAttribute: true,
                        observer: 'boolObserver',
                        notify: true
                    },
                    shortNumber: Number,
                    longNumber: {
                        type: Number,
                        value: 123,
                        reflectToAttribute: true,
                        observer: 'numberObserver',
                        notify: true
                    },
                    stringProp: {
                        type: String,
                        value: 'StringProp'
                    }
                }
            }

            render() {
                return `<div id="results">
                                        <span id="shortBool">${this.shortBool}</span>
                                        <span id="longBool">${this.longBool}</span>

                                        <span id="shortNumber">${this.shortNumber}</span>
                                        <span id="longNumber">${this.longNumber}</span>
                                    </div>`
            }

            boolObserver(bool: boolean) {
                observerVals.set('bool', bool);
            }

            numberObserver(num: number) {
                observerVals.set('number', num);
            }
        }

        customElements.define('test-element', TestElement);
    });
    
    propTests(testElement, observerVals);

    attrTests(testElement);

    eventTests(testElement);

    asyncPropTests(testElement);
});