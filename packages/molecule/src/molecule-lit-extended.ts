import { svg, TemplateResult } from '../node_modules/lit-html/lit-html.js';
import { html, render } from '../node_modules/lit-html/lib/lit-extended.js';
import { Molecule, HTMLCollectionByID, Data, PropConfig, Properties, camelCaseToKebab, MethodsToCall } from './molecule.js';

export const MoleculeLitExtended = Molecule(render);

export { html, svg, TemplateResult };
export { HTMLCollectionByID, Data, PropConfig, Properties, camelCaseToKebab, MethodsToCall };