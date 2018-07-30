import {
    functionalMolecule,
    HTMLCollectionByID,
    PropConfig,
    Properties,
    Molecule,
} from '../../molecule-functional/dist/molecule-functional';
import { render, html } from 'lit-html/lib/lit-extended';

import { TemplateResult } from 'lit-html/lit-html';

export {
    functionalMolecule,
    Molecule,
    render, TemplateResult, html, HTMLCollectionByID, PropConfig, Properties };

export const functionalMoleculeLitExtended = functionalMolecule(render);

export default { functionalMoleculeLitExtended, ...Molecule };
