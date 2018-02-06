import { html, svg, render, TemplateResult } from '../node_modules/lit-html/lit-html.js';
import { LitLite, HTMLCollectionByID, Data, PropConfig, Properties, camelCaseToKebab, MethodsToCall } from './lit-lite.js';

export const LitElement = (superclass = HTMLElement) => LitLite(superclass, html, render);

export { html, svg, TemplateResult };
export { HTMLCollectionByID, Data, PropConfig, Properties, camelCaseToKebab };