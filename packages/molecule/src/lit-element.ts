import { html, render as litRender, TemplateResult } from '../node_modules/lit-html/lit-html.js';

export {html} from '../node_modules/lit-html/lit-html.js';

export interface HTMLClass extends HTMLElement {
    new(): HTMLClass;
}

export interface properties {
    [propName: string]: propConfig | typeof String | typeof Number | typeof Boolean | typeof Array | typeof Object;
}

export interface propConfig {
    type: typeof String | typeof Number | typeof Boolean | typeof Array | typeof Object;
    reflectToAttribute?: boolean;
    value?: any;
    observer?: string;
}

export interface data {
    [propName: string]: any;
}

export interface methodsToCall {
    [propName: string]: (value: any) => void;
}

export interface HTMLCollectionByID {
    [id: string]: HTMLElement | Element;
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
 * Returns a class with the Lit-Element features, that extends `superclass`.
 * @param {*} superclass
 */
export const LitElement = (superclass: HTMLClass) => class extends superclass {
    static properties: properties;
    __data: data = {};
    _methodsToCall: methodsToCall = {};
    _wait: boolean;
    afterFirstRender?: () => void;
    shadowRoot: ShadowRoot;
    _propAttr: Map<string, string>;
    _attrProp: Map<string, string>;

    static get observedAttributes(): Array<string> {
        let attrs: Array<string> = [];
        for (const prop in this.properties) {
            if (this.properties[prop].reflectToAttribute) {
                attrs.push(camelCaseToKebab(prop));
            }
        }
        return attrs;
    }

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        // Generate propertyName <-> attribute-name mappings
        this._propAttr = new Map(); // propertyName   -> attribute-name
        this._attrProp = new Map(); // attribute-name -> propertyName
        for (let prop in this.constructor.properties) {
            const attr = camelCaseToKebab(prop);
            this._propAttr.set(prop, attr);
            this._attrProp.set(attr, prop);
        }
    }

    connectedCallback() {
        const props = this.constructor.properties;
        this._wait = true;
        for (let prop in props) {
            this._makeGetterSetter(prop, props[prop])
        }
        delete this._wait;
        litRender(this.render(), this.shadowRoot);
        if (this.afterFirstRender)
            this.afterFirstRender();
    }

    /**
     * Creates the Propertyaccessors for the defined properties of the Element.
     * @param {string} prop
     * @param {propConfig} info
     */
    _makeGetterSetter(prop: string, info: propConfig) {
        const attr = this._propAttr.get(prop);
        Object.defineProperty(this, prop, {
            get() {
                return this.__data[prop]
            },
            async set(val: any) {
                const resolved: any = (val != null && val instanceof Promise
                    ? await val
                    : val);
                if (typeof info === 'object' && info.reflectToAttribute) {
                    /* Set the new value by setting the observed attribute.
                     * This will trigger attributeChangedCallback() which will
                     * convert the attribute data to a property,
                     * (this.__data[prop]) and trigger _propertiesChanged().
                     */
                    this.setAttribute(attr, resolved);

                } else {
                    /* Set the property directly and trigger
                     * _propertiesChanged()
                     */
                    this.__data[prop] = resolved;
                    this._propertiesChanged(prop, resolved);
                }
            }
        });

        if (typeof info === 'object') {
            if (info.reflectToAttribute &&
                (info.type === Object || info.type === Array)) {
                console.warn('Rich Data shouldn\'t be set as attribte!')
            }
            if (info.observer) {
                if (this[info.observer]) {
                    // Establish the property-change observer
                    this._methodsToCall[prop] = this[info.observer].bind(this);
                } else {
                    console.warn(`Method ${info.observer} not defined!`);
                }
            }
            if (info.value !== undefined) {
                // Initialize using the included value and the new setter()
                this[prop] = (typeof(info.value) === 'function'
                  ? info.value.call( this )
                  : info.value);

            } else {
                // Initialize via the matching attribute and the new setter()
                this[prop] = this.getAttribute(attr);
            }

        } else {
            // Initialize via the matching attribute and the new setter()
            this[prop] = this.getAttribute(attr);
        }
    }

    /**
     * Gets called when the properties change and the Element should rerender.
     *
     * @param {string} prop
     * @param {any} val
     */
    _propertiesChanged(prop: string, val: any) {
        if (this._methodsToCall[prop]) {
            this._methodsToCall[prop](val);
        }
        if (!this._wait) {
            litRender(this.render(), this.shadowRoot)
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
        const prop = this._attrProp.get(attr);
        if (this.__data[prop] !== val) {
            const { type } = this.constructor.properties[prop];
            switch (type.name) {
                case 'Boolean':
                    /* Ensure attribute values the indicate that absense of the
                     * attribute actually cause the attribute to be absent.
                     */
                    if (val === 'false' || val === 'null' ||
                        val === false || val === null) {
                        if (this.hasAttribute(attr)) {
                            this.removeAttribute(attr);
                        }
                        this.__data[prop] = false
                    } else {
                        this.__data[prop] = this.hasAttribute(attr);
                    }
                    break;

                case 'String':
                    /* If a String value is falsey or the explicit 'null' string,
                     * ensure that the attribute is removed.
                     */
                    if (!val || val === 'null') {
                        if (this.hasAttribute(attr)) {
                            this.removeAttribute(attr);
                        }
                        this.__data[prop] = '';

                    } else {
                        this.__data[prop] = type(val);

                    }
                    break;

                default:
                    this.__data[prop] = type(val);
                    break;
            }

            /* Pass along the new, more concrete *property* value instead of
             * the fuzzy attribute value.
             */
            this._propertiesChanged(prop, this.__data[prop]);
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
