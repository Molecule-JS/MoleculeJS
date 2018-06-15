import {
    functionalMolecule,
} from '../node_modules/@moleculejs/molecule-functional/molecule-functional';
import { render } from '../node_modules/lit-html/lib/lit-extended';

export { html } from '../node_modules/lit-html/lib/lit-extended';

export const functionalMoleculeLitExtended = functionalMolecule(render);

export default functionalMoleculeLitExtended;
