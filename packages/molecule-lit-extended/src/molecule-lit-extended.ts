import { svg, TemplateResult, SVGTemplateResult } from 'lit-html/lit-html';
import { html, render } from 'lit-html/lib/lit-extended';
import Molecule, {
  HTMLCollectionByID,
  PropConfig,
  Properties,
  MoleculeClass,
  MoleculeElement,
} from '../../molecule/src/molecule';

export const Element = Molecule.createBase(render);

export { html, svg, render, TemplateResult, SVGTemplateResult };
export {
  HTMLCollectionByID,
  PropConfig,
  Properties,
  Molecule,
  MoleculeClass,
  MoleculeElement,
};

export default {
  html,
  svg,
  render,
  ...Molecule,
  Element,
};
