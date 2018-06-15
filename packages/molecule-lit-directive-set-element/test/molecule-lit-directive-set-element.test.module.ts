import { MoleculeLit, render, html } from '../../molecule-lit/module/molecule-lit.js';

import { setElement } from '../module/molecule-lit-directive-set-element.js';

const { expect } = chai;

describe('Molecule', () => {
  let div: HTMLElement;
  before(() => {
    div = document.createElement('div');
    document.body.appendChild(div);

    class TestElementSet extends MoleculeLit {
      static get properties() {
        return {
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
        };
      }

      render() {
        return html`<div id="results">
                        <span id="shortBool">${this.shortBool}</span>
                        <span id="longBool">${this.longBool}</span>
                        <span id="shortNumber">${this.shortNumber}</span>
                        <span id="longNumber">${this.longNumber}</span>
                    </div>
                    <slot></slot>`;
      }
    }

    customElements.define('test-element-set', TestElementSet);
    render(html`
              Successfully set element here:
              ${setElement(TestElementSet, {
                props: {
                  shortBool: false,
                  shortNumber: 33333,
                  longNumber: 45,
                  stringProp: 'Albert',
                },
                attributes: {
                  class: 'set-el',
                },
                innerHTML: '<button>Click</button>',
              })}
              `,
           div);
  });

  it('Inserted Element', () => {
    const children = div.children;
    const insertedElement = children[0];
    expect(insertedElement).to.be.an('HTMLElement');
  });

  it('Correct props', () => {
    const insertedElement = div.children[0];
    expect((insertedElement as any).shortBool).to.be.false;
    expect((insertedElement as any).shortNumber).to.equal(33333);
    expect((insertedElement as any).longNumber).to.equal(45);
    expect((insertedElement as any).stringProp).to.equal('Albert');
  });

  it('Correct attributes', () => {
    const insertedElement = div.children[0];
    expect(insertedElement.className).to.equal('set-el');
    expect(insertedElement.getAttribute('long-number')).to.equal('45');
    expect(insertedElement.hasAttribute('long-bool')).to.be.true;
  });

  it('Correct innerHTML', () => {
    const insertedElement = div.children[0];
    expect(insertedElement.innerHTML).to.equal('<button>Click</button>');
  });
});
