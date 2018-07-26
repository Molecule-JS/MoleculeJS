---
home: true
heroImage: /molecules.svg
actionText: Get Started →
actionLink: /guide/
features:
- title: Web Components
  details: Built on the Web Components standard to enable you to build fast, contained and robust custom elements.
- title: Declarative
  details: Build declarative UIs with a rendering method of your choosing that react to changes of properties and attributes.
- title: Performant
  details: Molecule is lightweight and only rerenders, if your data changes.
footer: MIT Licensed | Copyright © 2018-present Daniel Drodt
---
### Easy Custom Elements
```js
class Greeting extends MoleculeLit.Element {
  static get properties() {
    return {
      name: 'Daniel'
    }
  }

  render({ name }) {
    return html`Hello, ${name}`;
  }
}
```
