# html-dom-navigator
The Navigator allows you to navigate the html navigation elements which have data-nav attribute.

## Install
```shell
npm install html-dom-navigator
```

## How to use

Example:
```ts
const html = document.createElement('div')
html.innerHTML = `
  <div class="nav-panel" data-nav="row">
    <div data-nav="column">
      <div data-nav="item" data-nav-label="it will be activated by default">column-1</div>
      <div data-nav="item">column-2</div>
    </div>
    <div data-nav="row">
      <div class="uuid" data-nav="item" data-nav-label="test-label">row-1</div>
      <div data-nav="item" data-nav-uuid="test-uuid">row-2</div>
      </div>
  </div>
`

const navPanel = html.getElementsByClassName('nav-panel')[0] as HTMLElement
const navigator = new Navigator()

navigator.subscribe(navPanel)
```


## Navigation tree handle next events:
- Changing DOM in order to rebuild navigation tree.
- Keyboard arrows keypress in order to activate next navigation node.
- Clicking on navigation node with attribute data-nav="item" to activate navigation node.

After changing DOM, Navigation tree rebuild and activate previous active navigation node otherwise it activates first navigation node which was found.

## If you want to navigate manually, you can use one of the possible ways:
1) __Navigate by UUID__. You just need to get it from html element. UUID generates on each node automatically. Don't set uuid manually. This may affect the correct operation.

Example:
```ts
const elemWithUUID = html.getElementsByClassName('uuid')[0] as HTMLElement
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
