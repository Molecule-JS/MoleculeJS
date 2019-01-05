import {
  html,
  svg,
  render,
  TemplateResult,
  SVGTemplateResult,
} from 'lit-html/lit-html';

import {
  MoleculeElement,
  observeProperty,
  camelCaseToKebab,
} from '@moleculejs/molecule';

import {
  HTMLCollectionByID,
  PropConfig,
  Properties,
} from '@moleculejs/molecule/src/lib/types';

abstract class MoleculeLit extends MoleculeElement<TemplateResult> {
  renderer(template: TemplateResult, container: Element | DocumentFragment) {
    return render(template, container);
  }
}

export { html, svg, render, TemplateResult, SVGTemplateResult };
export {
  MoleculeLit as Element,
  HTMLCollectionByID,
  PropConfig,
  Properties,
  observeProperty,
  camelCaseToKebab,
};
