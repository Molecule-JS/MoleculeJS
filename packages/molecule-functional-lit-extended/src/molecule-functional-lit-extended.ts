import {
    functionalMolecule,
    HTMLCollectionByID,
    PropConfig,
    Properties,
} from '../../molecule-functional/module/molecule-functional';
import { render, html } from '../node_modules/lit-html/lib/lit-extended';

import { TemplateResult } from '../node_modules/lit-html/lit-html';

export {
    functionalMolecule,
    render, TemplateResult, html, HTMLCollectionByID, PropConfig, Properties };

export const functionalMoleculeLitExtended = functionalMolecule(render);

export default { functionalMoleculeLitExtended };
