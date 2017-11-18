import { html, render as litRender, TemplateResult } from '../node_modules/lit-html/lit-html.js';
export interface HTMLClass extends HTMLElement {
    new(): HTMLClass;
}

export interface properties {
    [propName: string]: propConfig;
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

export const LitElement = (superclass: HTMLClass) => class extends superclass {
    static properties: properties;
    __data: data = {};
    _methodsToCall: methodsToCall = {};
    _wait: boolean;
    afterFirstRender?: () => void;
    shadowRoot: ShadowRoot;

    static observedAttributes(): Array<string> {
        let attrs: Array<string> = [];
        for (const prop in this.properties) {
            if (this.properties[prop].reflectToAttribute) {
                attrs.push(prop);
            }
        }
        return attrs;
    }

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
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
        const element = this;
        Object.defineProperty(this, prop, {
            get() {
                return element.__data[prop]
            },
            set(val: any) {
                if (info.reflectToAttribute) {
                    if (info.type === Object || info.type === Array) {
                        console.warn('Rich Data shouldn\'t be set as attribte!')
                    }
                    element.setAttribute(prop, val);
                } else element.__data[prop] = val;
                element._propertiesChanged(prop, val);
            }
        });

        if (info.observer) {
            if (this[info.observer]) {
                this._methodsToCall[prop] = this[info.observer].bind(this);
            } else {
                console.warn(`Method ${info.observer} not defined!`);
            }
        }
        if (info.value) {
            this.__data[prop] = info.value;
        }


        this.__data[prop] = this.getAttribute(prop) || this.__data[prop];
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
    attributeChangedCallback(prop: string, old: any, val: any) {
        if (old === val) return
        if (this.__data[prop] !== val) {
            const { type } = this.constructor.properties[prop];
            if (type.name === 'Boolean') {
                if (val !== 'false') {
                    this.__data[prop] = this.hasAttribute(prop);
                } else {
                    this.__data[prop] = false
                }
            } else this.__data[prop] = type(val);
            this._propertiesChanged(prop, val);
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