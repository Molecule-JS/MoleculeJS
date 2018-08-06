import { Class } from '../../molecule-jsx';

export const IS_NON_DIMENSIONAL = /acit|ex(?:s|g|n|p|$)|rph|ows|mnc|ntw|ine[ch]|zoo|^ord/i;

export function removeNode(node: Node) {
  const p = node.parentNode;
  if (p) p.removeChild(node);
}

export function setProperty(node: Node, name: string, value: any) {
  try {
    (node as any)[name] = value;
  } catch (e) {
    console.error(e);
  }
}

export function createNode(vNodeName: string | Class<HTMLElement>) {
  if (typeof vNodeName === 'string') {
    return document.createElement(vNodeName.toLocaleLowerCase());
  }
  return new vNodeName();
}

export function setAccessor(
  node: HTMLElement,
  name: string,
  old: any,
  value: any,
) {
  if (name === 'className') name = 'class';

  if (name === 'key') {
    // ignore
  } else if (name === 'class') {
    node.className = value || '';
  } else if (name === 'style') {
    if (!value || typeof value === 'string' || typeof old === 'string') {
      node.style.cssText = value || '';
    }
    if (value && typeof value === 'object') {
      if (typeof old !== 'string') {
        for (const i in old) {
          if (!(i in value)) (node.style as any)[i] = '';
        }
      }
      for (const i in value) {
        (node.style as any)[i] =
          typeof value[i] === 'number' && IS_NON_DIMENSIONAL.test(i) === false
            ? value[i] + 'px'
            : value[i];
      }
    }
  } else if (name === 'dangerouslySetInnerHTML') {
    if (value) node.innerHTML = value.__html || '';
  } else if (name[0] === 'o' && name[1] === 'n') {
    const useCapture = name !== (name = name.replace(/Capture$/, ''));
    name = name.toLowerCase().substring(2);
    if (value) {
      if (!old) node.addEventListener(name, eventProxy, useCapture);
    } else {
      node.removeEventListener(name, eventProxy, useCapture);
    }
    ((node as any)._listeners || ((node as any)._listeners = {}))[name] = value;
  } else if (
    name !== 'list' &&
    name !== 'type' &&
    (name in node || 'render' in node)
  ) {
    // Attempt to set a DOM property to the given value.
    // IE & FF throw for certain property-value combinations.
    try {
      (node as any)[name] = value == null ? '' : value;
    } catch (e) {}
    if ((value == null || value === false) && name !== 'spellcheck') {
      node.removeAttribute(name);
    }
  } else {
    const ns = name !== (name = name.replace(/^xlink:?/, ''));
    // spellcheck is treated differently than all other boolean values and
    // should not be removed when the value is `false`. See:
    // https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#attr-spellcheck
    if (value == null || value === false) {
      if (ns) {
        node.removeAttributeNS(
          'http://www.w3.org/1999/xlink',
          name.toLowerCase(),
        );
      } else node.removeAttribute(name);
    } else if (typeof value !== 'function') {
      if (ns) {
        node.setAttributeNS(
          'http://www.w3.org/1999/xlink',
          name.toLowerCase(),
          value,
        );
      } else node.setAttribute(name, value);
    }
  }
}

function eventProxy(this: Node, e: Event) {
  return (this as any)._listeners[e.type](e);
}
