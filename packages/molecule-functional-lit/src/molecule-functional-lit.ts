import {
    functionalMolecule,
} from '../node_modules/@moleculejs/molecule-functional/molecule-functional';
import { render, TemplateResult } from '../node_modules/lit-html/lit-html';

export { html } from '../node_modules/lit-html/lib/lit-extended';

export const functionalMoleculeLit = functionalMolecule(render);

export default functionalMoleculeLit;
