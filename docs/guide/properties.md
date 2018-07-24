## Properties
Pretty much all Custom Elements are dynamic and therefore have **properties**. In Molecule, these properties are key. They allow you to update your view on changes, keep your view and attributes in sync and react to changes of your element dynamically. To use properties in Molecule, properties must be declared statically:
```js
class MyMolecule extends MoleculeLit.Element {
  static get properties() {
    return {
      myProp1: {
        value: 34,
        event: 'my-prop-updated'
      },
      myProp2: {
        attribute: 'my-attr',
        type: String,
        value: 'Dave'
      },
      // ...
    }
  }
}
```
There is also the short form for declaring properties:
```js
class MyMolecule extends MoleculeLit.Element {
  static get properties() {
    return {
      myProp: 3
    }
  }
}
```
Which is equivalent to: 
```js
class MyMolecule extends MoleculeLit.Element {
  static get properties() {
    return {
      myProp: {
        value: 3
      }
    }
  }
}
```
For each property you declare, you can specify a variety of options:
### value
- Type: `any`
- Default: `undefined`

The default value of the property. If you want a default value that is not a primitive value, use a function that returns your default value. This is to ensure that these values are unique to every element.
### attributes
- Type: `boolean|string`
- Default: `false`

If this is `true`, this property will be kept in sync with the attribute of the same name, but converted to kebab-case. If this is a string, this will be the name of the synced attribute.

**Requires the `type` option**
### type
- Type: `(val: any) => any`
- Default: `undefined`

If the prop reflects an attribute this function is used to convert the attribute to the property.
### event
- Type: `boolean|string`
- Default: `undefined`

Wether an event should be dispatched when the property changes. The event name follows the same system as for `attribute`.
### observer
- Type: `string`
- Default: `undefined`

The name of the function to call, when the property changes. The method must exist on the element and gets passed the parameters `(newValue, oldValue)`.
## Reactivity
All declared properties are *reactive*, which means that changes to these properties will queue a rerender and if necessary update atributes, dispatch events and call methods.

