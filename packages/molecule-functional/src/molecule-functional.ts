import {
  camelCaseToKebab,
  Properties,
  PropConfig,
  HTMLCollectionByID,
  MoleculeEventInit,
  createBase,
  MoleculeClass,
  MoleculeElement,
} from '../../molecule/src/molecule';

export type camelCaseToKebab = typeof camelCaseToKebab;

export {
  Properties,
  PropConfig,
  HTMLCollectionByID,
  MoleculeEventInit,
  MoleculeClass,
  MoleculeElement,
};

export const functionalMolecule = <T>(
  renderFunction: (result: T, container: Element | DocumentFragment) => void,
) => (propConfig: Properties) => (
  template: (props?: { [key: string]: any }) => T,
): MoleculeClass<MoleculeElement<T>> =>
  class extends createBase(renderFunction) {
    static get properties() {
      return propConfig;
    }

    render(props: { [key: string]: any }) {
      return template.bind(this)(props);
    }
  };
