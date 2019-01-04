import { VDomElement, VNode, container } from '../../molecule-jsx';
import { removeNode, createNode, setAccessor } from '../dom/index';
import { Patch, PrimitivePatch, PatchType, PropPatch } from './patch';

interface VNodeAndDom {
  vNode: VDomElement;
  dom: Node;
}

export function diff(
  vNode: VDomElement | VDomElement[],
  parent: container,
  oldVNode?: VDomElement | VDomElement[],
  dom?: Node | Node[],
) {
  if (Array.isArray(vNode)) {
    if (!dom || !Array.isArray(oldVNode)) {
      if (dom) {
        parent.removeChild(dom as Node);
      }
      const newDom: Node[] = [];
      for (const child of vNode) {
        newDom.push(
          patch({
            parent,
            vNode: child,
            type: PatchType.PATCH_TYPE_COMPLETE,
          }),
        );
      }
      return newDom;
    }

    innerDiffNode(vNode, oldVNode, parent.childNodes, parent);

    return [...parent.childNodes];
  }
  if (Array.isArray(oldVNode)) {
    for (const node of dom as Node[]) {
      parent.removeChild(node);
    }
    return patch({
      parent,
      vNode,
      type: PatchType.PATCH_TYPE_COMPLETE,
    });
  }

  const diffed = _diff(vNode, parent, oldVNode, dom as Node);

  if (parent && diffed && diffed.parentNode !== parent) {
    parent.appendChild(diffed);
  }

  return diffed;
}

function _diff(
  vNode: VDomElement,
  parent: container,
  oldVNode?: VDomElement,
  dom?: Node,
): Node {
  if (!dom) {
    return patch({
      vNode,
      parent,
      type: PatchType.PATCH_TYPE_COMPLETE,
    });
  }

  // Both are primitive
  if (isPrimitive(vNode) && isPrimitive(oldVNode)) {
    if (vNode !== oldVNode) {
      const p: PrimitivePatch = {
        vNode,
        parent,
        dom,
        type: PatchType.PATCH_TYPE_PRIMITIVE,
        oldValue: oldVNode,
      };
      return patch(p);
    }
    return dom;
  }

  // Only one is primitive
  if (isPrimitive(vNode) || isPrimitive(oldVNode)) {
    return patch({
      vNode,
      parent,
      dom,
      type: PatchType.PATCH_TYPE_COMPLETE,
    });
  }

  // Both aren't primitive
  vNode = vNode as VNode;
  oldVNode = oldVNode as VNode;

  // Different tag
  if (vNode.nodeName !== oldVNode.nodeName) {
    return patch({
      vNode,
      parent,
      dom,
      type: PatchType.PATCH_TYPE_COMPLETE,
    });
  }

  // Check props
  const oldProps = oldVNode.props;
  const props = vNode.props;

  for (const name in oldProps) {
    // TODO: Find better solution. Perhaps transform it to vDOM?
    if (name === 'dangerouslySetInnerHTML' && !props[name]) {
      (dom as HTMLElement).innerHTML = '';
      for (const child of vNode.children) {
        patch({
          vNode: child,
          parent: dom as container,
          type: PatchType.PATCH_TYPE_COMPLETE,
        });
      }
      oldVNode.children = vNode.children;
      continue;
    }
    if (!(props && props[name] != null) && oldProps[name] != null) {
      const p: PropPatch = {
        vNode,
        parent,
        name,
        dom,
        oldValue: oldProps[name],
        value: undefined,
        type: PatchType.PATCH_TYPE_PROP,
      };
      patch(p);
    }
  }

  for (const name in props) {
    if (
      !(name in oldProps) ||
      props[name] !==
        (name === 'value' || name === 'checked'
          ? (dom as any)[name]
          : oldProps[name])
    ) {
      const p: PropPatch = {
        vNode,
        parent,
        name,
        dom,
        oldValue: oldProps[name],
        value: props[name],
        type: PatchType.PATCH_TYPE_PROP,
      };
      patch(p);
    }
  }

  // dangerouslySetInnerHTML has precedence
  if ('dangerouslySetInnerHTML' in props) return dom;

  // Check children
  if (
    vNode.children.length === 1 &&
    isPrimitive(vNode.children[0]) &&
    oldVNode.children.length === 1 &&
    isPrimitive(oldVNode.children[0])
  ) {
    const value: string = shouldRender(vNode.children[0])
      ? String(vNode.children[0])
      : '';
    if (oldVNode.children[0] !== vNode.children[0]) {
      dom.firstChild!.nodeValue = value;
    }
  } else if (vNode.children.length > 0 || oldVNode.children.length > 0) {
    innerDiffNode(
      vNode.children.filter(shouldRender),
      oldVNode.children.filter(shouldRender),
      dom.childNodes,
      dom as container,
    );
  }

  return dom;
}

function innerDiffNode(
  vChildren: VDomElement[],
  oldVChildren: VDomElement[],
  domChildren: NodeListOf<ChildNode>,
  parent: container,
) {
  const len = vChildren.length;
  const oldLen = oldVChildren.length;

  let keyedLen = 0;
  const keyed: { [key: string]: VNodeAndDom } = {};
  const children: (VNodeAndDom | undefined)[] = [];

  let min = 0;

  for (let i = 0; i < oldLen; i++) {
    const child = oldVChildren[i];
    const domChild = domChildren[i];

    const props = child instanceof VNode ? child.props : undefined;
    const key = len && props ? props.key : null;

    if (key != null) {
      keyedLen++;
      keyed[key] = { vNode: child as VNode, dom: domChild };
    } else {
      children.push({
        vNode: child,
        dom: domChild,
      });
    }
  }

  for (let i = 0; i < len; i++) {
    const vChild = vChildren[i];
    let child: VDomElement = null;
    let dom: Node | undefined = undefined;

    // attempt to find a node based on key matching
    const key = (vChild as VNode).key;
    if (key != null) {
      if (keyedLen && keyed[key] !== undefined) {
        child = keyed[key].vNode;
        dom = keyed[key].dom;
        delete keyed[key];
        keyedLen--;
      }
    } else {
      for (let j = min; j < children.length; j++) {
        const c = children[j];
        if (c !== undefined && isSameNodeType(c.vNode, vChild)) {
          child = c.vNode;
          dom = c.dom;
          children[j] = undefined;
          if (j === children.length - 1) children.length--;
          if (j === min) min++;
          break;
        }
      }
    }

    const newDom = _diff(vChild, parent, child, dom);

    const f = domChildren[i];
    if (newDom && newDom !== parent && newDom !== f) {
      if (f == null) {
        parent.appendChild(newDom);
      } else if (newDom === f.nextSibling) {
        removeNode(f);
      } else {
        parent.insertBefore(newDom, f);
      }
    }
  }

  if (keyedLen) {
    for (const i in keyed) {
      remove(keyed[i].dom);
    }
  }

  for (let i = min; i < children.length; i++) {
    const child = children[i];
    remove(child!.dom);
  }
}

function patch(pat: Patch) {
  if (!shouldRender(pat.vNode)) {
    pat.vNode = '';
  }
  switch (pat.type) {
    case PatchType.PATCH_TYPE_PRIMITIVE:
      const p = pat as PrimitivePatch;
      (p.dom as Text).nodeValue = p.vNode as string;
      return p.dom!;

    case PatchType.PATCH_TYPE_COMPLETE:
      if (pat.dom) remove(pat.dom);

      if (isPrimitive(pat.vNode)) {
        pat.vNode = String(pat.vNode);
        const dom = document.createTextNode(pat.vNode as string);
        pat.parent.appendChild(dom);
        return dom;
      }
      const vNode = pat.vNode as VNode;
      const dom = createNode(vNode.nodeName);

      for (const child of vNode.children) {
        patch({
          vNode: child,
          parent: dom,
          type: PatchType.PATCH_TYPE_COMPLETE,
        });
      }

      for (const prop in vNode.props) {
        if (vNode.props[prop] != null) {
          const p: PropPatch = {
            vNode,
            dom,
            parent: pat.parent,
            name: prop,
            oldValue: undefined,
            value: vNode.props[prop],
            type: PatchType.PATCH_TYPE_PROP,
          };
          patch(p);
        }
      }

      pat.parent.appendChild(dom);

      return dom;

    case PatchType.PATCH_TYPE_PROP:
      const propPatch = pat as PropPatch;
      setAccessor(
        propPatch.dom as HTMLElement,
        propPatch.name,
        propPatch.oldValue,
        propPatch.value,
      );
      return propPatch.dom!;
  }
}

function remove(node: Node) {
  removeChildren(node);
  removeNode(node);
}

function removeChildren(node: Node) {
  node = node.lastChild as Node;
  while (node) {
    const next = node.previousSibling;
    remove(node);
    node = next as Node;
  }
}

function isPrimitive(val: any) {
  return (
    val === null || !(typeof val === 'object' || typeof val === 'function')
  );
}

function shouldRender(node: VDomElement) {
  return node != null && typeof node !== 'boolean';
}

function isSameNodeType(vNode: VDomElement, oldVNode: VDomElement) {
  if (isPrimitive(vNode)) {
    return isPrimitive(oldVNode);
  }
  const name = (vNode as VNode).nodeName;
  const oldName = (oldVNode as VNode).nodeName;
  if (typeof name === 'string') {
    return (
      typeof oldName === 'string' &&
      name.toLowerCase() === oldName.toLowerCase()
    );
  }
  return name === oldName;
}
