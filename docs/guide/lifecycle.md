# Lifecycle Hooks
Molecule gives you several lifecycle hooks for your elements, the standard custom elements lifecycles and also additional hooks.
## Standard Custom Element Hooks
### connectedCallback
Called when the element is connected to the DOM. But since you have to call `super.connectedCallback` in your
callback, your custom `connectedCallback` is actually run after the first render. Because of this confusion, using `connectedCallback` is
**discouraged**.
### disconnectedCallback
Called when the element is disconnected from the DOM. Use this callback to remove event listeners, etc.
### adoptedCallback
Called when the custom element is moved to a new document.
### attributeChangedCallback
Invoked when one of the custom element’s attributes is added, removed, or changed. Since Molecule handles
your attributes for you, using `attributeChangedCallback` is **discouraged**.

## Molecule Hooks
### connected
Called after the element is connected to the DOM and after the property accessors are defined, but before the first render. Use
this instead of `connectedCallback`.
### disconnected
Called when the element is disconnected from the DOM. virtually the same as `disconnectedCallback`. Only exists for
consistency with `connected`.
### afterRender
Called after every render. It gets passed a boolean representing, if this is the first render. 

## Example
```js
class ArticleList extends Element {
  static get properties() {
    return {
      selected: {
        value: '',
        type: String,
        attribute: true
      },
      articles: () => []
    }
  }
  
  constructor() {
    super();
    this._articleChanged = this._articleChanged.bind(this);
  }
  
  render() {
    // your template
  }
  
  connected() {
    this.addEventListener('article-changed', this._articleChanged);
    fetch(/* api url */)
      .then(res => this.articles = res.json());
  }

  disconnected() {
    this.removeEventListener('article-changed', this._articleChanged);
  }

  _articleChanged(event) {
    // handle the event
  }
}
```