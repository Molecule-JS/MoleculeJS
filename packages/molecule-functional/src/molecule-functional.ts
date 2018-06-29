import Molecule,
{
  Properties,
  PropConfig,
  HTMLCollectionByID,
  MoleculeEventInit,
  Element,
} from '../../molecule/dist/molecule';

export type camelCaseToKebab = typeof Molecule.camelCaseToKebab;

export {
  Properties,
  PropConfig,
  HTMLCollectionByID,
  MoleculeEventInit,
  Molecule,
};

export const functionalMolecule = <T>(renderFunction:
  (result: T, container: Element | DocumentFragment) => void) =>
  (propConfig: Properties) =>
    (template: (props?: { [key: string]: any }) => T) =>
      class extends Element(renderFunction) {
        static get properties() {
          return propConfig;
        }

        render(props: { [key: string]: any }) {
          return template.bind(this)(props);
        }
      };

export default { functionalMolecule, ...Molecule };
