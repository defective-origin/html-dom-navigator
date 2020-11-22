export enum NavItemTypes {
  Row = 'row',
  Column = 'column',
  Item = 'item',
}

export enum NavItemDataAttrs {
  NavType = 'nav',
  NavLabel = 'navLabel',
  ActiveNavItem = 'activeNavItem',
}

export enum Offset {
  Next = 1,
  Prev = -1,
}

export default class NavTreeNode {
  private children: NavTreeNode[] = []

  constructor(
    public elem: HTMLElement,
    public parent: NavTreeNode | null = null,
    public layer: number = 0,
    public index: number = 0,
  ) {
    if (parent) {
      this.index = parent.children.length
      this.layer = parent.layer + Offset.Next || layer
      parent.children.push(parent)
    }

    this.elem.tabIndex = -1 // in order to navigate programmatically and elem.focus() works
    this.elem.dataset[NavItemDataAttrs.NavLabel] = `layer: ${this.layer} Index: ${this.index}`
  }

  public get type(): string {
    return this.elem.dataset[NavItemDataAttrs.NavType] as string
  }

  public get label(): string {
    return this.elem.dataset[NavItemDataAttrs.NavLabel] as string
  }

  public get isActive(): boolean {
    return Boolean(this.elem.dataset[NavItemDataAttrs.ActiveNavItem])
  }

  public hasType(type: NavItemTypes): boolean {
    return this.type === type
  }

  public getChildNode(index: number): NavTreeNode | null {
    return this.children[index] || null
  }

  public getFirstChildNode(): NavTreeNode | null {
    return this.getChildNode(0)
  }

  public static hasNavTypeAttribute(elem: HTMLElement): boolean {
    return Boolean(elem.dataset[NavItemDataAttrs.NavType])
  }

  public activate(): void {
    if (!this.isActive && this.type === NavItemTypes.Item) {
      this.elem.dataset[NavItemDataAttrs.ActiveNavItem] = 'true'
      this.elem.focus()
      this.elem.scrollIntoView({ block: 'center', inline: 'center', behavior: 'smooth' }) // scroll to a focused element when we have a scroll
    }
  }

  public deactivate(): void {
    if (this.isActive) {
      this.elem.blur()
      delete this.elem.dataset[NavItemDataAttrs.ActiveNavItem]
    }
  }
}
