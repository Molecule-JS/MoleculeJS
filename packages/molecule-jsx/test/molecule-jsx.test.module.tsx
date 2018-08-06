import MoleculeJsx from '../src/molecule-jsx';

import { propTests } from '../../../test/common/props';
import { eventTests } from '../../../test/common/events';
import { attrTests } from '../../../test/common/attributes';
import { asyncPropTests } from '../../../test/common/async-props';

// declare var MoleculeJsx: typeof import('../src/molecule-jsx');

/// <reference path="../../node_modules/@types/chai/index.d.ts" />

declare var sinon: typeof import('sinon');

const { expect } = chai;

const { render } = MoleculeJsx;

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
  });

  propTests(testElement);

  attrTests(testElement);

  eventTests(testElement);

  asyncPropTests(testElement);

  function getAttributes(node: HTMLElement) {
    const attrs: { [attr: string]: any } = {};
    for (let i = node.attributes.length; i--; ) {
      attrs[node.attributes[i].name] = node.attributes[i].value;
    }
    return attrs;
  }

  describe('render()', () => {
    let scratch: HTMLElement;

    beforeEach(() => {
      if (scratch) {
        document.body.removeChild(scratch);
      }
      scratch = document.createElement('div');
      (document.body || document.documentElement).appendChild(scratch);
    });

    after(() => {
      (scratch.parentNode as HTMLElement).removeChild(scratch);
      scratch = null as any;
    });

    it('should render a empty text node', () => {
      render(null, scratch);
      const c = scratch.childNodes;
      expect(c).to.have.length(1);
      expect((c[0] as any).data).to.equal('');
      expect(c[0].nodeName).to.equal('#text');
    });

    it('should create empty nodes (<* />)', () => {
      render(<div />, scratch);
      expect(scratch.childNodes).to.have.length(1);
      expect(scratch.childNodes[0].nodeName).to.equal('DIV');

      scratch.innerHTML = '';

      render(<span />, scratch);
      expect(scratch.childNodes).to.have.length(1);
      expect(scratch.childNodes[0].nodeName).to.equal('SPAN');

      scratch.innerHTML = '';

      render(<foo />, scratch);
      render(<x-bar />, scratch);
      expect(scratch.childNodes).to.have.length(1);
      expect(scratch.childNodes[0]).to.have.property('nodeName', 'X-BAR');
    });

    it('should nest empty nodes', () => {
      render(
        <div>
          <span />
          <foo />
          <x-bar />
        </div>,
        scratch,
      );

      expect(scratch.childNodes).to.have.length(1);
      expect(scratch.childNodes[0].nodeName).to.equal('DIV');

      const c = scratch.childNodes[0].childNodes;
      expect(c).to.have.length(3);
      expect(c[0].nodeName).to.equal('SPAN');
      expect(c[1].nodeName).to.equal('FOO');
      expect(c[2].nodeName).to.equal('X-BAR');
    });

    it('should not render falsy values', () => {
      render(
        <div>
          {null},{undefined},{false},{0},{NaN}
        </div>,
        scratch,
      );

      expect(scratch.firstChild).to.have.property('innerHTML', ',,,0,NaN');
    });

    it('should not render null', () => {
      render(null, scratch);
      expect(scratch.innerHTML).to.equal('');
    });

    it('should not render undefined', () => {
      render(undefined, scratch);
      expect(scratch.innerHTML).to.equal('');
    });

    it('should not render boolean true', () => {
      render(true, scratch);
      expect(scratch.innerHTML).to.equal('');
    });

    it('should not render boolean false', () => {
      render(false, scratch);
      expect(scratch.innerHTML).to.equal('');
    });

    it('should render NaN as text content', () => {
      render(NaN, scratch);
      expect(scratch.innerHTML).to.equal('NaN');
    });

    it('should render numbers (0) as text content', () => {
      render(0, scratch);
      expect(scratch.innerHTML).to.equal('0');
    });

    it('should render numbers (42) as text content', () => {
      render(42, scratch);
      expect(scratch.innerHTML).to.equal('42');
    });

    it('should render strings as text content', () => {
      render('Testing, huh! How is it going?', scratch);
      expect(scratch.innerHTML).to.equal('Testing, huh! How is it going?');
    });

    it('should clear falsy attributes', () => {
      const root = render(
        <div
          anull="anull"
          aundefined="aundefined"
          afalse="afalse"
          anan="aNaN"
          a0="a0"
        />,
        scratch,
      );

      render(
        <div
          anull={null}
          aundefined={undefined}
          afalse={false}
          anan={NaN}
          a0={0}
        />,
        scratch,
        root,
      );

      expect(
        getAttributes(scratch.firstChild as HTMLElement),
        'from previous truthy values',
      ).to.eql({
        a0: '0',
        anan: 'NaN',
      });

      scratch.innerHTML = '';

      render(
        <div
          anull={null}
          aundefined={undefined}
          afalse={false}
          anan={NaN}
          a0={0}
        />,
        scratch,
      );

      expect(
        getAttributes(scratch.firstChild as HTMLElement),
        'initial render',
      ).to.eql({
        a0: '0',
        anan: 'NaN',
      });
    });

    it('should clear falsy input values', () => {
      const root = render(
        <div>
          <input value={0} />
          <input value={false} />
          <input value={null} />
          <input value={undefined} />
        </div>,
        scratch,
      );

      expect((root as HTMLElement).children[0]).to.have.property('value', '0');
      expect((root as HTMLElement).children[1]).to.have.property(
        'value',
        'false',
      );
      expect((root as HTMLElement).children[2]).to.have.property('value', '');
      expect((root as HTMLElement).children[3]).to.have.property('value', '');
    });

    it('should clear falsy DOM properties', () => {
      let root: Node;
      function test(val: any) {
        root = render(
          <div>
            <input value={val} />
            <table border={val} />
          </div>,
          scratch,
          root,
        );
      }

      test('2');
      test(false);
      expect(scratch).to.have.property(
        'innerHTML',
        '<div><input><table></table></div>',
        'for false',
      );

      test('3');
      test(null);
      expect(scratch).to.have.property(
        'innerHTML',
        '<div><input><table></table></div>',
        'for null',
      );

      test('4');
      test(undefined);
      expect(scratch).to.have.property(
        'innerHTML',
        '<div><input><table></table></div>',
        'for undefined',
      );
    });

    it('should apply string attributes', () => {
      render(<div foo="bar" data-foo="databar" />, scratch);

      const div: any = scratch.childNodes[0];
      expect(div.attributes.length).to.equal(2);

      expect(div.attributes[0].name).to.equal('foo');
      expect(div.attributes[0].value).to.equal('bar');

      expect(div.attributes[1].name).to.equal('data-foo');
      expect(div.attributes[1].value).to.equal('databar');
    });

    it('should not serialize function props as attributes', () => {
      render(
        <div click={function a() {}} ONCLICK={function b() {}} />,
        scratch,
      );

      const div: any = scratch.childNodes[0];
      expect(div.attributes.length).to.equal(0);
    });

    it('should serialize object props as attributes', () => {
      render(
        <div
          foo={{ a: 'b' }}
          bar={{
            toString() {
              return 'abc';
            },
          }}
        />,
        scratch,
      );

      const div: any = scratch.childNodes[0];
      expect(div.attributes.length).to.equal(2);

      expect(div.attributes[0].name).equal('foo');
      expect(div.attributes[0].value).equal('[object Object]');

      expect(div.attributes[1].name).equal('bar');
      expect(div.attributes[1].value).equal('abc');
    });

    it('should apply class as String', () => {
      render(<div class="foo" />, scratch);
      expect(scratch.childNodes[0]).to.have.property('className', 'foo');
    });

    it('should alias className to class', () => {
      render(<div className="bar" />, scratch);
      expect(scratch.childNodes[0]).to.have.property('className', 'bar');
    });

    it('should apply style as String', () => {
      render(<div style="top:5px; position:relative;" />, scratch);
      expect((scratch.childNodes[0] as any).style.cssText)
        .that.matches(/top\s*:\s*5px\s*/)
        .and.matches(/position\s*:\s*relative\s*/);
    });

    it('should only register on* functions as handlers', () => {
      const click = () => {};
      const onclick = () => {};

      const proto = document.createElement('div').constructor.prototype;

      sinon.spy(proto, 'addEventListener');

      render(<div click={click} onClick={onclick} />, scratch);

      expect((scratch.childNodes[0] as any).attributes.length).to.equal(0);

      expect(proto.addEventListener.calledOnce).to.be.true.and.to.have.been;
      expect(
        proto.addEventListener.calledWithExactly(
          'click',
          sinon.match.func,
          false,
        ),
      ).to.be.true;

      proto.addEventListener.restore();
    });

    it('should add and remove event handlers', () => {
      const click = sinon.spy();
      const mousedown = sinon.spy();

      const proto = document.createElement('div').constructor.prototype;
      sinon.spy(proto, 'addEventListener');
      sinon.spy(proto, 'removeEventListener');

      function fireEvent(on: HTMLElement, type: string) {
        const e = document.createEvent('Event');
        e.initEvent(type, true, true);
        on.dispatchEvent(e);
      }

      render(<div onClick={() => click(1)} onMouseDown={mousedown} />, scratch);

      expect(proto.addEventListener.calledTwice).to.be.true;
      expect(
        proto.addEventListener.calledWith('click') &&
          proto.addEventListener.calledWith('mousedown'),
      ).to.be.true;

      fireEvent(scratch.childNodes[0] as HTMLElement, 'click');
      expect(click.calledOnce).to.be.true;
      expect(click.calledWith(1)).to.be.true;

      proto.addEventListener.resetHistory();
      click.resetHistory();

      render(
        <div onClick={() => click(2)} />,
        scratch,
        scratch.firstChild as Node,
      );

      expect(proto.addEventListener.called).to.be.false;

      expect(proto.removeEventListener.calledOnce).to.be.true;

      expect(proto.removeEventListener.calledWith('mousedown')).to.be.true;

      fireEvent(scratch.childNodes[0] as HTMLElement, 'click');
      expect(click.calledOnce).to.be.true;
      expect(click.calledWith(2)).to.be.true;

      fireEvent(scratch.childNodes[0] as HTMLElement, 'mousedown');
      expect(mousedown.called).to.be.false;

      proto.removeEventListener.resetHistory();
      click.resetHistory();
      mousedown.resetHistory();

      render(<div />, scratch, scratch.firstChild as Node);

      expect(proto.removeEventListener.calledOnce).to.be.true;

      expect(proto.removeEventListener.calledWith('click')).to.be.true;

      fireEvent(scratch.childNodes[0] as HTMLElement, 'click');
      expect(click.called).to.be.false;

      proto.addEventListener.restore();
      proto.removeEventListener.restore();
    });

    it('should use capturing for event props ending with *Capture', () => {
      const click = sinon.spy();
      const focus = sinon.spy();

      const root = render(
        <div onClickCapture={click} onFocusCapture={focus}>
          <button />
        </div>,
        scratch,
      );

      ((root as HTMLElement).firstElementChild as HTMLElement).click();
      ((root as HTMLElement).firstElementChild as HTMLElement).focus();

      expect(click.calledOnce, 'click').to.be.true;
    });

    it('should serialize style objects', () => {
      let root = render(
        <div
          style={{
            color: 'rgb(255, 255, 255)',
            background: 'rgb(255, 100, 0)',
            backgroundPosition: '10px 10px',
            'background-size': 'cover',
            padding: 5,
            top: 100,
            left: '100%',
          }}
        >
          test
        </div>,
        scratch,
      );

      const { style } = scratch.childNodes[0] as any;
      expect(style)
        .to.have.property('color')
        .that.equals('rgb(255, 255, 255)');
      expect(style)
        .to.have.property('background')
        .that.contains('rgb(255, 100, 0)');
      expect(style)
        .to.have.property('backgroundPosition')
        .that.equals('10px 10px');
      expect(style).to.have.property('backgroundSize', 'cover');
      expect(style).to.have.property('padding', '5px');
      expect(style).to.have.property('top', '100px');
      expect(style).to.have.property('left', '100%');

      root = render(
        <div style={{ color: 'rgb(0, 255, 255)' }}>test</div>,
        scratch,
        root,
      );

      expect((root as HTMLElement).style.cssText).to.equal(
        'color: rgb(0, 255, 255);',
      );

      root = render(<div style="display: inline;">test</div>, scratch, root);

      expect((root as HTMLElement).style.cssText).to.equal('display: inline;');

      root = render(
        <div style={{ backgroundColor: 'rgb(0, 255, 255)' }}>test</div>,
        scratch,
        root,
      );

      expect((root as HTMLElement).style.cssText).to.equal(
        'background-color: rgb(0, 255, 255);',
      );
    });

    it('should support dangerouslySetInnerHTML', () => {
      const html = '<b>foo &amp; bar</b>';
      let root = render(
        <div dangerouslySetInnerHTML={{ __html: html }} />,
        scratch,
      );

      expect(scratch.firstChild, 'set').to.have.property('innerHTML', html);
      expect(scratch.innerHTML).to.equal('<div>' + html + '</div>');

      root = render(
        <div>
          a<strong>b</strong>
        </div>,
        scratch,
        root,
      );

      expect(scratch, 'unset').to.have.property(
        'innerHTML',
        `<div>a<strong>b</strong></div>`,
      );

      render(<div dangerouslySetInnerHTML={{ __html: html }} />, scratch, root);

      expect(scratch.innerHTML, 're-set').to.equal('<div>' + html + '</div>');
    });

    it('should reconcile mutated DOM attributes', () => {
      // tslint:disable-next-line:ter-arrow-parens
      const check = (p: boolean) =>
        render(
          <input type="checkbox" checked={p} />,
          scratch,
          scratch.lastChild as Node,
        );
      const value = () => (scratch.lastChild as any).checked;
      // tslint:disable-next-line:ter-arrow-parens
      const setValue = (p: boolean) => ((scratch.lastChild as any).checked = p);
      check(true);
      expect(value()).to.equal(true);
      check(false);
      expect(value()).to.equal(false);
      check(true);
      expect(value()).to.equal(true);
      setValue(true);
      check(false);
      expect(value()).to.equal(false);
      setValue(false);
      check(true);
      expect(value()).to.equal(true);
    });

    it('should ignore props.children if children are manually specified', () => {
      expect(
        <div a children={['a', 'b']}>
          c
        </div>,
      ).to.eql(<div a>c</div>);
    });

    it('should reorder child pairs', () => {
      let root = render(
        <div>
          <a>a</a>
          <b>b</b>
        </div>,
        scratch,
      );

      const a = scratch.firstChild!.firstChild;
      const b = scratch.firstChild!.lastChild;

      expect(a).to.have.property('nodeName', 'A');
      expect(b).to.have.property('nodeName', 'B');

      root = render(
        <div>
          <b>b</b>
          <a>a</a>
        </div>,
        scratch,
        root,
      );

      expect(scratch.firstChild!.firstChild).to.have.property('nodeName', 'B');
      expect(scratch.firstChild!.lastChild).to.have.property('nodeName', 'A');
      expect(scratch.firstChild!.firstChild).to.equal(b);
      expect(scratch.firstChild!.lastChild).to.equal(a);
    });

    it('should not merge attributes with node created by the DOM', () => {
      const html = (htmlString: TemplateStringsArray) => {
        const div = document.createElement('div');
        div.innerHTML = '' + htmlString;
        return div.firstChild;
      };

      const DOMElement = html`<div><a foo="bar"></a></div>`;
      const preactElement = (
        <div>
          <a />
        </div>
      );

      render(preactElement, scratch, DOMElement as Node);
      expect(scratch).to.have.property('innerHTML', '<div><a></a></div>');
    });
  });
});
