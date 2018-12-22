import { MoleculeElement, PropConfig } from './types';
import { __DEV__ } from './constants';

/**
 *
 * @param {string} prop The name of the property to create
 * @param {string} attr The name of the attribute
 * @param {any} context The context of the element
 * @param {PropConfig} info The configuration of the property
 */
export function observeProperty<T>(
  prop: string,
  context: MoleculeElement<T>,
  info: PropConfig,
) {
  // get value that was already set on the property (if any)
  let setVal = (context as any)[prop];
  if (setVal === undefined) {
    setVal = context.__data[prop];
  }
  Object.defineProperty(context, prop, {
    get() {
      return context.__data[prop];
    },
    set<V>(val: V) {
      return context.setProperty(prop, val, false) as Promise<V>;
    },
  });
  if (__DEV__) {
    if (info.attribute) {
      if (info.type === Object || info.type === Array) {
        console.warn(
          `Property ${prop}: Rich Data shouldn\'t be set as attribute!`,
        );
      }
    }
  }
  if (info.observer) {
    if ((context as any)[info.observer]) {
      // Establish the property-change observer
      context.__methodsToCall[prop] = (context as any)[info.observer].bind(
        context,
      );
    } else {
      if (__DEV__) {
        console.error(`Property ${prop}: Method ${info.observer} not defined!`);
      }
    }
  }
  // Check, if the property was already set, set it accordingly
  if (setVal !== undefined) {
    (context as any)[prop] = setVal;
    return;
  }
  // Initialize using the included value and the new setter()
  (context as any)[prop] =
    typeof info.value === 'function' ? info.value.call(context) : info.value;
}
