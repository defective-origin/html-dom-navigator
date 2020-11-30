import { v4 as uuidv4 } from 'uuid'

export enum NavItemTypes {
  Row = 'row',
  Column = 'column',
  Item = 'item',
}

export enum NavItemDataAttrs {
  NavType = 'nav',
  NavLabel = 'navLabel',
  NavUuid = 'navUuid',
  ActiveNavItem = 'activeNavItem',
}

export enum Offset {
  Next = 1,
  Prev = -1,
}

export default class NavTreeNode {
  private children: NavTreeNode[] = []
  public index = 0

  constructor(
    public elem: HTMLElement,
    public parent: NavTreeNode | null = null,
  ) {
    if (parent) {
      this.index = parent.children.length
      parent.children.push(this)
    }

    if (this.hasType(NavItemTypes.Item)) {
      this.elem.tabIndex = -1 // in order to navigate programmatically and elem.focus() works
    }

    if (!this.elem.dataset[NavItemDataAttrs.NavUuid]) {
      this.elem.dataset[NavItemDataAttrs.NavUuid] = uuidv4()
    }
  }

  public get type(): string | null {
    return this.elem.dataset[NavItemDataAttrs.NavType] || null
  }

  public get uuid(): string {
    return this.elem.dataset[NavItemDataAttrs.NavUuid] as string
  }

  public get label(): string | null {
    return this.elem.dataset[NavItemDataAttrs.NavLabel] || null
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
