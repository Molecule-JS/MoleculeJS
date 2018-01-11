import { html, svg, render, TemplateResult } from '../node_modules/lit-html/lit-html.js';
import { LitLite, HTMLClass, HTMLCollectionByID, data, propConfig, properties, camelCaseToKebab, methodsToCall, LitEventInit } from './lit-lite.js';

export const LitElement = (superclass: HTMLClass) => LitLite(superclass, html, render);

export { html, svg, TemplateResult };
export { HTMLClass, HTMLCollectionByID, data, propConfig, properties, camelCaseToKebab };