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

export interface MoleculeClass<T> {
  new (): T;
  readonly properties: Properties;
  readonly observedAttributes: string[];
}

export interface MoleculeElement<T> extends HTMLElement {
  __renderCallbacks: Set<any>;
  __pendingRender: boolean;
  __data: { [propName: string]: any };
  __methodsToCall: {
    [propName: string]: (newValue: any, oldValue: any) => any;
  };
  __wait: any;
  __firstRender: boolean;
  __root: Element | DocumentFragment;
  __propAttr: Map<string, string>;
  __attrProp: Map<string, string>;
  __propEvent: Map<string, string>;
  __properties: { [key: string]: PropConfig };
  __forceUpdate: boolean;

  afterRender?(isFirst: boolean): void;
  connected?(): void;
  disconnected?(): void;
  createRoot(): ShadowRoot | HTMLElement;
  connectedCallback(): void;
  disconnectedCallback(): void;
  attributeChangedCallback(attr: string, old: any, val: any): void;
  render(data: { [key: string]: any }): T;

  setProperty(prop: string, newVal?: any, forceUpdate?: boolean): Promise<any>;
  postponedRender(): void;
  refresh(callback?: () => any): Promise<void>;

  __propertiesChanged(prop: string, newVal: any, forceUpdate?: boolean): void;

  readonly $: HTMLCollectionByID;
}
