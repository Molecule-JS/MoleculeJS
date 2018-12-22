import { camelCaseToKebab } from './camel-to-kebab-case';

export const getAttributeforProp = (
  prop: string,
  attrConfig: boolean | string,
) => {
  if (typeof attrConfig === 'boolean') {
    return camelCaseToKebab(prop);
  }
  return attrConfig;
};
