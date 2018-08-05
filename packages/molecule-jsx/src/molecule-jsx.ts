import {
  Element as MoleculeElement,
  createProperty,
  camelCaseToKebab,
  getAttributeforProp,
} from '../../molecule/src/molecule';
import { diff } from './lib/vdom/diff';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
    interface ElementClass {
      render(props: { [prop: string]: any }): any;
    }
    interface ElementAttributesProperty {
      props: undefined;
    }
  }
}

export { createProperty, camelCaseToKebab, getAttributeforProp };

const domMap = new WeakMap<container, Node>();

export interface Class<T> {
  new (): T;
  prototype: T;
}

export type container = Element | DocumentFragment;
export type VDomElement = VNode | string;

export class VNode {
  nodeName: string | Class<HTMLElement>;
  props: { [prop: string]: any };
  children: VDomElement[];
  key: string;

  constructor(
    nodeName: string | Class<HTMLElement>,
    props: { [prop: string]: any },
    children: VDomElement[],
    key: string,
  ) {
    this.nodeName = nodeName;
    this.props = props;
    this.children = children;
    this.key = key;
  }
}

export function createElement(
  tag: string | Class<HTMLElement>,
  props: { [prop: string]: any } = {},
  // tslint:disable-next-line
  ...children: VDomElement[]
): VNode {
  if (!props) {
    props = {};
  }

  if ('children' in props) {
    children = children.concat(props.children);
    delete props.children;
  }

  return new VNode(tag, props, children, props.key);
}

export function render(vnode: VNode, container: container) {
  const dom = diff(vnode, container, domMap.get(container));
  domMap.set(container, dom!);
  return dom;
}

const MoleculeJSX = MoleculeElement(render);

export { MoleculeJSX as Element };

export default {
  createProperty,
  camelCaseToKebab,
  getAttributeforProp,
  createElement,
  Element: MoleculeJSX,
};
