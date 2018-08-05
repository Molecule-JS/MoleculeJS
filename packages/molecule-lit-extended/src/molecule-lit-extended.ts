import { svg, TemplateResult, SVGTemplateResult } from 'lit-html/lit-html';
import { html, render } from 'lit-html/lib/lit-extended';
import Molecule, {
  HTMLCollectionByID,
  PropConfig,
  Properties,
} from '../../molecule/src/molecule';

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
