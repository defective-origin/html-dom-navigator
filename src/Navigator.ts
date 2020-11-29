import NavTree from './NavTree'
import NavTreeHtmlObserver from './observers/NavTreeHtmlObserver'
import NavTreeClickObserver from './observers/NavTreeClickObserver'
import NavTreeKeyPressObserver from './observers/NavTreeKeyPressObserver'

export default class Navigator {
  public navTree: NavTree | null = null
  public navTreeHtmlObserver = new NavTreeHtmlObserver()
  public navTreeClickObserver = new NavTreeClickObserver()
  public navTreeKeyPressObserver = new NavTreeKeyPressObserver()

  public observe(elem: HTMLElement): void {
    if (!elem.isEqualNode(this.navTree && this.navTree.elem)) {
      this.navTree = new NavTree(elem)
      this.navTreeHtmlObserver.watch(this.navTree)
      this.navTreeClickObserver.watch(this.navTree)
      this.navTreeKeyPressObserver.watch(this.navTree)
    }
  }

  public activateNavItem(label: string): void {
    this.navTree?.activateNode(label)
  }

  public deactivateNavItem(): void {
    this.navTree?.deactivateNode()
  }
}

// TODO: implement without building tree, just set data attributes and test speed
