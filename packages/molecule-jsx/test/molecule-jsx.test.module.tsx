import MoleculeJsx, { VNode } from '../src/molecule-jsx';

import { propTests } from '../../../test/common/props';
import { eventTests } from '../../../test/common/events';
import { attrTests } from '../../../test/common/attributes';
import { asyncPropTests } from '../../../test/common/async-props';

// declare var MoleculeJsx: typeof import('../src/molecule-jsx');

/// <reference path="../../node_modules/@types/chai/index.d.ts" />

const { expect } = chai;

describe('MoleculeJsx', () => {
  const testElement = document.createElement('test-element-jsx');
  document.body.appendChild(testElement);
  (window as any).observerVals = new Map<string, any>();

  before(() => {
    (window as any).observerVals = new Map<string, any>();

    class TestElementJsx extends MoleculeJsx.Element {
      [x: string]: any;
      static get properties() {
        return {
          shortBool: false,
          longBool: {
            type: Boolean,
            value: true,
            attribute: true,
            observer: 'boolObserver',
            event: true,
          },
          shortNumber: 0,
          longNumber: {
            type: Number,
            value: 123,
            attribute: true,
            observer: 'numberObserver',
            event: true,
          },
          stringProp: {
            type: String,
            value: 'StringProp',
          },
        };
      }

      render() {
        return (
          <div id="results">
            <span id="shortBool">{this.shortBool}</span>
            <span id="longBool">{this.longBool}</span>

            <span id="shortNumber">{this.shortNumber}</span>
            <span id="longNumber">{this.longNumber}</span>
          </div>
        );
      }

      boolObserver(bool: boolean) {
        (window as any).observerVals.set('bool', bool);
      }

      numberObserver(num: number) {
        (window as any).observerVals.set('number', num);
      }
    }

    customElements.define('test-element-jsx', TestElementJsx);
  });

  describe('createElement', () => {
    it('Works with no props', () => {
      const vn1 = (MoleculeJsx.createElement as any)('div', null);
      expect(vn1.nodeName).to.eq('div');
      expect(vn1.props).to.be.empty;
      expect(vn1.children).to.be.empty;
    });

    it('Accepts children prop', () => {
      const vn1 = MoleculeJsx.createElement(
        'div',
        {
          children: [MoleculeJsx.createElement('p')],
        },
        MoleculeJsx.createElement('span'),
      );
      expect(vn1.nodeName).to.eq('div');
      expect(vn1.props).to.be.empty;
      expect(vn1.children.length).to.eq(2);
      expect((vn1.children[0] as VNode).nodeName).to.eq('span');
      expect((vn1.children[1] as VNode).nodeName).to.eq('p');
    });
  });

  propTests(testElement);

  attrTests(testElement);

  eventTests(testElement);

  asyncPropTests(testElement);
});
