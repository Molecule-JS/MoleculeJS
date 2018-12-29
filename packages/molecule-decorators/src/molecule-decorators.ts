import { observeProperty } from '@moleculejs/molecule';

import { PropConfig } from '@moleculejs/molecule/src/lib/types';

export function property(config: PropConfig = {}) {
  return (prototype: any, propName: string) => {
    observeProperty(propName, prototype, config);
  };
}

export function attribute(
  config: PropConfig = { type: String, attribute: true },
) {
  if (!('a' in config)) {
    config.attribute = true;
  }
  return (prototype: any, propName: string) => {
    observeProperty(propName, prototype, config);
  };
}

export { PropConfig, observeProperty };

export default { property, attribute };
