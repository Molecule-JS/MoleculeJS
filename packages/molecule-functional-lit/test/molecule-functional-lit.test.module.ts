import { functionalMoleculeLit, html } from '../dist/molecule-functional-lit';

import { propTests } from '../../../test/common/props';
import { eventTests } from '../../../test/common/events';
import { attrTests } from '../../../test/common/attributes';
import { asyncPropTests } from '../../../test/common/async-props';

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
    })((props = {}) => html`<div id="results">
  <span id="shortBool">${props.shortBool!}</span>
  <span id="longBool">${props.longBool!}</span>

  <span id="shortNumber">${props.shortNumber!}</span>
  <span id="longNumber">${props.longNumber!}</span>
</div>`);
    customElements.define('test-element-func-lit', TestElement);
  });

  propTests(testElement, {
    observers: false,
  });

  attrTests(testElement);

  eventTests(testElement);

  asyncPropTests(testElement);
});
