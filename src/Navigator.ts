import NavTree from './NavTree'
import NavTreeHtmlObserver from './observers/NavTreeHtmlObserver'
import NavTreeClickObserver from './observers/NavTreeClickObserver'
import NavTreeKeyPressObserver from './observers/NavTreeKeyPressObserver'

export default class Navigator {
  public navTree: NavTree | null = null
  public navTreeHtmlObserver = new NavTreeHtmlObserver()
  public navTreeClickObserver = new NavTreeClickObserver()
  public navTreeKeyPressObserver = new NavTreeKeyPressObserver()

  public subscribe(elem: HTMLElement): void {
    if (!elem.isEqualNode(this.navTree && this.navTree.elem)) {
      this.navTree = new NavTree(elem)
      this.navTreeHtmlObserver.subscribe(this.navTree)
      this.navTreeClickObserver.subscribe(this.navTree)
      this.navTreeKeyPressObserver.subscribe(this.navTree)
    }
  }

  public activateNavItemByLabel(key: string): void {
    this.navTree?.activateNodeByLabel(key)
  }

  public activateNavItemByUuid(key: string): void {
    this.navTree?.activateNodeByUuid(key)
  }

  public deactivateNavItem(): void {
    this.navTree?.deactivateNode()
  }

  public unsubscribe(): void {
    this.navTreeHtmlObserver.unsubscribe()
    this.navTreeClickObserver.unsubscribe()
    this.navTreeKeyPressObserver.unsubscribe()
  }
}
