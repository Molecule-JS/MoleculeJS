[![Codacy Badge](https://api.codacy.com/project/badge/Grade/f28f115aeadf4538ac046a8885c6e7c5)](https://app.codacy.com/app/DerDrodt/MoleculeJS?utm_source=github.com&utm_medium=referral&utm_content=Molecule-JS/MoleculeJS&utm_campaign=Badge_Grade_Dashboard)
# Molecule &middot; [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/Molecule-JS/MoleculeJS/blob/master/LICENSE) [![codecov](https://codecov.io/gh/Molecule-JS/MoleculeJS/branch/master/graph/badge.svg)](https://codecov.io/gh/Molecule-JS/MoleculeJS) [![npm version](https://badge.fury.io/js/%40moleculejs%2Fmolecule.svg)](https://badge.fury.io/js/%40moleculejs%2Fmolecule) [![Build Status](https://travis-ci.org/Molecule-JS/MoleculeJS.svg?branch=master)](https://travis-ci.org/Molecule-JS/MoleculeJS) [![Greenkeeper badge](https://badges.greenkeeper.io/Molecule-JS/MoleculeJS.svg)](https://greenkeeper.io/)

## Overview

Molecule is a JavaScript library for building user interfaces using web components.

It provides several classes from which you can build your Custom Elements

- The Molecule base class. It is agnostic about your actual templatization and rendering function.
- MoleculeLit class which uses the standard functions from [lit-html](https://github.com/PolymerLabs/lit-html) by the Polymer team.
- MoleculeLitExtended uses the extended rendering functions of `lit-html`.

## Installation

The `@moleculejs/molecule` package can be installed using npm or yarn:

```bash
npm install --save @moleculejs/molecule
```

```bash
yarn add @moleculejs/molecule
```

## Documentation

See the full documentation at [MoleculeJS.org](https://moleculejs.org).

## Examples

Let's start with a simple Example:

```js
class HelloWorld extends MoleculeLit.Element {
  static get properties() {
    return {
      name: { type: String, attribute: true, value: 'John Doe' },
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

## Contributing

Coming soon!
