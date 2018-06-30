import { svg, TemplateResult, SVGTemplateResult } from '../node_modules/lit-html/lit-html';
import { html, render } from '../node_modules/lit-html/lib/lit-extended';
import Molecule,
{
  HTMLCollectionByID,
  PropConfig,
  Properties,
} from '../../molecule/dist/molecule';

export const Element = Molecule.Element(render);

export { html, svg, render, TemplateResult, SVGTemplateResult };
export { HTMLCollectionByID, PropConfig, Properties, Molecule };

export default {
  html,
  svg,
  render,
  ...Molecule,
  Element,
};
