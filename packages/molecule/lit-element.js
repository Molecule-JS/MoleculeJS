import { html, render as litRender } from '../node_modules/lit-html/lit-html.js'

export default class LitElement extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: "open"});
    }

    connectedCallback() {
        const props = this.constructor.properties;
        for(let prop in props) {
            if(typeof props[prop] === 'object') {
                this._makeComplexGetterSetter(prop, props[prop])
            } else {
                this._makeGetterSetter(prop, props[prop])
            }
        }
        litRender(this.render(), this.shadowRoot);
    }

    _makeGetterSetter(prop, val) {
        if(!this.__data)
            this.__data = {};
        Object.defineProperty(this, prop, {
            get() {
                return this.__data[prop]
            },
            set(val) {
                this.__data[prop] = val;
                this._propertiesChanged()
            }
        })
        this[prop] = undefined;
    }

    _makeComplexGetterSetter(prop, info) {
        if(!this.__data)
            this.__data = {};
        Object.defineProperty(this, prop, {
            get() {
                if(info.reflectToAttribute) {
                    if(info.type === Object || info.type === Array)
                        console.warn('Rich Data shouldn\'t be set as attribte!')
                    return this.getAttribute(prop);
                } else return this.__data[prop];
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
        litRender(this.render(), this.shadowRoot)
    }

    render() {
        return html`Render Function not defined`
    }
}