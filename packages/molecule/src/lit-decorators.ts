import { _createProperty, PropConfig, camelCaseToKebab } from './lit-lite.js'

export function property(config: PropConfig = { type: String }) {
    return (prototype: any, propName: string) => {
        const attrName = camelCaseToKebab(propName);
        _createProperty(propName, attrName, prototype, config);
    }
}

export function attribute(config: PropConfig = { type: String, reflectToAttribute: true }) {
    if(! ('reflectToAttribute' in config))
        config.reflectToAttribute = true;
    return (prototype: any, propName: string) => {
        const attrName = camelCaseToKebab(propName);
        _createProperty(propName, attrName, prototype, config);
    }
}