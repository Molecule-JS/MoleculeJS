import {
  PropConfig,
  Properties,
  Value,
  MoleculeEventInit,
  HTMLCollectionByID,
} from './lib/types';

import { observeProperty } from './lib/observe-property';
import { getAttributeForProp } from './lib/get-attr-for-prop';
import { IS_MOLECULE_ELEMENT } from './lib/constants';

export { camelCaseToKebab } from './lib/camel-to-kebab-case';

export {
  PropConfig,
  Properties,
  Value,
  MoleculeEventInit,
  HTMLCollectionByID,
  observeProperty,
  getAttributeForProp,
};

export abstract class MoleculeElement<T> extends HTMLElement {
  static readonly properties: Properties;

  private __renderCallbacks: Set<any> = new Set();
  private __pendingRender: boolean = false;
  private __data: { [propName: string]: any } = {};
  private __methodsToCall: {
    [propName: string]: (newValue: any, oldValue: any) => any;
  } = {};
  __wait: any;
  private __firstRender: boolean = false;
  private __root: Element | DocumentFragment;
  private __propAttr: Map<string, string> = new Map(); // propertyName   -> attribute-name
  private __attrProp: Map<string, string> = new Map(); // attribute-name -> propertyName
  private __propEvent: Map<string, string> = new Map();
  private __properties: { [key: string]: PropConfig } = {};
  private __forceUpdate: boolean = false;

  private __wasAlreadyConnected = false;

  afterRender(isFirst: boolean) {
    isFirst;
  }
  connected() {}
  disconnected() {}

  abstract renderer(template: T, container: Element | DocumentFragment): void;

  static IS_MOLECULE_ELEMENT = IS_MOLECULE_ELEMENT;

  createRoot(): ShadowRoot | HTMLElement {
    return this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes(): string[] {
    const attrs: string[] = [];
    for (const prop in this.properties) {
      if (typeof this.properties[prop] !== 'object') {
        continue;
      }
      const attr = (<PropConfig>this.properties[prop]).attribute;
      if (attr) {
        attrs.push(getAttributeForProp(prop, attr));
      }
    }
    return attrs;
  }

  constructor() {
    super();

    this.__root = this.createRoot();

    const props = (this.constructor as any).properties as Properties;

    for (const prop in props) {
      if (typeof props[prop] !== 'object') {
        this.__properties[prop] = { value: props[prop] as Value };
        continue;
      }
      this.__properties[prop] = props[prop] as PropConfig;

      const attr = getAttributeForProp(
        prop,
        this.__properties[prop].attribute || false,
      );
      this.__propAttr.set(prop, attr);
      this.__attrProp.set(attr, prop);

      if (this.__properties[prop].event) {
        const eventName =
          typeof this.__properties[prop].event === 'boolean'
            ? `${attr}-changed`
            : (this.__properties[prop].event as string);
        this.__propEvent.set(prop, eventName);
      }
    }
  }

  connectedCallback() {
    if (!this.__wasAlreadyConnected) {
      const props = this.__properties;
      this.__wait = true;
      for (const prop in props) {
        observeProperty.call(
          this,
          prop,
          props[prop],
          this.__data,
          this.__methodsToCall,
        );
      }
      delete this.__wait;
      this.__wasAlreadyConnected = true;
    }

    this.__firstRender = true;

    if (this.connected) {
      this.connected.call(this);
    }

    /* Perform the first render after connection immediately
     * without the delay of refresh()
     */
    this.postponedRender();
  }

  disconnectedCallback() {
    if (this.disconnected) {
      this.disconnected.call(this);
    }
  }

  /**
   * Gets called when the properties change and the Element should rerender.
   *
   * @param {string} prop
   * @param {any} newVal
   */
  __propertiesChanged(prop: string, newVal: any, forceUpdate: boolean = false) {
    if (forceUpdate || this.__data[prop] !== newVal) {
      const oldVal = this.__data[prop];
      let doRefresh = true;
      this.__data[prop] = newVal;

      if (this.__methodsToCall[prop]) {
        if (this.__methodsToCall[prop](newVal, oldVal) === false) {
          doRefresh = false;
        }
      }

      if (doRefresh) {
        this.refresh();
      }
    }
  }
  /**
   * Set the prop to a new value, or signal that it changed
   */
  async setProperty(
    prop: string,
    newVal = (this as any)[prop],
    forceUpdate: boolean = true,
  ) {
    newVal =
      newVal != null && newVal instanceof Promise ? await newVal : newVal;
    const info = this.__properties[prop];
    const attr = this.__propAttr.get(prop);
    if (info.attribute) {
      /* Set the new value by setting the observed attribute.
       * This will trigger attributeChangedCallback() which will
       * convert the attribute data to a property,
       * (this.__data[prop]) and trigger __propertiesChanged().
       */
      this.__forceUpdate = forceUpdate;
      this.setAttribute(attr!, newVal);
    } else {
      /* Set the property directly and trigger
       * __propertiesChanged()
       */
      this.__propertiesChanged(prop, newVal, forceUpdate);
    }
    if (info.event) {
      const eventName = this.__propEvent.get(prop)!;
      this.dispatchEvent(
        new CustomEvent(eventName, <MoleculeEventInit>{
          bubbles: true,
          composed: true,
          detail: newVal,
        }),
      );
    }
    return newVal;
  }

  /**
   * Gets called when an observed attribute changes. Calls `__propertiesChanged`
   *
   * @param {string} prop
   * @param {any} old
   * @param {any} val
   */
  attributeChangedCallback(attr: string, old: any, val: any) {
    if (!this.__forceUpdate && old === val) return;
    this.__forceUpdate = false;
    const prop = this.__attrProp.get(attr)!;
    const type = this.__properties[prop].type || String;
    let newVal = val;

    switch (type.name) {
      case 'Boolean':
        /* Ensure attribute values the indicate that absense of the
         * attribute actually cause the attribute to be absent.
         */
        if (
          val === 'false' ||
          val === 'null' ||
          val === 'undefined' ||
          val === false ||
          val === null ||
          val === undefined
        ) {
          this.removeAttribute(attr);
          newVal = false;
        } else {
          newVal = true;
          this.setAttribute(attr, '');
        }
        break;

      case 'String':
        /* If a String value is falsey or the explicit 'null'
         * or 'undefined' string, ensure that the attribute is
         * removed.
         */
        if (!val || val === 'null' || val === 'undefined') {
          this.removeAttribute(attr);
          newVal = '';
        } else {
          newVal = type(val);
        }
        break;

      default:
        newVal = type(val);
        break;
    }

    /* Pass along the new, more concrete *property* value instead of
     * the fuzzy attribute value.
     */
    this.__propertiesChanged(prop, newVal);
  }

  /**
   *  Handle a postponed render.
   *  @method postponedRender
   *
   *  @return void
   */
  postponedRender() {
    this.renderer(
      this.render({
        ...this.__data,
      }),
      this.__root,
    );

    for (const callback of this.__renderCallbacks) {
      callback();
    }
    this.__renderCallbacks.clear();

    if (this.afterRender) {
      this.afterRender(this.__firstRender);
      this.__firstRender = false;
    }
  }

  /**
   *  Refresh this element, re-rendering.
   *  @method refresh
   *  @param {function} callback
   *
   *  @return void
   */
  async refresh(callback?: () => any) {
    if (this.__wait === true) {
      return;
    }

    if (callback != null) {
      // Queue this render/refresh callback
      this.__renderCallbacks.add(callback);
    }

    if (!this.__pendingRender) {
      this.__pendingRender = true;
      /* Schedule the following as a microtask, which runs before
       * requestAnimationFrame. Any additional refresh() calls
       * will have any callback queued but otherwise will be
       * ignored.
       *
       * https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/
       */
      this.__pendingRender = await false;
      this.postponedRender();
    }
  }

  /**
   * Returns should be passed to the render function.
   *
   * @returns
   */
  abstract render(data: object): T;

  /**
   * Gets all children with ids.
   *
   * @readonly
   */
  get $(): HTMLCollectionByID {
    const arr = this.__root.querySelectorAll('[id]');
    const obj: HTMLCollectionByID = {};
    for (const el of arr) {
      obj[el.id] = el;
    }

    return obj;
  }
}
