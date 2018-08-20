import {
  createBase,
  createProperty,
  camelCaseToKebab,
  getAttributeforProp,
  Properties,
  PropConfig,
  HTMLCollectionByID,
  MoleculeClass,
  MoleculeElement,
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

export {
  createProperty,
  camelCaseToKebab,
  getAttributeforProp,
  Properties,
  PropConfig,
  HTMLCollectionByID,
  MoleculeClass,
  MoleculeElement,
};

const domMap = new WeakMap<container, Node>();

export interface Class<T> {
  new (): T;
  prototype: T;
}

export type container = Element | DocumentFragment;
export type VDomElement = VNode | string | boolean | number | null | undefined;

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
  ...children: (VDomElement | VDomElement[])[]
): VNode {
  if (!props) {
    props = {};
  }

  if ('children' in props) {
    if (children.length === 0) {
      children = children.concat(props.children);
    }
    delete props.children;
  }

  const flattenedChildren = flatten(children);

  return new VNode(tag, props, flattenedChildren, props.key);
}

function flatten<T>(arr: (T | T[])[], result: T[] = []) {
  for (let i = 0, length = arr.length; i < length; i++) {
    const value = arr[i];
    if (Array.isArray(value)) {
      flatten(value, result);
    } else {
      result.push(value);
    }
  }
  return result;
}

export function render(
  vnode: VDomElement,
  container: container,
  oldDom?: HTMLElement | Node,
) {
  const dom = diff(vnode, container, oldDom || domMap.get(container));
  domMap.set(container, dom!);
  return dom;
}

const MoleculeJSX = createBase(render);

export { MoleculeJSX as Element };

export default {
  createProperty,
  camelCaseToKebab,
  getAttributeforProp,
  createElement,
  render,
  Element: MoleculeJSX,
};
