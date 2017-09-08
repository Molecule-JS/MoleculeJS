# lit-element
Implements [lit-html](https://github.com/PolymerLabs/lit-html) via a LitElement class. Made for custom Elements.

## Default Usage

```javascript
// import html from lit-html
import {html} from '../node-modules/lit-html/lit-html.js'

// import lit-element
import {LitElement} from './lit-element.js'

// define Custom Element
class MyElement extends LitElement(HTMLElement) {

    // define properties similiar to Polymer 2/3
    static get properties() {
        return {
            title: String,
            body: {
                type: String,
                value: 'That is a cool LitElement'
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

    // If you want work done after the first render, like accessing elements with ids, do it here
    afterFirstRender() {
        
        // access the element with id 'title'
        this.$.title.classList.add('title--main')
    }
}
```

## Notes

 - This Element does not use Polymer, just Polymer-like syntax for properties.
 - Currently only `reflectToAttribute` and `value` are supported for properties.