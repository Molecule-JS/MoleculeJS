import { createProperty, PropConfig } from './molecule'

export function property(config: PropConfig = { type: String }) {
    return (prototype: any, propName: string) => {
        createProperty(propName, prototype, config);
    }
}

export function attribute(config: PropConfig = { type: String, reflectToAttribute: true }) {
    if (!('reflectToAttribute' in config))
        config.reflectToAttribute = true;
    return (prototype: any, propName: string) => {
        createProperty(propName, prototype, config);
    }
}

if (!('Decorators' in (window as any).Molecule))
    (window as any).Molecule.Decorators = { property, attribute };