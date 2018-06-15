import {
  Molecule,
  Properties,
  PropConfig,
  HTMLCollectionByID,
  MoleculeEventInit,
  createProperty,
} from '../../molecule/module/molecule';

export {
  Molecule,
  Properties,
  PropConfig,
  HTMLCollectionByID,
  MoleculeEventInit,
  createProperty,
};

export const functionalMolecule = <T>(renderFunction:
  (result: T, container: Element | DocumentFragment) => void) =>
  (propConfig: Properties) =>
    (template: (props?: { [key: string]: any }) => T) =>
      class extends Molecule(renderFunction) {
        static get properties() {
          return propConfig;
        }

        render(props: { [key: string]: any }) {
          return template.bind(this)(props);
        }
      };

export default { functionalMolecule };
