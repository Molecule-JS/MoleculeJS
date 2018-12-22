import {
  html,
  svg,
  render,
  TemplateResult,
  SVGTemplateResult,
} from 'lit-html/lit-html';

import {
  createBase,
  observeProperty,
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
  observeProperty,
  camelCaseToKebab,
  MoleculeClass,
  MoleculeElement,
};
