var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { html, render as litRender } from '../node_modules/lit-html/lit-html.js';
/**
 * Coverts a camelCase string to kebab-case.
 *
 * @export
 * @param {string} str The camelCaseString
 * @returns {string} The kebab-version of the string
 */
export function camelCaseToKebab(str) {
    return str.replace(/([A-Z])/g, '-$1').toLowerCase();
}
/**
 * Returns a class with the Lit-Element features, that extends `superclass`.
 * @param {*} superclass
 */
export const LitElement = (superclass) => class extends superclass {
    constructor() {
        super();
        this.__data = {};
        this._methodsToCall = {};
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
    static observedAttributes() {
        let attrs = [];
        for (const prop in this.properties) {
            if (this.properties[prop].reflectToAttribute) {
                attrs.push(camelCaseToKebab(prop));
            }
        }
        return attrs;
    }
    connectedCallback() {
        const props = this.constructor.properties;
        this._wait = true;
        for (let prop in props) {
            this._makeGetterSetter(prop, props[prop]);
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
    _makeGetterSetter(prop, info) {
        const element = this;
        const attr = this._propAttr.get(prop);
        Object.defineProperty(this, prop, {
            get() {
                return element.__data[prop];
            },
            set(val) {
                return __awaiter(this, void 0, void 0, function* () {
                    const resolved = (val != null && val instanceof Promise
                        ? yield val
                        : val);
                    if (typeof info === 'object') {
                        if (info.reflectToAttribute) {
                            if (info.type === Object || info.type === Array) {
                                console.warn('Rich Data shouldn\'t be set as attribte!');
                            }
                            element.setAttribute(attr, resolved);
                        }
                        else
                            element.__data[prop] = resolved;
                    }
                    element._propertiesChanged(prop, resolved);
                });
            }
        });
        if (typeof info === 'object') {
            if (info.observer) {
                if (this[info.observer]) {
                    this._methodsToCall[prop] = this[info.observer].bind(this);
                }
                else {
                    console.warn(`Method ${info.observer} not defined!`);
                }
            }
            if (info.value) {
                this.__data[prop] = info.value;
            }
        }
        this.__data[prop] = this.getAttribute(attr);
    }
    /**
     * Gets called when the properties change and the Element should rerender.
     *
     * @param {string} prop
     * @param {any} val
     */
    _propertiesChanged(prop, val) {
        if (this._methodsToCall[prop]) {
            this._methodsToCall[prop](val);
        }
        if (!this._wait) {
            litRender(this.render(), this.shadowRoot);
        }
    }
    /**
     * Gets called when an observed attribute changes. Calls `_propertiesChanged`
     *
     * @param {string} prop
     * @param {any} old
     * @param {any} val
     */
    attributeChangedCallback(attr, old, val) {
        if (old === val)
            return;
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
                        this.__data[prop] = false;
                    }
                    else {
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
                    }
                    else {
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
    render() {
        return html ``;
    }
    /**
     * Gets all children with ids.
     *
     * @readonly
     */
    get $() {
        const arr = this.shadowRoot.querySelectorAll('[id]');
        const obj = {};
        for (const el of arr) {
            obj[el.id] = el;
        }
        return obj;
    }
};
//# sourceMappingURL=lit-element.js.map