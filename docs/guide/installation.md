# Installation

### Release Notes

Latest stable version: {{ $site.themeConfig.version }}

## Include via script tag

You can inlude Molecule packages via a CDN like [unpkg](https://unpkg.com), which will create the global `Molecule`, or rather the name of the package in PascalCase:

```html
<script src="https://unpkg.com/@moleculejs/molecule"></script>
<!-- Or one of the other packages: -->
<script src="https://unpkg.com/@moleculejs/molecule-lit"></script>
```

## NPM and Yarn

We recommend installation with either NPM or Yarn:

```bash
npm i @moleculejs/molecule
```

```bash
yarn add @moleculejs/molecule
```
