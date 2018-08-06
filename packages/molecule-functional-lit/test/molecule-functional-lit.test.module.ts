import { functionalMoleculeLit, html } from '../src/molecule-functional-lit';

import { propTests } from '../../../test/common/props';
import { eventTests } from '../../../test/common/events';
import { attrTests } from '../../../test/common/attributes';
import { asyncPropTests } from '../../../test/common/async-props';

describe('Functional MoleculeLit', () => {
  const testElement = document.createElement('test-element-func-lit');
  document.body.appendChild(testElement);
  (window as any).observerVals = new Map<string, any>();
  before(() => {
    (window as any).observerVals = new Map<string, any>();

    const TestElement = functionalMoleculeLit({
      shortBool: false,
      longBool: {
        type: Boolean,
        value: true,
        attribute: true,
        event: true,
      },
      shortNumber: 0,
      longNumber: {
        type: Number,
        value: 123,
        attribute: true,
        event: true,
      },
      stringProp: {
        type: String,
        value: 'StringProp',
      },
    })(
      (props = {}) => html`<div id="results">
  <span id="shortBool">${props.shortBool!}</span>
  <span id="longBool">${props.longBool!}</span>

  <span id="shortNumber">${props.shortNumber!}</span>
  <span id="longNumber">${props.longNumber!}</span>
</div>`,
    );
    customElements.define('test-element-func-lit', TestElement);
  });

  propTests(testElement, {
    observers: false,
  });

  attrTests(testElement);

  eventTests(testElement);

  asyncPropTests(testElement);
});
