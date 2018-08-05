import Molecule, {
  PropConfig,
  createProperty,
} from '../../molecule/src/molecule';

export function property(config: PropConfig = {}) {
  return (prototype: any, propName: string) => {
    createProperty(propName, prototype, config);
  };
}

export function attribute(
  config: PropConfig = { type: String, attribute: true },
) {
  if (!('a' in config)) {
    config.attribute = true;
  }
  return (prototype: any, propName: string) => {
    createProperty(propName, prototype, config);
  };
}

export { Molecule, PropConfig, createProperty };

export default { property, attribute, ...Molecule };
