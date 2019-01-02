# MoleculeJsx

<p align="center"><a href="https://moleculejs.org" target="_blank" rel="noopener noreferrer"><img width="100" src="https://moleculejs.org/molecules.svg" alt="Molecule logo"></a></p>

<p align="center">
  <a href="https://travis-ci.org/Molecule-JS/MoleculeJS"><img src="https://travis-ci.org/Molecule-JS/MoleculeJS.svg?branch=master" alt="Build Status"></a>
  <a href="https://codecov.io/gh/Molecule-JS/MoleculeJS">
    <img src="https://codecov.io/gh/Molecule-JS/MoleculeJS/branch/master/graph/badge.svg" alt="Coverage">
  </a>
  <a href="https://www.npmjs.com/package/@moleculejs/molecule-jsx"><img src="https://badge.fury.io/js/%40moleculejs%2Fmolecule-jsx.svg" alt="Version"></a>
  <a href="https://github.com/Molecule-JS/MoleculeJS/blob/master/LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License"></a>
  <a href="https://greenkeeper.io/"><img src="https://badges.greenkeeper.io/Molecule-JS/MoleculeJS.svg" alt="Greenkeeper badge"></a>
</p>

## Overview

Molecule is a JavaScript library for building user interfaces using web components.

This package provides a base class for creating Custom Elements that renders JSX.

## Installation

The `@moleculejs/molecule-jsx` package can be installed using npm or yarn:

```bash
npm install --save @moleculejs/molecule-jsx
```

```bash
yarn add @moleculejs/molecule-jsx
```

## Documentation

See the full documentation at [MoleculeJS.org](https://moleculejs.org).

## Examples

Let's start with a simple Example:

```jsx
class HelloWorld extends MoleculeJsx.Element {
  static get properties() {
    return {
      name: String,
      attribute: true,
      value: 'John Doe',
    };
  }
  render({ name }) {
    <div>Hello ${name}</div>;
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
