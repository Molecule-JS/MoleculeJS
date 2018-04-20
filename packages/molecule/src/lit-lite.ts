import { TemplateResult, TemplateFactory } from '../node_modules/lit-html/lit-html.js';

export interface Properties {
    [propName: string]: PropConfig | Type;
}

export type Type = typeof String | typeof Number | typeof Boolean | typeof Array | typeof Object | typeof Date;

export interface PropConfig {
    type: Type;
    reflectToAttribute?: boolean;
    value?: any;
    observer?: string;
    notify?: boolean;
}

export interface Data {
    [propName: string]: any;
}

export interface MethodsToCall {
    [propName: string]: (newValue: any, oldValue: any) => any;
}

export interface HTMLCollectionByID {
    [id: string]: HTMLElement | Element;
}

export interface LitEventInit extends EventInit {
    composed: boolean;
}

/**
 * Coverts a camelCase string to kebab-case.
 *
 * @export
 * @param {string} str The camelCaseString
 * @returns {string} The kebab-version of the string
 */
export function camelCaseToKebab(str: string): string {
    return str.replace(/([A-Z])/g, '-$1').toLowerCase();
}

/**
 * 
 * @param {string} prop The name of the property to create
 * @param {string} attr The name of the attribute
 * @param {any} context The context of the element
 * @param {PropConfig} info The configuration of the property
 */
export function _createProperty(prop: string, attr: string, context: any, info: PropConfig) {
    // get value that was already set on the property (if any)
    const setVal = context[prop];
    Object.defineProperty(context, prop, {
        get() {
            return context.__data[prop];
        },
        async set(val: any) {
            const resolved: any = (val != null && val instanceof Promise
                ? await val
                : val);
            if (info.reflectToAttribute) {
                /* Set the new value by setting the observed attribute.
                 * This will trigger attributeChangedCallback() which will
                 * convert the attribute data to a property,
                 * (this.__data[prop]) and trigger _propertiesChanged().
                 */
                context.setAttribute(attr, resolved);

            } else {
                /* Set the property directly and trigger
                 * _propertiesChanged()
                 */
                context._propertiesChanged(prop, resolved);
            }
            if (info.notify) {
                context.dispatchEvent(new CustomEvent(`${attr}-changed`, <LitEventInit>{
                    bubbles: true,
                    composed: true,
                    detail: resolved
                }));
            }
        }
    });

    if (info.reflectToAttribute &&
        (info.type === Object || info.type === Array)) {
        console.warn('Rich Data shouldn\'t be set as attribte!')
    }
    if (info.observer) {
        if (context[info.observer]) {
            // Establish the property-change observer
            context._methodsToCall[prop] = context[info.observer].bind(context);
        } else {
            console.warn(`Method ${info.observer} not defined!`);
        }
    }
    // Check, if the property was already set, set it accordingly
    if (setVal) {
        context[prop] = setVal;
        return;
    }
    if (info.value !== undefined) {
        // Initialize using the included value and the new setter()
        context[prop] = (typeof (info.value) === 'function'
            ? info.value.call(context)
            : info.value);

    }
}

/**
 * Returns a class with the Lit-Element features, that extends `superclass`.
 * @param superclass
 */
export const LitLite =
    (superclass = HTMLElement,
        html: (strings: TemplateStringsArray, ...values: any[]) => TemplateResult,
        renderFunction: (result: TemplateResult, container: Element | DocumentFragment, templateFactory?: TemplateFactory) => void) =>
        class extends superclass {
            static properties: Properties;
            __renderCallbacks: Set<any> = new Set();
            __pendingRender: boolean = false;
            __data: Data = {};
            _methodsToCall: MethodsToCall = {};
            _wait: any;
            _firstRender: boolean = false;
            afterRender?: (isFirst: boolean) => void;
            shadowRoot!: ShadowRoot;
            _propAttr: Map<string, string> = new Map(); // propertyName   -> attribute-name
            _attrProp: Map<string, string> = new Map(); // attribute-name -> propertyName
            [key: string]: any

            static get observedAttributes(): Array<string> {
                let attrs: Array<string> = [];
                for (const prop in this.properties) {
                    if ((<PropConfig>this.properties[prop]).reflectToAttribute) {
                        attrs.push(camelCaseToKebab(prop));
                    }
                }
                return attrs;
            }

            constructor() {
                super();
                this.attachShadow({ mode: 'open' });

                for (let prop in (this.constructor as any).properties) {
                    const attr = camelCaseToKebab(prop);
                    this._propAttr.set(prop, attr);
                    this._attrProp.set(attr, prop);
                }
            }

            connectedCallback() {
                const props = (this.constructor as any).properties;
                this._wait = true;
                for (let prop in props) {
                    if (typeof props[prop] === 'function')
                        props[prop] = { type: props[prop] };
                    this._makeGetterSetter(prop, props[prop])
                }
                delete this._wait;

                this._firstRender = true;

                /* Perform the first render after connection immediately
                 * without the delay of refresh()
                 */
                renderFunction(this.render(), this.shadowRoot)
            }

            /**
             * Creates the Propertyaccessors for the defined properties of the Element.
             * @param {string} prop
             * @param {PropConfig} info
             */
            _makeGetterSetter(prop: string, info: PropConfig) {
                const attr = <string>this._propAttr.get(prop);
                _createProperty(prop, attr, this, info);
            }

            /**
             * Gets called when the properties change and the Element should rerender.
             *
             * @param {string} prop
             * @param {any} newVal
             */
            _propertiesChanged(prop: string, newVal: any) {
                if (this.__data[prop] !== newVal) {
                    const oldVal = this.__data[prop];
                    let doRefresh = true;
                    this.__data[prop] = newVal;

                    if (this._methodsToCall[prop]) {
                        if (this._methodsToCall[prop](newVal, oldVal) === false) {
                            doRefresh = false;
                        }
                    }

                    if (doRefresh) {
                        this.refresh();
                    }
                }
            }

            /**
             * Gets called when an observed attribute changes. Calls `_propertiesChanged`
             *
             * @param {string} prop
             * @param {any} old
             * @param {any} val
             */
            attributeChangedCallback(attr: string, old: any, val: any) {
                if (old === val) return;
                const prop = <string>this._attrProp.get(attr);
                if (this.__data[prop] !== val) {
                    const { type } = (this.constructor as any).properties[prop];
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
                                if (newVal)
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
                    this._propertiesChanged(prop, newVal);
                }
            }

            /**
             *  Handle a postponed render.
             *  @method postponedRender
             *
             *  @return void
             */
            postponedRender() {
                renderFunction(this.render(), this.shadowRoot)

                for (let callback of this.__renderCallbacks) {
                    callback();
                }
                this.__renderCallbacks.clear();

                if (this.afterRender) {
                    this.afterRender(this._firstRender);
                    this._firstRender = false;
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
                if (this._wait === true) { return }

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
             * Returns what lit-html should render.
             *
             * @returns
             */
            render(): TemplateResult {
                return html``;
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
        }
