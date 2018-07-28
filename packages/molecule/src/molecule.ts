import { camelCaseToKebab } from './lib/helpers/camel-to-kebab-case';

export interface Properties {
  [propName: string]: PropConfig | Value;
}

export type Type = (val: any) => any;

export type Value = boolean | string | number | symbol | (() => any) | undefined;

export interface PropConfig {
  type?: Type;
  attribute?: boolean | string;
  value?: Value;
  observer?: string;
  event?: boolean | string;
}

export interface HTMLCollectionByID {
  [id: string]: HTMLElement | Element;
}

export interface MoleculeEventInit extends EventInit {
  composed: boolean;
}

declare var __DEV__: boolean;

/**
 *
 * @param {string} prop The name of the property to create
 * @param {string} attr The name of the attribute
 * @param {any} context The context of the element
 * @param {PropConfig} info The configuration of the property
 */
export function createProperty(prop: string, context: any, info: PropConfig) {
  // get value that was already set on the property (if any)
  let setVal = context[prop];
  if (setVal === undefined) {
    setVal = context.__data[prop];
  }
  Object.defineProperty(context, prop, {
    get() {
      return context.__data[prop];
    },
    set(val: any) {
      context.setProperty(prop, val);
    },
  });
  if (__DEV__) {
    if (info.attribute) {
      if (!info.type) {
        console.error(`Property ${prop}: Attributes must have a type specified`);
      }
      if (info.type === Object || info.type === Array) {
        console.warn(`Property ${prop}: Rich Data shouldn\'t be set as attribute!`);
      }
    }
  }
  if (info.observer) {
    if (context[info.observer]) {
      // Establish the property-change observer
      context.__methodsToCall[prop] = context[info.observer].bind(context);
    } else {
      if (__DEV__) {
        console.error(`Property ${prop}: Method ${info.observer} not defined!`);
      }
    }
  }
  // Check, if the property was already set, set it accordingly
  if (setVal !== undefined) {
    context[prop] = setVal;
    return;
  }
  // Initialize using the included value and the new setter()
  context[prop] = (typeof (info.value) === 'function'
    ? info.value.call(context)
    : info.value);

}

export const getAttributeforProp = (prop: string, attrConfig: boolean | string) => {
  if (typeof attrConfig === 'boolean') {
    return camelCaseToKebab(prop);
  }
  return attrConfig;
};

/**
 * Returns a class with the Molecule features, that extends `superclass`.
 * @param superclass
 */
const Molecule =
  <T>(renderFunction: (result: T, container: Element | DocumentFragment) => void) =>
    class Molecule extends HTMLElement {
      static readonly properties: Properties;
      __renderCallbacks: Set<any> = new Set();
      __pendingRender: boolean = false;
      __data: { [propName: string]: any } = {};
      __methodsToCall: { [propName: string]: (newValue: any, oldValue: any) => any } = {};
      __wait: any;
      __firstRender: boolean = false;
      shadowRoot!: ShadowRoot;
      __propAttr: Map<string, string> = new Map(); // propertyName   -> attribute-name
      __attrProp: Map<string, string> = new Map(); // attribute-name -> propertyName
      __propEvent: Map<string, string> = new Map();
      __properties: { [key: string]: PropConfig } = {};

      afterRender?(isFirst: boolean): void;
      connected?(): void;
      disconnected?(): void;

      static get observedAttributes(): string[] {
        const attrs: string[] = [];
        for (const prop in this.properties) {
          if (typeof this.properties[prop] !== 'object') {
            continue;
          }
          const attr = (<PropConfig>this.properties[prop]).attribute;
          if (attr) {
            attrs.push(getAttributeforProp(prop, attr));
          }
        }
        return attrs;
      }

      protected constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        const props = (this.constructor as any).properties as Properties;

        for (const prop in props) {
          if (typeof props[prop] !== 'object') {
            this.__properties[prop] = { value: props[prop] as Value };
            continue;
          }
          this.__properties[prop] = props[prop] as PropConfig;

          const attr = getAttributeforProp(prop,
                                           this.__properties[prop].attribute || false);
          this.__propAttr.set(prop, attr);
          this.__attrProp.set(attr, prop);

          if (this.__properties[prop].event) {
            const eventName = typeof this.__properties[prop].event === 'boolean'
              ? attr : this.__properties[prop].event as string;
            this.__propEvent.set(prop, eventName);
          }
        }
      }

      connectedCallback() {
        const props = this.__properties;
        this.__wait = true;
        for (const prop in props) {
          createProperty(prop, this, props[prop]);
        }
        delete this.__wait;

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
      __propertiesChanged(prop: string, newVal: any) {
        if (this.__data[prop] !== newVal) {
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
      async setProperty(prop: string, newVal = (this as any)[prop]) {
        newVal = (newVal != null && newVal instanceof Promise
          ? await newVal
          : newVal);
        const info = this.__properties[prop];
        const attr = this.__propAttr.get(prop);
        if (info.attribute) {
          /* Set the new value by setting the observed attribute.
           * This will trigger attributeChangedCallback() which will
           * convert the attribute data to a property,
           * (this.__data[prop]) and trigger __propertiesChanged().
           */
          this.setAttribute(attr!, newVal);
        } else {
          /* Set the property directly and trigger
           * __propertiesChanged()
           */
          this.__propertiesChanged(prop, newVal);
        }
        if (info.event) {
          const eventName = this.__propEvent.get(prop);
          this.dispatchEvent(new CustomEvent(`${eventName}-changed`, <MoleculeEventInit>{
            bubbles: true,
            composed: true,
            detail: newVal,
          }));
        }
      }

      /**
       * Gets called when an observed attribute changes. Calls `__propertiesChanged`
       *
       * @param {string} prop
       * @param {any} old
       * @param {any} val
       */
      attributeChangedCallback(attr: string, old: any, val: any) {
        if (old === val) return;
        const prop = this.__attrProp.get(attr)!;
        if (this.__data[prop] !== val) {
          const type = this.__properties[prop].type || String;
          let newVal = val;

          switch (type.name) {
            case 'Boolean':
              /* Ensure attribute values the indicate that absense of the
               * attribute actually cause the attribute to be absent.
               */
              if (val === 'false' || val === 'null' ||
                val === 'undefined' ||
                val === false || val === null) {
                this.removeAttribute(attr);
                newVal = false;
              } else {
                newVal = this.hasAttribute(attr);
                if (newVal) {
                  this.setAttribute(attr, '');
                }
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
      }

      /**
       *  Handle a postponed render.
       *  @method postponedRender
       *
       *  @return void
       */
      postponedRender() {
        renderFunction(this.render({ ...this.__data }), this.shadowRoot);

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
        if (this.__wait === true) { return; }

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
      render(data: object): T {
        data;
        throw Error('render function not defined');
      }

      /**
       * Gets all children with ids.
       *
       * @readonly
       */
      get $(): HTMLCollectionByID {
        const arr = this.shadowRoot.querySelectorAll('[id]');
        const obj: HTMLCollectionByID = {};
        for (const el of arr) {
          obj[el.id] = el;
        }

        return obj;
      }
    };

export { camelCaseToKebab, Molecule as Element };

export default { createProperty, camelCaseToKebab, Element: Molecule };
