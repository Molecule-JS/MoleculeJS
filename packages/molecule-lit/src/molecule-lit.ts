import {
  html,
  svg,
  render,
  TemplateResult,
  SVGTemplateResult,
} from 'lit-html/lit-html';

import {
  createBase,
  createProperty,
  camelCaseToKebab,
  HTMLCollectionByID,
  PropConfig,
  Properties,
  MoleculeClass,
  MoleculeElement,
} from '../../molecule/src/molecule';

const MoleculeLit = createBase(render);

export { html, svg, render, TemplateResult, SVGTemplateResult };
export {
  MoleculeLit as Element,
  HTMLCollectionByID,
  PropConfig,
  Properties,
  createProperty,
  camelCaseToKebab,
  MoleculeClass,
  MoleculeElement,
};

export default {
  html,
  svg,
  render,
  createProperty,
  camelCaseToKebab,
  Element: MoleculeLit,
};
