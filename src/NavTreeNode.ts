import { v4 as uuidv4 } from 'uuid'

export enum NavNodeTypes {
  Row = 'row',
  Column = 'column',
  Item = 'item',
}

export enum NavNodeDataAttrs {
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

    if (this.hasType(NavNodeTypes.Item)) {
      this.elem.tabIndex = -1 // in order to navigate programmatically and elem.focus() works
    }

    if (!this.elem.dataset[NavNodeDataAttrs.NavUuid]) {
      this.elem.dataset[NavNodeDataAttrs.NavUuid] = uuidv4()
    }
  }

  public get type(): string | null {
    return this.elem.dataset[NavNodeDataAttrs.NavType] || null
  }

  public get uuid(): string {
    return this.elem.dataset[NavNodeDataAttrs.NavUuid] as string
  }

  public get label(): string | null {
    return this.elem.dataset[NavNodeDataAttrs.NavLabel] || null
  }

  public get isActive(): boolean {
    return Boolean(this.elem.dataset[NavNodeDataAttrs.ActiveNavItem])
  }

  public hasType(type: NavNodeTypes): boolean {
    return this.type === type
  }

  public getChildNode(index: number): NavTreeNode | null {
    return this.children[index] || null
  }

  public getFirstChildNode(): NavTreeNode | null {
    return this.getChildNode(0)
  }

  public static hasNavTypeAttribute(elem: HTMLElement): boolean {
    return Boolean(elem.dataset[NavNodeDataAttrs.NavType])
  }

  public activate(): void {
    if (!this.isActive && this.type === NavNodeTypes.Item) {
      this.elem.dataset[NavNodeDataAttrs.ActiveNavItem] = 'true'
      this.elem.focus()
      this.elem.scrollIntoView({ block: 'center', inline: 'center', behavior: 'smooth' }) // scroll to a focused element when we have a scroll
    }
  }

  public deactivate(): void {
    if (this.isActive) {
      this.elem.blur()
      delete this.elem.dataset[NavNodeDataAttrs.ActiveNavItem]
    }
  }
}
