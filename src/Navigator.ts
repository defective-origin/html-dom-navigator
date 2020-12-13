import NavTree from './NavTree'
import NavTreeHtmlObserver from './observers/NavTreeHtmlObserver'
import NavTreeClickObserver from './observers/NavTreeClickObserver'
import NavTreeKeyPressObserver from './observers/NavTreeKeyPressObserver'

/**
 * The Navigator allows you to navigate the html navigation elements which have data-nav attribute.
 *
 * Example:
 * ```ts
 *  const html = document.createElement('div')
 *  html.innerHTML = `
 *    <div class="nav-panel" data-nav="row">
 *      <div data-nav="column">
 *        <div data-nav="item" data-nav-label="it will be activated by default">column-1</div>
 *        <div data-nav="item">column-2</div>
 *      </div>
 *      <div data-nav="row">
 *        <div class="uuid" data-nav="item" data-nav-label="test-label">row-1</div>
 *        <div data-nav="item" data-nav-uuid="test-uuid">row-2</div>
 *        </div>
 *    </div>
 *  `
 *
 *  const navPanel = html.getElementsByClassName('nav-panel')[0] as HTMLElement
 *  const navigator = new Navigator()
 *
 *  navigator.subscribe(navPanel)
 * ```
 *
 *
 * Navigation tree handle next events:
 * - Changing DOM in order to rebuild navigation tree.
 * - Keyboard arrows keypress in order to activate next navigation node.
 * - Clicking on navigation node with attribute data-nav="item" to activate navigation node.
 *
 * After changing DOM, Navigation tree rebuild and activate previous active nav node
 * otherwise it activates first navigation node which was found.
 *
 * If you want to navigate manually, you can use one of the possible ways:
 * 1) Navigate by UUID. You just need to get it from html element.
 *    UUID generates on each node automatically.
 *    Don't set uuid manually. This may affect the correct operation.
 *
 *    Example:
 *    ```ts
 *      const elemWithUUID = html.getElementsByClassName('uuid')[0] as HTMLElement
 *      const uuid = elemWithUUID.dataset.navUuid
 *
 *      navigator.activateNavNodeByUuid(uuid)
 *    ```
 *
 *
 * 2) Navigate by Label. You can set a label via data-nav-label attribute.
 *
 *    Example:
 *    ```ts
 *      navigator.activateNavNodeByLabel('test-label')
 *    ```
 *
 *
 * You also can deactivate current active node.
 *
 * Example:
 * ```ts
 *  navigator.deactivateNavNode()
 * ```
 *
 *
 * Remember to unsubscribe from the navigator before deleting the item to prevent memory leaks.
 *
 * Example:
 * ```ts
 *  navigator.unsubscribe()
 * ```
 *
 * Navigation attributes:
 * - data-nav: "row" | "column" | "item" - set by user
 * - data-label: string - set by user
 * - data-uuid: string - set automatically
 * - data-active-nav-item: "true" | nothing - set automatically if item is active
 */
export default class Navigator {
  public navTree: NavTree = new NavTree()
  public navTreeHtmlObserver = new NavTreeHtmlObserver()
  public navTreeClickObserver = new NavTreeClickObserver()
  public navTreeKeyPressObserver = new NavTreeKeyPressObserver()

  /**
   * Build navigation tree and subscribe on event observers.
   * @param elem Should have data-nav attribute as row or column.
   */
  public subscribe(elem: HTMLElement): void {
    if (!elem.isEqualNode(this.navTree.elem)) {
      this.unsubscribe()
      this.navTree.build(elem)
      this.navTreeHtmlObserver.subscribe(this.navTree)
      this.navTreeClickObserver.subscribe(this.navTree)
      this.navTreeKeyPressObserver.subscribe(this.navTree)
    }
  }

  /**
   * Activate navigation node by label.
   * Label is set by user.
   */
  public activateNavNodeByLabel(key: string): void {
    this.navTree.activateNodeByLabel(key)
  }

  /**
   * Activate navigation node by UUID.
   * UUID generates on each node automatically.
   */
  public activateNavNodeByUuid(key: string): void {
    this.navTree.activateNodeByUuid(key)
  }

  /** Deactivate current active navigation node. */
  public deactivateNavNode(): void {
    this.navTree.deactivateNode()
  }

  /** Unsubscribe from all observers and remove built navigation tree. */
  public unsubscribe(): void {
    this.navTree.clear()
    this.navTreeHtmlObserver.unsubscribe()
    this.navTreeClickObserver.unsubscribe()
    this.navTreeKeyPressObserver.unsubscribe()
  }
}
