import {
  html,
  svg,
  render,
  TemplateResult,
  SVGTemplateResult,
} from '../node_modules/lit-html/lit-html';

export type camelCaseToKebab = typeof Molecule.camelCaseToKebab;

import Molecule,
{
  HTMLCollectionByID,
  PropConfig,
  Properties,
} from '../../molecule/module/molecule';

export const MoleculeLit = Molecule.Element(render);

export { html, svg, render, TemplateResult, SVGTemplateResult };
export { HTMLCollectionByID, PropConfig, Properties, Molecule };

export default {
  html,
  svg,
  render,
  ...Molecule,
  Element: MoleculeLit,
};
