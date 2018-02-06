import { svg, TemplateResult } from '../node_modules/lit-html/lit-html.js';
import { html, render } from '../node_modules/lit-html/lib/lit-extended.js';
import { LitLite, HTMLCollectionByID, Data, PropConfig, Properties, camelCaseToKebab, MethodsToCall } from './lit-lite.js';

export const LitElementExtended = (superclass = HTMLElement) => LitLite(superclass, html, render);

export { html, svg, TemplateResult };
export { HTMLCollectionByID, Data, PropConfig, Properties, camelCaseToKebab, MethodsToCall };