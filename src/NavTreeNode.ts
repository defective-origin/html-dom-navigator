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

  /** Return type of element. */
  public get type(): string | null {
    return this.elem.dataset[NavNodeDataAttrs.NavType] || null
  }

  /** Return uuid of element. */
  public get uuid(): string {
    return this.elem.dataset[NavNodeDataAttrs.NavUuid] as string
  }

  /** Return user label of element if it exists otherwise null. */
  public get label(): string | null {
    return this.elem.dataset[NavNodeDataAttrs.NavLabel] || null
  }

  /** Return true if node is active otherwise false. */
  public get isActive(): boolean {
    return Boolean(this.elem.dataset[NavNodeDataAttrs.ActiveNavItem])
  }

  /** Return true if node has the same type otherwise false. */
  public hasType(type: NavNodeTypes): boolean {
    return this.type === type
  }

  /** Return child node by index if it exist otherwise null. */
  public getChildNode(index: number): NavTreeNode | null {
    return this.children[index] || null
  }

  /** Return first child node if it exists otherwise null. */
  public getFirstChildNode(): NavTreeNode | null {
    return this.getChildNode(0)
  }

  /** Return true if element has data-nav attribute otherwise false. */
  public static hasNavTypeAttribute(elem: HTMLElement): boolean {
    return Boolean(elem.dataset[NavNodeDataAttrs.NavType])
  }

  /** Activate node if it is not active. */
  public activate(): void {
    if (!this.isActive && this.type === NavNodeTypes.Item) {
      this.elem.dataset[NavNodeDataAttrs.ActiveNavItem] = 'true'
      this.elem.focus()
      this.elem.scrollIntoView({ block: 'center', inline: 'center', behavior: 'smooth' }) // scroll to a focused element when we have a scroll
    }
  }

  /** Deactivate node if it is active. */
  public deactivate(): void {
    if (this.isActive) {
      this.elem.blur()
      delete this.elem.dataset[NavNodeDataAttrs.ActiveNavItem]
    }
  }
}
