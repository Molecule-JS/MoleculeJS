import {
  functionalMolecule,
  HTMLCollectionByID,
  PropConfig,
  Properties,
  MoleculeClass,
  MoleculeElement,
  Molecule,
} from '../../molecule-functional/src/molecule-functional';
import { render, html } from 'lit-html/lib/lit-extended';

import { TemplateResult } from 'lit-html/lit-html';

export {
  functionalMolecule,
  Molecule,
  render,
  TemplateResult,
  html,
  HTMLCollectionByID,
  PropConfig,
  Properties,
  MoleculeClass,
  MoleculeElement,
};

export const functionalMoleculeLitExtended = functionalMolecule(render);

export default { functionalMoleculeLitExtended, ...Molecule };
