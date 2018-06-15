import { directive } from '../node_modules/lit-html/lit-html';

/**
 * Sets the part to a new element of the type selector
 * with the given props, attributes and innerHTML
 *
 * @param {string} selector
 * @param {any} [{ props={}, attributes={}, innerHTML = '' }={}]
 */
export const setElement = (
  Element: any,
  { props = {},
    attributes = {},
    innerHTML = '' } = {}) => directive((part: any) => {
      const elem = new Element();
      for (const prop in props) {
        (elem as any)[prop] = (props as any)[prop];
      }
      for (const attr in attributes) {
        elem.setAttribute(attr, (attributes as any)[attr]);
      }
      elem.innerHTML = innerHTML;
      part.setValue(elem);
    });

export default setElement;
