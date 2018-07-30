import { directive } from 'lit-html/lit-html';

/**
 * Sets the part to a new element of the type selector
 * with the given props, attributes and innerHTML
 */
export const setElement = (
    Element: any,
    { props = {},
        attributes = {},
    } = {}) => directive((part: any) => {
      const elem = new Element();
      for (const prop in props) {
        (elem as any)[prop] = (props as any)[prop];
      }
      for (const attr in attributes) {
        elem.setAttribute(attr, (attributes as any)[attr]);
      }
      part.setValue(elem);
    });

export default { MoleculeSetElement: setElement };
