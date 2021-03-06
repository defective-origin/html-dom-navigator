# html-dom-navigator
[![Build Status](https://travis-ci.org/defective-origin/html-dom-navigator.svg?branch=main)](https://travis-ci.org/defective-origin/html-dom-navigator)
[![Coverage Status](https://coveralls.io/repos/github/defective-origin/html-dom-navigator/badge.svg?branch=main)](https://coveralls.io/github/defective-origin/html-dom-navigator?branch=main)

The Navigator allows you to navigate with keyboard arrows and mouse click by the html navigation elements which have data-nav attribute.
You can see an interactive example [here](https://defective-origin.github.io/html-dom-navigator/).

## Install
```shell
npm install html-dom-navigator
```

## How to use

Example:
```ts
import Navigator from "html-dom-navigator";

const html = document.createElement('div')
html.innerHTML = `
  <div id="nav-panel" data-nav="row">
    <div data-nav="column">
      <div data-nav="item" data-nav-label="it will be activated by default">column-1</div>
      <div data-nav="item">column-2</div>
    </div>
    <div data-nav="row">
      <div id="uuid" data-nav="item" data-nav-label="test-label">row-1</div>
      <div data-nav="item" data-nav-uuid="test-uuid">row-2</div>
      </div>
  </div>
`

const navPanel = document.getElementById('nav-panel') as HTMLElement
const navigator = new Navigator()

navigator.subscribe(navPanel)
```


## Navigation tree handle next events:
- Changing DOM in order to rebuild navigation tree.
- Keyboard arrows, tab keypress in order to activate next navigation node.
- Clicking on navigation node with attribute data-nav="item" to activate navigation node.

After changing DOM, Navigation tree rebuild and activate previous active navigation node otherwise it activates first navigation node which was found.

## If you want to navigate manually, you can use one of the possible ways:
1) __Navigate by UUID__. You just need to get it from html element. UUID generates on each node automatically. Don't set uuid manually. This may affect the correct operation.

Example:
```ts
const elemWithUUID = document.getElementById('uuid') as HTMLElement
const uuid = elemWithUUID.dataset.navUuid

navigator.activateNavNodeByUuid(uuid)
```


2) __Navigate by Label__. You can set a label via data-nav-label attribute.

Example:
```ts
navigator.activateNavNodeByLabel('test-label')
```


___If you activate block navigation node, then first navigation child with attribute data-nav="item" will be activated.___

## You can also deactivate current active node.

Example:
```ts
navigator.deactivateNavNode()
```


## Remember to unsubscribe from the navigator before deleting the item to prevent memory leaks.

Example:
```ts
navigator.unsubscribe()
```

## Attributes
The following attributes can be set on the navigation node:
- data-nav: __"row" | "column" | "item"__ - ___set by user___

  __"row" and "column"__ is block type. Elements with this type can contain other navigation items.

  __"item"__ is element that can be activated. It cannot contain other navigation elements.
  ```html
  <div data-nav="row">
    <div data-nav="item">1<div>
    <div data-nav="item">2<div>
    <div data-nav="item">3<div>
  <div>

  <div data-nav="column">
    <div data-nav="item">1<div>
    <div data-nav="item">2<div>
    <div data-nav="item">3<div>
  <div>
  ```


- data-label: __string__ - ___set by user___

  __Label__ can be set on any navigation element.
   ```html
  <div data-nav="row" data-nav-label="nav-block">
    <div data-nav="item" data-nav-label="home">home<div>
  <div>
  ```


- data-uuid: __string__ - ___set automatically___

  __UUID__ generates on each node automatically and has view template 8-4-4-4-12.
   ```html
  <div data-nav="row" data-nav-uuid="9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d">
    <div data-nav="item" data-nav-uuid="1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed">home<div>
  <div>
  ```


- data-active-nav-item: __"true" | nothing__ - ___set automatically if element is active___

  This attribute set only on active element.
   ```html
   <!-- active   -->
  <div data-nav="item" data-active-nav-item="true">home<div>

   <!-- not active   -->
  <div data-nav="item">home<div>
  ```


- data-nav-focus: __string__ - ___set by user___

  This attribute set only on item navigation element.
  You can use any selector as for __Document.querySelector()__ method.
  In most cases it needs for custom inputs.
   ```html
  <div data-nav="item" data-nav-focus="#input">
    <input id="input" type="text" placeholder="enter text" />
  </div>
  ```
