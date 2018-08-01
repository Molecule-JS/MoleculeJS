# Molecule &middot; [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/Molecule-JS/MoleculeJS/blob/master/LICENSE) [![npm version](https://badge.fury.io/js/%40moleculejs%2Fmolecule-lit-extended.svg)](https://badge.fury.io/js/%40moleculejs%2Fmolecule-lit-extended) [![Build Status](https://travis-ci.org/Molecule-JS/MoleculeJS.svg?branch=master)](https://travis-ci.org/Molecule-JS/MoleculeJS) [![Greenkeeper badge](https://badges.greenkeeper.io/Molecule-JS/MoleculeJS.svg)](https://greenkeeper.io/)

## Overview

Molecule is a JavaScript library for building user interfaces using web components.

This package provides a base class for creating Custom Elements that renders using [lit-html's](https://github.com/Polymer/lit-html) lit-extended template engine.

## Installation

The `@moleculejs/molecule-lit-extended` package can be installed using npm or yarn:

```
npm install --save @moleculejs/molecule-lit-extended
```

```
yarn add @moleculejs/molecule-lit-extended
```

## Documentation

See the full documentation at [MoleculeJS.org](https://moleculejs.org).

## Examples

Let's start with a simple Example:

```js
class HelloWorld extends MoleculeLitExtended.Element {
  static get properties() {
    return {
      name: String,
      attribute: true,
      value: 'John Doe',
    };
  }
  render({ name }) {
    html`
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
