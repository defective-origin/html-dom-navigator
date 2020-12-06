import NavTreeNode, { NavNodeTypes, Offset } from './NavTreeNode'
import { INavTreeKeyPressObservable } from './observers/NavTreeKeyPressObserver'
import { INavTreeHtmlObservable } from './observers/NavTreeHtmlObserver'
import { INavTreeClickObservable } from './observers/NavTreeClickObserver'

export default class NavTree implements INavTreeHtmlObservable,
                                        INavTreeKeyPressObservable,
                                        INavTreeClickObservable {
  public elem: HTMLElement | null = null
  public nodeMapByUuid: Record<string, NavTreeNode> = {}
  public nodeMapByLabel: Record<string, NavTreeNode> = {}
  public activeNode: NavTreeNode | null = null

  // TODO: rewrite with returning root node
  /**
   * Parse html and build navigation tree. */
  public parseHtml(elem: HTMLElement, parent: NavTreeNode): void {
    for (let index = 0; index < elem.children.length; index += 1) {

      const childElem = elem.children[index] as HTMLElement
      if (NavTreeNode.hasNavTypeAttribute(childElem)) {
        const childNode = new NavTreeNode(childElem, parent)
        this.registerNode(childNode)

        if (childNode.type !== NavNodeTypes.Item) {
          this.parseHtml(childElem, childNode)
        }
      } else {
        this.parseHtml(childElem, parent)
      }
    }
  }

  /** Register node to uuid and label node maps. */
  public registerNode(node: NavTreeNode): void {
    this.nodeMapByUuid[node.uuid] = node

    if (node.label) {
      this.nodeMapByLabel[node.label] = node
    }
  }

  public build(elem: HTMLElement | null = null): void {
    if (!elem || !NavTreeNode.hasNavTypeAttribute(elem)) {
      return
    }

    const prevActiveNavItemUuid = this.activeNode?.uuid as string
    const rootNode = new NavTreeNode(elem)

    this.clear()

    this.elem = elem

    this.parseHtml(elem, rootNode)

    if (this.nodeMapByUuid[prevActiveNavItemUuid]) {
      this.activateNodeByUuid(prevActiveNavItemUuid)
    } else {
      this.activateNode(rootNode)
    }
  }

  /** Deactivate active node and clear navigation tree. */
  public clear(): void {
    this.elem = null
    this.nodeMapByUuid = {}
    this.nodeMapByLabel = {}
    this.deactivateNode()
  }

  /**
   * Activate navigation node by label if only node navigation type is item
   * otherwise activate first child node.
   */
  public activateNodeByLabel(key: string): void {
    const node = this.nodeMapByLabel[key]
    this.activateNode(node)
  }

  /**
   * Activate navigation node by UUID if only node navigation type is item
   * otherwise activate first child node.
   */
  public activateNodeByUuid(key: string): void {
    const node = this.nodeMapByUuid[key]
    this.activateNode(node)
  }

  /**
   * Activate navigation node if only node navigation type is item
   * otherwise activate first child node.
   */
  public activateNode(node: NavTreeNode | null = null): void {
    if (!node || node.uuid === this.activeNode?.uuid) {
      return
    }

    if (node.hasType(NavNodeTypes.Item)) {
      this.deactivateNode()
      this.activeNode = node
      node.activate()
    } else {
      const childNode = node.getFirstChildNode()
      this.activateNode(childNode)
    }
  }

  /** Deactivate current active navigation node. */
  public deactivateNode(): void {
    this.activeNode?.deactivate()
    this.activeNode = null
  }

  /** Find and activate node by type and offset. */
  public move(node: NavTreeNode | null, type: NavNodeTypes, offset: number): void {
    if (!node || !node.parent) {
      return
    }

    const parentNode = node.parent
    const nextNode = parentNode.getChildNode(node.index + offset)
    if (parentNode.hasType(type) && nextNode) {
      this.activateNode(nextNode)
    } else {
      this.move(parentNode, type, offset)
    }
  }

  /** Activate previous node in row. */
  public up(): void {
    this.move(this.activeNode, NavNodeTypes.Row, Offset.Prev)
  }

  /** Activate next node in row. */
  public down(): void {
    this.move(this.activeNode, NavNodeTypes.Row, Offset.Next)
  }

  /** Activate previous node in column. */
  public left(): void {
    this.move(this.activeNode, NavNodeTypes.Column, Offset.Prev)
  }

  /** Activate next next in column. */
  public right(): void {
    this.move(this.activeNode, NavNodeTypes.Column, Offset.Next)
  }
}
