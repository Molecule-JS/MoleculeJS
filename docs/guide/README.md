# Introduction

## What is MoleculeJS?
MoleculeJS is a small library for easily building robust, fast and flexible **Custom Elements**. It helps you to keep your attributes and properties in sync with your view layer and react to changes. Molecule is focused on doing the repetitive heavy-lifting, that's often involved with Custom Elements, for you.

## Getting started
::: warning
This Guide assumes basic knowledge of JavaScript, HTML and CSS. You will also need to be familiar with ES2015 (sometimes called ES6).
:::

You can easily try out Molecule on [CodePen](https://codepen.io/DiiLord/pen/bMMKGJ) or similiar sites. There you can try out everything we use in this guide or experiment on your own. Alternatively you can also include Molecule in you HTML page with:
```html
<!--The dev verion with more verbose logging ... -->
<script src="https://unpkg.com/@moleculejs/molecule-lit/dist/molecule-lit.dev.js"></script>
<!--... Or the production version -->
<script src="https://unpkg.com/@moleculejs/molecule-lit"></script>
```
For this guide, we will focus on rendering using [lit-html](https://github.com/Polymer/lit-html) from the Polymer team, but as we will discuss later, all concepts here apply to every render method you might use.

## What are Web Components?
MoleculeJS builds on the **Web Component** standard, you'll probably want to be familiar with them, if you work with MoleculeJS.
The Web Component spec consist of four parts:
- **Custom Elements** give you the ability to create self-contained, reusable HTMLElements that you can use just native elements on your website.
- **Shadow DOM** allows you to encapsulate your elements, so your styles and JavaScript don't affect the rest of your site.
- **HTML Template** defines how to declare fragments of markup that go unused at page load, but can be used later on.
- **HTML Imports** allows you to import and reuse HTML markup in other documents, but this spec is only supported in Chrome and Opera.

Especially Custom Elements and Shadow DOM are great technologies for splitting your UI into small, specialized components or building UI component libraries. MoleculeJS focuses on these specifications and HTML Templates can be used by the renderer of your choice, like lit-html.

To understand why using Molecule might be beneficial, let's look at Custom Elements without MoleculeJS, **Vanilla WebComponents**.

## Vanilla Web Components
Here we will create a fancy new button as a new Custom Element. We'll call it `FancyButton`:
```js
class FancyButton extends HTMLElement {

}
```
To use Custom Elements you must create a class for that element that extends `HTMLElement`.

Now, let's use Shadow DOM to create a template for the element:
```js
class FancyButton extends HTMLElement {
  constructor() {
    super();
    // Create a ShadowRoot and attach it to this element:
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    // Attach our content to the shadow root
    this.shadowRoot.innerHTML = `<div>Click me!</div>`;
  }
}
```
This is now a complete, working custom element. But to use it, we still have to register it like this:
```js
customElements.define('fancy-button', FancyButton);
```
And now we can use it with the selector, we defined it with.
```html
<fancy-button></fancy-button>
```

But right now our fancy-button can do basically nothing. First we use a slot to allow for custom text:
```js{8}
class FancyButton extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.shadowRoot.innerHTML = `<div><slot></slot></div>`;
  }
}
```

Now, we can write
```html
<fancy-button>My own text!</fancy-button>
```

In order to make this button really fancy and react to changes to the attribute `fancy-color`, let's create a property on our `FancyButton` and observe the attribute.

```js
class FancyButton extends HTMLElement {
  // This tells the browser that we want to react to changes of these attributes.
  static get observedAttributes() {
    return ['fancy-color'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  // Move the template to a new function
  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          cursor: pointer;
          color: red;
          /* either our custom color or green */
          border: 2px dotted ${this.fancyColor || 'green'};
        }
      </style>
      <slot></slot>
    `;
  }

  // If fancy-color changes, update the property
  attributeChangedCallback(attr, old, val) {
    if(attr === 'fancy-color')
      this.fancyColor = val;
    this.render();
  }

}
```

Now we have a complete web component that reacts to changes of it's attributes. But, it's not perfect. This required a lot of boilerplate code, just to react to attribute changes. For each additional observed attribute, we would need to update both `observedAttributes` and `attributeChangedCallback`. This entire boilerplate is also nedded for **each new element**, which equals a lot of copy/paste. We also have to call `render` manually, everywhere we change `fancyColor`.

It would be much better, if we could our properties just once and the element reacts automatically to changes, without us having to write all this. That is where **Molecule** shines.

## Molecule Elements
Let's convert our `FancyButton` to Molecule to learn the API. First we declare our `properties` on our class:
```js
class FancyButton extends Molecule.Element {
  static get properties() {
    return {
      fancyColor: {
        attribute: true,
        value: 'green'
      }
    }
  }
}
```
We will discuss properties in detail later, for now all we need to know, that we tell Molecule, that we care about the property `fancyColor`, that it's default value is `'green'` and that it should be kept in sync with the attribute `fancy-color`. Every property declared here will be *reactive*, meaing that changing it, will trigger rerenders.

::: tip
We observe the attribute `fancy-color` instead of `fancyColor`, because HTML attributes aren't case-sensitive and kebab-case is the norm here.
:::

Next we have to declare how our element should look. For that, we have to choose our templating method, since Molecule is agnostic about your rendering method. For now, we will use [lit-html](https://github.com/Polymer/lit-html). To do that, we use MoleculeLit. Regardless of our templating function, we write the template in the `render` function, as we did before.

```js{1,11-23}
class FancyButton extends MoleculeLit.Element {
  static get properties() {
    return {
      fancyColor: {
        attribute: true,
        value: 'green'
      }
    }
  }

  render() {
    return html`
      <style>
        :host {
          cursor: pointer;
          color: red;
          /* either our custom color or green */
          border: 2px dotted ${this.fancyColor || 'green'};
        }
      </style>
      <slot></slot>
    `;
  }
}
```
And that is all we have to do!
