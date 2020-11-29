import NavTreeNode, { NavItemTypes, Offset } from './NavTreeNode'
import { INavTreeKeyPressObservable } from './observers/NavTreeKeyPressObserver'
import { INavTreeHtmlObservable } from './observers/NavTreeHtmlObserver'
import { INavTreeClickObservable } from './observers/NavTreeClickObserver'

export default class NavTree implements INavTreeHtmlObservable,
                                        INavTreeKeyPressObservable,
                                        INavTreeClickObservable {
  public elem: HTMLElement
  public rootNode: NavTreeNode
  public nodeMapByLabel: Record<string, NavTreeNode> = {}
  public activeNode: NavTreeNode | null = null

  constructor(elem: HTMLElement) {
    this.elem = elem
    this.rootNode = new NavTreeNode(elem)
    this.build(elem, this.rootNode)
    this.activateNode(this.rootNode)
  }

  protected build(elem: HTMLElement, parent: NavTreeNode): void {
    for (let index = 0; index < elem.children.length; index += 1) {

      const childElem = elem.children[index] as HTMLElement
      if (NavTreeNode.hasNavTypeAttribute(childElem)) {
        const childNode = new NavTreeNode(childElem, parent)
        this.nodeMapByLabel[childNode.label as string] = childNode

        if (childNode.type !== NavItemTypes.Item) {
          this.build(childElem, childNode)
        }
      } else {
        this.build(childElem, parent)
      }
    }
  }

  public rebuild(): void {
    const prevActiveNavItemLabel = this.activeNode?.label as string
    this.nodeMapByLabel = {}
    this.rootNode = new NavTreeNode(this.elem)
    this.build(this.elem, this.rootNode)
    this.activateNode(prevActiveNavItemLabel)
  }

  public activateNode(node: string | NavTreeNode | null): void {
    const currentNode = node instanceof NavTreeNode ? node : this.nodeMapByLabel[node as string]
    if (!currentNode || currentNode.label === this.activeNode?.label) {
      return
    }

    if (currentNode.hasType(NavItemTypes.Item)) {
      this.activeNode?.deactivate()
      this.activeNode = currentNode
      this.activeNode?.activate()
    } else {
      const childNode = currentNode.getFirstChildNode()
      this.activateNode(childNode)
    }
  }

  public deactivateNode(): void {
    this.activeNode?.deactivate()
    this.activeNode = null
  }

  protected move(node: NavTreeNode | null, type: NavItemTypes, offset: number): void {
    if (!node || !node.parent) {
      return
    }

    const parentNode = node.parent
    if (parentNode.hasType(type)) {
      const nextNode = parentNode.getChildNode(node.index + offset)
      this.activateNode(nextNode)
    } else {
      this.move(parentNode, type, offset)
    }
  }

  public up(): void {
    this.move(this.activeNode, NavItemTypes.Row, Offset.Prev)
  }

  public down(): void {
    this.move(this.activeNode, NavItemTypes.Row, Offset.Next)
  }

  public left(): void {
    this.move(this.activeNode, NavItemTypes.Column, Offset.Prev)
  }

  public right(): void {
    this.move(this.activeNode, NavItemTypes.Column, Offset.Next)
  }
}
