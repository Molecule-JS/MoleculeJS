import { svg, TemplateResult } from '../lit-html/lit-html.js';
import { html, render } from '../lit-html/lib/lit-extended.js';
import { LitLite, HTMLClass, HTMLCollectionByID, data, propConfig, properties, camelCaseToKebab, methodsToCall } from './lit-lite.js';

export const LitElementExtended = (superclass: HTMLClass) => LitLite(superclass, html, render);

export { html, svg, TemplateResult };
export { HTMLClass, HTMLCollectionByID, data, propConfig, properties, camelCaseToKebab };