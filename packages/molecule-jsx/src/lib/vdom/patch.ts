import { VDomElement, container } from '../../molecule-jsx';

export interface Patch {
  dom?: Node;
  vNode: VDomElement;
  type: PatchType;
  parent: container;
}

export interface PrimitivePatch extends Patch {
  oldValue: any;
}

export interface PropPatch extends Patch {
  name: string;
  oldValue: any;
  value: any;
  dom: Node;
}

export enum PatchType {
  PATCH_TYPE_PRIMITIVE,
  PATCH_TYPE_PROP,
  PATCH_TYPE_COMPLETE,
}
