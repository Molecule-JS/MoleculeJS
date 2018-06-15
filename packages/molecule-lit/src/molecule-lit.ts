import {
  html,
  svg,
  render,
  TemplateResult,
  SVGTemplateResult,
} from '../node_modules/lit-html/lit-html';
import {
  Molecule,
  HTMLCollectionByID,
  PropConfig,
  Properties,
  camelCaseToKebab,
} from '../../molecule/module/molecule';

export const MoleculeLit = Molecule(render);

export { html, svg, TemplateResult, SVGTemplateResult, render };
export { HTMLCollectionByID, PropConfig, Properties, camelCaseToKebab };

export default {
  MoleculeLit: {
    html,
    render,
    Element: MoleculeLit,
  },
};
