import Molecule, { PropConfig, createProperty } from '../../molecule/module/molecule';

export function property(config: PropConfig = { type: String }) {
  return (prototype: any, propName: string) => {
    createProperty(propName, prototype, config);
  };
}

export function attribute(config: PropConfig = { type: String, reflectToAttribute: true }) {
  if (!('reflectToAttribute' in config)) {
    config.reflectToAttribute = true;
  }
  return (prototype: any, propName: string) => {
    createProperty(propName, prototype, config);
  };
}

export { Molecule, PropConfig, createProperty };

export default { property, attribute, ...Molecule };
