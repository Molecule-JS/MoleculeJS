import {
  html,
  svg,
  render,
  TemplateResult,
  SVGTemplateResult,
} from 'lit-html/lit-html';

import {
  Element,
  createProperty,
  camelCaseToKebab,
  HTMLCollectionByID,
  PropConfig,
  Properties,
} from '../../molecule/dist/molecule';

const MoleculeLit = Element(render);

export { html, svg, render, TemplateResult, SVGTemplateResult };
export {
  MoleculeLit as Element,
  HTMLCollectionByID,
  PropConfig,
  Properties,
  createProperty,
  camelCaseToKebab };

export default {
  html,
  svg,
  render,
  createProperty,
  camelCaseToKebab,
  Element: MoleculeLit,
};
