import { svg, TemplateResult } from '../lit-html/lit-html.js';
import { html, render } from '../lit-html/lib/lit-extended.js';
import { LitLite, HTMLCollectionByID, Data, PropConfig, Properties, camelCaseToKebab, MethodsToCall } from './lit-lite.js';

export const LitElementExtended = (superclass = HTMLElement) => LitLite(superclass, html, render);

export { html, svg, TemplateResult };
export { HTMLCollectionByID, Data, PropConfig, Properties, camelCaseToKebab, MethodsToCall };