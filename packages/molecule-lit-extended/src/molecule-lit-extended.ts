import { svg, TemplateResult, SVGTemplateResult } from '../node_modules/lit-html/lit-html';
import { html, render } from '../node_modules/lit-html/lib/lit-extended';
import {
    Molecule,
    HTMLCollectionByID,
    PropConfig,
    Properties,
    camelCaseToKebab } from '../node_modules/@moleculejs/molecule/molecule';

export const MoleculeLitExtended = Molecule(render);

export { html, svg, TemplateResult, SVGTemplateResult };
export { HTMLCollectionByID, PropConfig, Properties, camelCaseToKebab };

export default { MoleculeLitExtended, Molecule, svg, htmlExt: html, renderExt: render };
