import { Molecule, Properties } from '../node_modules/@moleculejs/molecule/molecule';

export { Properties, PropConfig, HTMLCollectionByID, MoleculeEventInit, Molecule, createProperty } from '../node_modules/@moleculejs/molecule/molecule';

export const functionalMolecule = <T>(renderFunction:
    (result: T, container: Element | DocumentFragment) => void) =>
    (propConfig: Properties) =>
        (template: (props?: { [key: string]: any }) => T) =>
            class extends Molecule(renderFunction) {
                static get properties() {
                    return propConfig;
                }

                render(props: { [key: string]: any }) {
                    return template(props);
                }
            }

export default functionalMolecule;