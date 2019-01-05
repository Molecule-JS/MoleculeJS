export interface Properties {
  [propName: string]: PropConfig | Value;
}

export type Type = (val: any) => any;

export type Value =
  | boolean
  | string
  | number
  | symbol
  | (() => any)
  | undefined;

export interface PropConfig {
  type?: Type;
  attribute?: boolean | string;
  value?: Value;
  observer?: string;
  event?: boolean | string;
}

export interface HTMLCollectionByID {
  [id: string]: HTMLElement | Element;
}

export interface MoleculeEventInit extends EventInit {
  composed: boolean;
}
