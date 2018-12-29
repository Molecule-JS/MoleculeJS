import { functionalMolecule } from '@moleculejs/molecule-functional';

import {
  HTMLCollectionByID,
  Properties,
  PropConfig,
  MoleculeClass,
  MoleculeElement,
} from '@moleculejs/molecule-functional/src/molecule-functional';

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
