import { PropConfig } from './types';
import { __DEV__ } from './constants';
import { MoleculeElement } from '../molecule';

/**
 *
 * @param {string} prop The name of the property to create
 * @param {string} attr The name of the attribute
 * @param {PropConfig} info The configuration of the property
 */
export function observeProperty<T extends MoleculeElement<any>>(
  this: T,
  prop: string,
  info: PropConfig,
  data: { [propName: string]: any },
  methodsToCall: {
    [propName: string]: (newValue: any, oldValue: any) => any;
  },
) {
  // get value that was already set on the property (if any)
  let setVal = (this as any)[prop];
  if (setVal === undefined) {
    setVal = data[prop];
  }
  Object.defineProperty(this, prop, {
    get() {
      return this.__data[prop];
    },
    set<V>(val: V) {
      return this.setProperty(prop, val, false) as Promise<V>;
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
    if ((this as any)[info.observer]) {
      // Establish the property-change observer
      methodsToCall[prop] = (this as any)[info.observer].bind(this);
    } else {
      if (__DEV__) {
        console.error(`Property ${prop}: Method ${info.observer} not defined!`);
      }
    }
  }
  // Check, if the property was already set, set it accordingly
  if (setVal !== undefined) {
    (this as any)[prop] = setVal;
    return;
  }
  // Initialize using the included value and the new setter()
  (this as any)[prop] =
    typeof info.value === 'function' ? info.value.call(this) : info.value;
}
