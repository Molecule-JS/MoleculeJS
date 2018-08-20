import {
  functionalMolecule,
  HTMLCollectionByID,
  Properties,
  PropConfig,
  MoleculeClass,
  MoleculeElement,
  Molecule,
} from '../../molecule-functional/src/molecule-functional';

import { render, TemplateResult, html } from 'lit-html/lit-html';

export {
  functionalMolecule,
  Molecule,
  render,
  TemplateResult,
  html,
  Properties,
  HTMLCollectionByID,
  PropConfig,
  MoleculeClass,
  MoleculeElement,
};

export const functionalMoleculeLit = functionalMolecule(render);

export default { functionalMoleculeLit, ...Molecule };
