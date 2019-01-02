# MoleculeRouter

<p align="center"><a href="https://moleculejs.org" target="_blank" rel="noopener noreferrer"><img width="100" src="https://moleculejs.org/molecules.svg" alt="Molecule logo"></a></p>

<p align="center">
  <a href="https://travis-ci.org/Molecule-JS/MoleculeJS"><img src="https://travis-ci.org/Molecule-JS/MoleculeJS.svg?branch=master" alt="Build Status"></a>
  <a href="https://codecov.io/gh/Molecule-JS/MoleculeJS">
    <img src="https://codecov.io/gh/Molecule-JS/MoleculeJS/branch/master/graph/badge.svg" alt="Coverage">
  </a>
  <a href="https://www.npmjs.com/package/@moleculejs/molecule-router"><img src="https://badge.fury.io/js/%40moleculejs%2Fmolecule-router.svg" alt="Version"></a>
  <a href="https://github.com/Molecule-JS/MoleculeJS/blob/master/LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License"></a>
  <a href="https://greenkeeper.io/"><img src="https://badges.greenkeeper.io/Molecule-JS/MoleculeJS.svg" alt="Greenkeeper badge"></a>
</p>

## Overview

MoleculeRouter allows for easily creating Single Page Applications (SPAs) with Web Components. It is currently still experimental.

## Installation

The `@moleculejs/molecule-router` package can be installed using npm or yarn:

```bash
npm install --save @moleculejs/molecule-router
```

```bash
yarn add @moleculejs/molecule-router
```

## Documentation

See the full documentation at [MoleculeJS.org](https://moleculejs.org).

## Examples

To use MoleculeRouter we have to create one, ideally at your app's root:

```jsx
import { Router } from '@moleculejs/molecule-router';

class MyApp extends MoleculeJsx.Element {
  // ...

  connected() {
    this.router = new Router(this);
  }

  // ...
}
```

Next we add some Links and Routes for basic matching:

```jsx
import { Router, Link, Route } from '@moleculejs/molecule-router';

import { Home, About, Topics } from './my-views';

class MyApp extends MoleculeJsx.Element {
  // ...

  connected() {
    this.router = new Router(this);
  }

  render() {
    return (
      <div>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
          <li>
            <Link to="/topics">Topics</Link>
          </li>
        </ul>

        <hr />

        <Route exact path="/" element={Home} />
        <Route path="/about" element={About} />
        <Route path="/topics" element={Topics} />
      </div>
    );
  }
}
```

## Contributing

Coming soon!
