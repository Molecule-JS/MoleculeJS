import { svg, TemplateResult } from '../node_modules/lit-html/lit-html';
import { html, render } from '../node_modules/lit-html/lib/lit-extended';
import { Molecule, HTMLCollectionByID, PropConfig, Properties, camelCaseToKebab } from './molecule';

export const MoleculeLitExtended = Molecule(render);

if (!('LitExtended' in (window as any).Molecule)) {
    (window as any).Molecule.LitExtended = MoleculeLitExtended;
    (window as any).litHTMLExtended = { html, render };
}

export { html, svg, TemplateResult };
export { HTMLCollectionByID, PropConfig, Properties, camelCaseToKebab };