import {
    functionalMolecule,
    HTMLCollectionByID,
    Properties,
    PropConfig,
    Molecule,
} from '../../molecule-functional/dist/molecule-functional';

import { render, TemplateResult, html } from 'lit-html/lit-html';

export {
    functionalMolecule,
    Molecule,
    render, TemplateResult, html, Properties, HTMLCollectionByID, PropConfig };

export const functionalMoleculeLit = functionalMolecule(render);

export default { functionalMoleculeLit, ...Molecule };
