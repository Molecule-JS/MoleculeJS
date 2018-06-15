import {
    functionalMolecule,
    HTMLCollectionByID,
    Properties,
    PropConfig,
} from '../../molecule-functional/module/molecule-functional';

import { render, TemplateResult, html } from '../node_modules/lit-html/lit-html';

export {
    functionalMolecule,
    render, TemplateResult, html, Properties, HTMLCollectionByID, PropConfig };

export const functionalMoleculeLit = functionalMolecule(render);

export default { functionalMoleculeLit };
