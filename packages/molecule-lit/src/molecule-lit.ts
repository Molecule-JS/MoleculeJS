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
} from '@moleculejs/molecule';

import {
  HTMLCollectionByID,
  PropConfig,
  Properties,
  MoleculeClass,
  MoleculeElement,
} from '@moleculejs/molecule/src/lib/types';

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
