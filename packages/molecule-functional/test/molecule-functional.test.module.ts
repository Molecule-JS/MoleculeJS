import { functionalMolecule } from '../dist/molecule-functional';

import { propTests } from '../../../test/common/props';
import { eventTests } from '../../../test/common/events';
import { attrTests } from '../../../test/common/attributes';
import { asyncPropTests } from '../../../test/common/async-props';

describe('Functional Molecule', () => {
  const testElement = document.getElementById('test-el-func');
  (window as any).observerVals = new Map<string, any>();
  const templateFunction = (tmpl: string,
                            container: Element | DocumentFragment) => {
    (container as any).innerHTML = tmpl;
  };

  before(() => {
    (window as any).observerVals = new Map<string, any>();
    const TestElement = functionalMolecule(templateFunction)({
      shortBool: Boolean,
      longBool: {
        type: Boolean,
        value: true,
        reflectToAttribute: true,
        notify: true,
      },
      shortNumber: Number,
      longNumber: {
        type: Number,
        value: 123,
        reflectToAttribute: true,
        notify: true,
      },
      stringProp: {
        type: String,
        value: 'StringProp',
      },
    })((props = {}) => `<div id="results">
                    <span id="shortBool">${(props as any).shortBool}</span>
                    <span id="longBool">${(props as any).longBool}</span>

                    <span id="shortNumber">${(props as any).shortNumber}</span>
                    <span id="longNumber">${(props as any).longNumber}</span>
                </div>`);

    customElements.define('test-element-func', TestElement);
  });

  propTests(testElement, {
    observers: false,
  });

  attrTests(testElement);

  eventTests(testElement);

  asyncPropTests(testElement);
});
