import {
    functionalMolecule,
    HTMLCollectionByID,
    Properties,
    PropConfig,
    Molecule,
} from '../../molecule-functional/module/molecule-functional';

import { render, TemplateResult, html } from '../node_modules/lit-html/lit-html';

export {
    functionalMolecule,
    Molecule,
    render, TemplateResult, html, Properties, HTMLCollectionByID, PropConfig };

export const functionalMoleculeLit = functionalMolecule(render);

export default { functionalMoleculeLit, ...Molecule };
