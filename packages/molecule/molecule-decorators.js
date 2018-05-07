import { createProperty } from './molecule.js';
export function property(config = { type: String }) {
    return (prototype, propName) => {
        createProperty(propName, prototype, config);
    };
}
export function attribute(config = { type: String, reflectToAttribute: true }) {
    if (!('reflectToAttribute' in config))
        config.reflectToAttribute = true;
    return (prototype, propName) => {
        createProperty(propName, prototype, config);
    };
}
//# sourceMappingURL=molecule-decorators.js.map