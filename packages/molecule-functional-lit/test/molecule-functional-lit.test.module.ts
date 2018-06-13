import { functionalMoleculeLit, html } from '../molecule-functional-lit.js';

import { propTests } from '../../../test/common-built/props.js';
import { eventTests } from '../../../test/common-built/events.js';
import { attrTests } from '../../../test/common-built/attributes.js';
import { asyncPropTests } from '../../../test/common-built/async-props.js';

//mocha.setup('bdd');

describe('Functional MoleculeLit', () => {
    const testElement = document.getElementById('test-el-func-lit');
    (window as any).observerVals = new Map<string, any>();
    before(() => {
        (window as any).observerVals = new Map<string, any>();
        
        const TestElement = functionalMoleculeLit({
            shortBool: Boolean,
            longBool: {
                type: Boolean,
                value: true,
                reflectToAttribute: true,
                notify: true
            },
            shortNumber: Number,
            longNumber: {
                type: Number,
                value: 123,
                reflectToAttribute: true,
                notify: true
            },
            stringProp: {
                type: String,
                value: 'StringProp'
            }
        })
        (({ shortBool, longBool, shortNumber, longNumber }) => html`<div id="results">
                    <span id="shortBool">${shortBool}</span>
                    <span id="longBool">${longBool}</span>

                    <span id="shortNumber">${shortNumber}</span>
                    <span id="longNumber">${longNumber}</span>
                </div>`);


        customElements.define('test-element-func-lit', TestElement);
    });

    propTests(testElement, {
        observers: false
    });

    attrTests(testElement);

    eventTests(testElement);

    asyncPropTests(testElement);
});