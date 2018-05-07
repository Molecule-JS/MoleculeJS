import { svg, TemplateResult } from '../lit-html/lit-html.js';
import { html, render } from '../lit-html/lib/lit-extended.js';
import { Molecule, camelCaseToKebab } from './molecule.js';
export const MoleculeLitExtended = (superclass = HTMLElement) => Molecule(superclass, render);
export { html, svg, TemplateResult };
export { camelCaseToKebab };
//# sourceMappingURL=molecule-lit-extended.js.map