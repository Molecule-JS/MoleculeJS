# Molecule &middot; [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/Molecule-JS/MoleculeJS/blob/master/LICENSE) [![npm version](https://badge.fury.io/js/%40moleculejs%2Fmolecule.svg)](https://badge.fury.io/js/%40moleculejs%2Fmolecule) [![Build Status](https://travis-ci.org/Molecule-JS/MoleculeJS.svg?branch=master)](https://travis-ci.org/Molecule-JS/MoleculeJS) [![Greenkeeper badge](https://badges.greenkeeper.io/Molecule-JS/MoleculeJS.svg)](https://greenkeeper.io/)

## Overview

Molecule is a JavaScript library for building user interfaces using web components.

This package provides a function that takes a render method and returns a baseclass to create Custom Elements.

## Installation

The `@moleculejs/molecule` package can be installed using npm or yarn:

```
npm install --save @moleculejs/molecule
```

```
yarn add @moleculejs/molecule
```

## Documentation

See the full documentation at [MoleculeJS.org](https://moleculejs.org).

## Examples

Let's start with a simple Example:

```js
const render = (template, container) => {
  /*  Your function that renders the template returned by your
      elements `render` instance method (see below).
      This gets called whenever properties of the element change.
  */
};

const MyNewBaseClass = Molecule.Element(render);

class HelloWorld extends MyNewBaseClass {
  static get properties() {
    return {
      name: String,
      attribute: true,
      value: 'John Doe',
    };
  }
  render({ name }) {
    //  Returns a template of any type, in this case a string
    `
      <div>Hello ${name}</div>
    `;
  }
}

customElements.define('hello-world', HelloWorld);
```

This creates a new Custom Element called `hello-world`, which can now be used anywhere in your application using `<hello-world>`.

This new element will also keep the _property_ `name` in sync with the _attribute_ `name`, meaning that the element will look like this in the DOM:

```html
<hello-world name="John Doe"></hello-world>
```

If you change the attribute or the property, both will be kept in sync and the element will be rerendered.

## Premade Base Classes

There are several other base classes for Molecule with different rendering methods, like lit-html or JSX. A complete list of official packages for Molecule can be found in the [full documentation](https://moleculejs.org/guide/packages.html)

## Contributing

Coming soon!
