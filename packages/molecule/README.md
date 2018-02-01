# lit-element
Implements [lit-html](https://github.com/PolymerLabs/lit-html) via a LitElement class. Made for custom Elements.

[![Build Status](https://travis-ci.org/DiiLord/lit-element.svg?branch=master)](https://travis-ci.org/DiiLord/lit-element)

## New in 0.4.0
- We now allow you to switch out the standard lit-html `render` and `html` functions
- You can now use `lit-html-extended` via `lit-element-extended.js`
- Added `notify` option for properties, which will fire an event, if the value changes
- A lot of bug fixes

## New in 0.3.0
- You can now set any property of your element to a promise and LitElement will set the property to the resolved value of the promise. (credit: [depeele](https://github.com/depeele))
- Attributes of properties with `reflectToAttribute: true` are now transformed to kebab-case. (credit: [depeele](https://github.com/depeele))
- Codebase moved to TypeScript.

## Installation

You can get it through npm or yarn

```
npm install lit-element
```
```
yarn add lit-element
```

## Default Usage

```javascript
// import lit-element
import {LitElement, html} from '../node_modules/lit-element/lit-element.js'

// define Custom Element
class MyElement extends LitElement(HTMLElement) {

    // define properties similiar to Polymer 2/3
    static get properties() {
        return {
            title: String,
            body: {
                type: String,
                value: 'That is a cool LitElement',
                observer: '_bodyChanged',
                reflectToAttribute: true,
                notify: true
            }
        }
    }
    
    // define your template in render
    render() {
        this.title = 'This is lit';
        return html`
            <h1 id="title">${this.title}</h1>
            <p>${this.body}</h1>
        `;
    }

    // observer callback
    _bodyChanged(newValue) {
        console.log(`Body updated to ${newValue}`);
    }

    // If you want work done after the first render, like accessing elements with ids, do it here
    afterRender(isFirstRender) {
        if(isFirstRender) {
            // access the element with id 'title'
            this.$.title.classList.add('title--main');
            this.addEventListener('body-changed', e => {
                const body = e.detail;
                ...
            })
        }
    }
}
```

## Declaring properties
Properties of your element are set through a static getter of `properties`, as seen above.

Properties can be set with the following options:
- type: The type function of this property. Must be set!
- reflectToAttribute: Keeps the property in sync with the attribute of the same name, konverted to kebab-case (myProp <-> my-prop)
- value: The initial value of the property. If it should be an array or an object, set value to a function returning that object, to keep it unique for each instance of the element
- observer: The name of the method that should be called whenever the property changes.
- notify: Dispatch an event on property-change. The event name follows the pattern `my-prop-changed`. The new value is in `event.detail`.


## Notes

 - This Element does not use Polymer, just Polymer-like syntax for properties.
 - Currently only `type`, `reflectToAttribute`, `observer`, `value` and `notify` are supported for properties.