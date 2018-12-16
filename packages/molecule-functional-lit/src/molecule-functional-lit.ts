import {
  functionalMolecule,
  HTMLCollectionByID,
  Properties,
  PropConfig,
  MoleculeClass,
  MoleculeElement,
} from '../../molecule-functional/src/molecule-functional';

import { render, TemplateResult, html } from 'lit-html/lit-html';

export {
  functionalMolecule,
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
