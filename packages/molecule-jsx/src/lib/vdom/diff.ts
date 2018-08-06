import { VDomElement, VNode, container, Class } from '../../molecule-jsx';
import { removeNode, createNode, setAccessor } from '../dom/index';

const PROP_KEY = '__mol_jsx_attr__';

export let diffLevel = 0;

export function diff(vnode: VDomElement, parent: container, dom?: Node) {
  const diffed = idiff(vnode, dom);

  if (parent && diffed && diffed.parentNode !== parent) {
    parent.appendChild(diffed);
  }

  return diffed;
}

export function idiff(vnode: VDomElement, dom?: Node) {
  let out = dom;

  if (vnode == null || typeof vnode === 'boolean') {
    vnode = '';
  }

  if (typeof vnode === 'string' || typeof vnode === 'number') {
    vnode = String(vnode);
    if (dom && !(dom instanceof Text)) {
      if (dom.nodeValue !== vnode) {
        dom.nodeValue = vnode;
      }
    } else {
      out = document.createTextNode(vnode);
      if (dom) {
        if (dom.parentNode) dom.parentNode.replaceChild(out, dom);
        remove(dom);
      }
    }

    return out as Node;
  }

  const vNodeName = vnode.nodeName;

  if (
    !dom ||
    (typeof vNodeName === 'function' &&
      !isElement(dom as Element, vNodeName)) ||
    (typeof vNodeName === 'string' && !isNamedNode(dom, vNodeName))
  ) {
    out = createNode(vNodeName);

    if (dom) {
      // move children into the replacement node
      while (dom.firstChild) out.appendChild(dom.firstChild);

      // if the previous Element was mounted into the DOM, replace it inline
      if (dom.parentNode) dom.parentNode.replaceChild(out, dom);

      // recycle the old element (skips non-Element node types)
      remove(dom);
    }
  }

  const fc = out!.firstChild;
  let props: { [prop: string]: any } = (out as any)[PROP_KEY];
  const children = vnode.children;

  if (props == null) {
    props = (out as any)[PROP_KEY] = {};
    // tslint:disable-next-line:space-in-parens
    for (let a = (out as Element).attributes, i = a.length; i--; ) {
      props[a[i].name] = a[i].value;
    }
  }

  if (
    children &&
    children.length === 1 &&
    typeof children[0] === 'string' &&
    fc != null &&
    fc instanceof Text &&
    fc.nextSibling == null
  ) {
    if (fc.nodeValue !== children[0]) {
      fc.nodeValue = children[0] as string;
    }
  } else if ((children && children.length) || fc != null) {
    innerDiffNode(out as Node, children);
  }

  diffProps(out as Node, vnode.props, props);

  return out as Node;
}

export function innerDiffNode(dom: Node, vchildren: VDomElement[]) {
  const origChildren = dom.childNodes;
  const children: (Node | undefined)[] = [];
  const keyed: { [key: string]: Node | undefined } = {};
  let keyedLen = 0;
  let min = 0;
  const len = origChildren.length;
  let childrenLen = 0;
  const vlen = vchildren.length;
  let j: number;
  let c: Node;
  let f: Node;
  let vchild: VDomElement;
  let child: Node | null;

  if (len !== 0) {
    for (let i = 0; i < len; i++) {
      const child = origChildren[i];
      const props = (child as any)[PROP_KEY];
      const key = vlen && props ? props.key : null;
      if (key != null) {
        keyedLen++;
        keyed[key] = child;
      } else if (
        props ||
        ((child as any).splitText !== undefined
          ? child!.nodeValue!.trim()
          : true)
      ) {
        children[childrenLen++] = child;
      }
    }
  }

  if (vlen !== 0) {
    for (let i = 0; i < vlen; i++) {
      vchild = vchildren[i];
      child = null;

      if (vchild == null || vchild === false) {
        vchild = '';
      }

      // attempt to find a node based on key matching
      const key = (vchild as VNode).key;
      if (key != null) {
        if (keyedLen && keyed[key] !== undefined) {
          child = keyed[key] as Node | null;
          keyed[key] = undefined;
          keyedLen--;
        }
      } else if (min < childrenLen) {
        for (j = min; j < childrenLen; j++) {
          if (
            children[j] !== undefined &&
            isSameNodeType((c = children[j] as Node), vchild)
          ) {
            child = c;
            children[j] = undefined;
            if (j === childrenLen - 1) childrenLen--;
            if (j === min) min++;
            break;
          }
        }
      }

      // morph the matched/found/created DOM child to match vchild (deep)
      child = idiff(vchild, child as Node) as Node;

      f = origChildren[i];
      if (child && child !== dom && child !== f) {
        if (f == null) {
          dom.appendChild(child);
        } else if (child === f.nextSibling) {
          removeNode(f);
        } else {
          dom.insertBefore(child, f);
        }
      }
    }
  }

  if (keyedLen) {
    for (const i in keyed) {
      if (keyed[i] !== undefined) remove(keyed[i] as Node);
    }
  }

  while (min <= childrenLen) {
    if ((child = children[childrenLen--] as Node) !== undefined) {
      remove(child);
    }
  }
}

export function diffProps(
  dom: Node,
  props: { [prop: string]: any },
  old: { [prop: string]: any },
) {
  let name;

  // remove attributes no longer present on the vnode by setting them to undefined
  for (name in old) {
    if (!(props && props[name] != null) && old[name] != null) {
      setAccessor(dom as HTMLElement, name, old[name], (old[name] = undefined));
    }
  }

  // add new & update changed attributes
  for (name in props) {
    if (
      name !== 'children' &&
      name !== 'innerHTML' &&
      (!(name in old) ||
        props[name] !==
          (name === 'value' || name === 'checked'
            ? (dom as any)[name]
            : old[name]))
    ) {
      setAccessor(
        dom as HTMLElement,
        name,
        old[name],
        (old[name] = props[name]),
      );
    }
  }
}

export function remove(node: Node) {
  removeChildren(node);
  removeNode(node);
}

export function removeChildren(node: Node) {
  node = node.lastChild as Node;
  while (node) {
    const next = node.previousSibling;
    remove(node);
    node = next as Node;
  }
}

export function isElement(dom: Element, constructor: Class<HTMLElement>) {
  const tagName = dom.tagName;

  return customElements.get(tagName) === constructor;
}

export function isNamedNode(node: Node, nodeName: string) {
  return node.nodeName.toLowerCase() === nodeName.toLowerCase();
}

export function isSameNodeType(node: Node, vnode: VDomElement) {
  if (!vnode || typeof vnode === 'boolean') {
    return false;
  }

  if (typeof vnode === 'string' || typeof vnode === 'number') {
    return node instanceof Text;
  }
  if (typeof vnode.nodeName === 'string') {
    return isNamedNode(node, vnode.nodeName);
  }
  return isElement(node as Element, vnode.nodeName);
}
