import { html, svg, render, TemplateResult } from '../lit-html/lit-html.js';
import { Molecule, camelCaseToKebab } from './molecule.js';
export const MoleculeLit = (superclass = HTMLElement) => Molecule(superclass, render);
export { html, svg, TemplateResult };
export { camelCaseToKebab };
//# sourceMappingURL=molecule-lit.js.map