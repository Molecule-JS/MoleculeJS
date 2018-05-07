import { html, svg, render, TemplateResult } from '../node_modules/lit-html/lit-html.js';
import { Molecule, HTMLCollectionByID, Data, PropConfig, Properties, camelCaseToKebab, MethodsToCall } from './molecule.js';

export const MoleculeLit = Molecule(render);

export { html, svg, TemplateResult };
export { HTMLCollectionByID, Data, PropConfig, Properties, camelCaseToKebab, MethodsToCall };