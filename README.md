# Molecule &middot; [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/Molecule-JS/molecule/blob/master/LICENSE) [![Build Status](https://travis-ci.org/Molecule-JS/molecule.svg?branch=master)](https://travis-ci.org/Molecule-JS/molecule) [![npm version](https://badge.fury.io/js/%40moleculejs%2Fmolecule.svg)](https://badge.fury.io/js/%40moleculejs%2Fmolecule) [![Greenkeeper badge](https://badges.greenkeeper.io/Molecule-JS/molecule.svg)](https://greenkeeper.io/)

## Overview
Molecule is a JavaScript library for building user interfaces using web components.

It provides several classes from which you can build your Custom Elements
- The Molecule base class. It is agnositic about your actual templatization and rendering function.
- MoleculeLit class which uses the standard functions from [lit-html](https://github.com/PolymerLabs/lit-html) by the Polymer team.
- MoleculeLitExtended uses the extended rendering functions of `lit-html`.

## Installation
The `@moleculejs/molecule` package can be installes using npm or yarn:

```
npm install --save @moleculejs/molecule
```

```
yarn add @moleculejs/molecule
```

## Documentation
More detailed documentation coming soon!

## Examples
Let's start with an simple Example:
```js
import { MoleculeLit, html } from '../node_modules/@moleculejs/molecule/molecule-lit.js';

class HelloWorld extends MoleculeLit {
    static get properties() {
        return {
            name: String,
            reflectToAttribute: true,
            value: 'John Doe'
        }
    }
    render({ name }) {
        html`
            <div>Hello ${name}</div>
        `
    }
}

customElements.define('hello-world', HelloWorld);

```

This creates a new Custom Element called `hello-world`, which can now be used anywhere in your application using `<hello-world>`.

This new element will also keep the *property* `name` in sync with the *attribute* `name`, meaning that the element will look like this in the DOM:
```html
<hello-world name="John Doe"></hello-world>
```
If you change the attribute or the property, both will be kept in sync and the element will be rerendered.

## Contributing
Coming soon!