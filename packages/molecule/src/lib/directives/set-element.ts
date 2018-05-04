import { directive } from '../../../node_modules/lit-html/lit-html.js';

/**
 * Sets the part to a new element of the type selector with the given props, attributes and innerHTML
 * 
 * @param {string} selector 
 * @param {any} [{ props={}, attributes={}, innerHTML = '' }={}] 
 */
export const setElement = (selector: string, { props={}, attributes={}, innerHTML = '' } = {}) => directive((part: any) => {
    const elem = document.createElement(selector);
    for(const prop in props)
        (elem as any)[prop] = (props as any)[prop];
    for(const attr in attributes)
        elem.setAttribute(attr, (attributes as any)[attr]);
    elem.innerHTML = innerHTML;
    part.setValue(elem);
})