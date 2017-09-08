import { html, render as litRender } from '../lit-html/lit-html.js'

export default class LitElement extends HTMLElement {

    static get observedAttributes() {
        let attrs = [];
        for(const prop in this.properties) 
            if(this.properties[prop].reflectToAttribute)
                attrs.push(prop)
        return attrs;
    }

    constructor() {
        super();
        this.__data = {};
        this.attachShadow({mode: "open"});
    }

    connectedCallback() {
        const props = this.constructor.properties;
        this._wait = true;
        for(let prop in props) {
            if(typeof props[prop] === 'object') {
                this._makeComplexGetterSetter(prop, props[prop])
            } else {
                this._makeGetterSetter(prop, props[prop])
            }
        }
        delete this._wait;
        litRender(this.render(), this.shadowRoot);
        if(this.afterFirstRender)
            this.afterFirstRender();
    }

    _makeGetterSetter(prop, val) {
        Object.defineProperty(this, prop, {
            get() {
                return this.__data[prop]
            },
            set(val) {
                this.__data[prop] = val;
                this._propertiesChanged()
            }
        })
        this[prop] = this.getAttribute(prop);
    }

    _makeComplexGetterSetter(prop, info) {
        Object.defineProperty(this, prop, {
            get() {
                if(info.reflectToAttribute) {
                    if(info.type === Object || info.type === Array)
                        console.warn('Rich Data shouldn\'t be set as attribte!')
                } 
                return this.__data[prop];
            },

            set(val) {
                if(info.reflectToAttribute) {
                    if(info.type === Object || info.type === Array)
                        console.warn('Rich Data shouldn\'t be set as attribte!')
                    this.setAttribute(prop, val);
                } else this.__data[prop] = val;
                this._propertiesChanged();
            }
        });
        if(info.value) {
            typeof info.value === 'function'
            ? this[prop] = info.value()
            : this[prop] = info.value; 
        }
    }

    _propertiesChanged() {
        if(!this._wait)
            litRender(this.render(), this.shadowRoot)
    }

    attributeChangedCallback(prop, old, val) {
        if(this[prop] !== val) {
            const {type} = this.constructor.properties[prop];
            if(type.name === 'Boolean') {
                if(val !== 'false') {
                    this.__data[prop] = this.hasAttribute(prop);
                } else {
                    this.__data[prop] = false
                }
            } else this.__data[prop] = type(val);
            this._propertiesChanged();
        }
    }

    render() {
        return html`Render Function not defined`
    }

    get $() {
        const arr = this.shadowRoot.querySelectorAll('[id]');
        const obj = {};
        for(const el of arr)
            obj[el.id] = el;

        return obj;
    }
}