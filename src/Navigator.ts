import NavTree from './NavTree'
import NavTreeHtmlObserver from './observers/NavTreeHtmlObserver'
import NavTreeClickObserver from './observers/NavTreeClickObserver'
import NavTreeKeyPressObserver from './observers/NavTreeKeyPressObserver'

export default class Navigator {
  public navTree: NavTree = new NavTree()
  public navTreeHtmlObserver = new NavTreeHtmlObserver()
  public navTreeClickObserver = new NavTreeClickObserver()
  public navTreeKeyPressObserver = new NavTreeKeyPressObserver()

  public subscribe(elem: HTMLElement): void {
    if (!elem.isEqualNode(this.navTree.elem)) {
      this.navTree.build(elem)
      this.navTreeHtmlObserver.subscribe(this.navTree)
      this.navTreeClickObserver.subscribe(this.navTree)
      this.navTreeKeyPressObserver.subscribe(this.navTree)
    }
  }

  public activateNavNodeByLabel(key: string): void {
    this.navTree.activateNodeByLabel(key)
  }

  public activateNavNodeByUuid(key: string): void {
    this.navTree.activateNodeByUuid(key)
  }

  public deactivateNavNode(): void {
    this.navTree.deactivateNode()
  }

  public unsubscribe(): void {
    this.navTree.clear()
    this.navTreeHtmlObserver.unsubscribe()
    this.navTreeClickObserver.unsubscribe()
    this.navTreeKeyPressObserver.unsubscribe()
  }
}
