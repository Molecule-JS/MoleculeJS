var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { camelCaseToKebab } from './lib/helpers/camel-to-kebab-case.js';
export { camelCaseToKebab };
/**
 *
 * @param {string} prop The name of the property to create
 * @param {string} attr The name of the attribute
 * @param {any} context The context of the element
 * @param {PropConfig} info The configuration of the property
 */
export function createProperty(prop, context, info) {
    // get value that was already set on the property (if any)
    const setVal = context[prop];
    Object.defineProperty(context, prop, {
        get() {
            return context.__data[prop];
        },
        set(val) {
            return __awaiter(this, void 0, void 0, function* () {
                const resolved = (val != null && val instanceof Promise
                    ? yield val
                    : val);
                context.setProperty(prop, resolved);
            });
        }
    });
    if (info.reflectToAttribute &&
        (info.type === Object || info.type === Array)) {
        console.warn('Rich Data shouldn\'t be set as attribte!');
    }
    if (info.observer) {
        if (context[info.observer]) {
            // Establish the property-change observer
            context.__methodsToCall[prop] = context[info.observer].bind(context);
        }
        else {
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
 * Returns a class with the Molecule features, that extends `superclass`.
 * @param superclass
 */
export const Molecule = (superclass = HTMLElement, renderFunction) => class extends superclass {
    constructor() {
        super();
        this.__renderCallbacks = new Set();
        this.__pendingRender = false;
        this.__data = {};
        this.__methodsToCall = {};
        this.__firstRender = false;
        this.__propAttr = new Map(); // propertyName   -> attribute-name
        this.__attrProp = new Map(); // attribute-name -> propertyName
        this.attachShadow({ mode: 'open' });
        for (let prop in this.constructor.properties) {
            const attr = camelCaseToKebab(prop);
            this.__propAttr.set(prop, attr);
            this.__attrProp.set(attr, prop);
        }
    }
    static get observedAttributes() {
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
        this.__wait = true;
        for (let prop in props) {
            if (typeof props[prop] === 'function')
                props[prop] = { type: props[prop] };
            this.__makeGetterSetter(prop, props[prop]);
        }
        delete this.__wait;
        this.__firstRender = true;
        if (this.connected)
            this.connected.call(this);
        /* Perform the first render after connection immediately
         * without the delay of refresh()
         */
        this.postponedRender();
    }
    disconnectedCallback() {
        if (this.disconnected)
            this.disconnected.call(this);
    }
    /**
     * Creates the Propertyaccessors for the defined properties of the Element.
     * @param {string} prop
     * @param {PropConfig} info
     */
    __makeGetterSetter(prop, info) {
        createProperty(prop, this, info);
    }
    /**
     * Gets called when the properties change and the Element should rerender.
     *
     * @param {string} prop
     * @param {any} newVal
     */
    __propertiesChanged(prop, newVal) {
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
     *
     * @param {string} prop
     * @param {*} [newVal]
     */
    setProperty(prop, newVal) {
        if (arguments.length < 2)
            newVal = this[prop];
        const info = this.constructor.properties[prop];
        const attr = this.__propAttr.get(prop);
        if (info.reflectToAttribute) {
            /* Set the new value by setting the observed attribute.
             * This will trigger attributeChangedCallback() which will
             * convert the attribute data to a property,
             * (this.__data[prop]) and trigger __propertiesChanged().
             */
            this.setAttribute(attr, newVal);
        }
        else {
            /* Set the property directly and trigger
             * __propertiesChanged()
             */
            this.__propertiesChanged(prop, newVal);
        }
        if (info.notify) {
            this.dispatchEvent(new CustomEvent(`${attr}-changed`, {
                bubbles: true,
                composed: true,
                detail: newVal
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
    attributeChangedCallback(attr, old, val) {
        if (old === val)
            return;
        const prop = this.__attrProp.get(attr);
        if (this.__data[prop] !== val) {
            const { type } = this.constructor.properties[prop];
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
                    }
                    else {
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
                    }
                    else {
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
        renderFunction(this.render(Object.assign({}, this.__data)), this.shadowRoot);
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
    refresh(callback) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._wait === true) {
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
                this.__pendingRender = yield false;
                this.postponedRender();
            }
        });
    }
    /**
     * Returns should be passed to the render function.
     *
     * @returns
     */
    render(data) {
        throw Error('render function not defined');
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
//# sourceMappingURL=molecule.js.map