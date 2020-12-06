import '@testing-library/jest-dom'
import NavTree from '../NavTree'
import NavTreeNode, { NavNodeDataAttrs, NavNodeTypes, Offset } from '../NavTreeNode'

describe('<NavTree> class', () => {

  let navTree: NavTree
  beforeEach(() => {
    navTree = new NavTree()

    window.HTMLElement.prototype.scrollIntoView = jest.fn()
  })

  describe('<parseHtml> method', () => {
    it('should not build tree if there are not nav elements', () => {
      const elem = document.createElement('div')
      elem.innerHTML = `
        <div class="block-A">
          <div class="block-A__item-1"></div>
          <div class="block-A__item-2"></div>
          <div class="block-A__item-3"></div>
        </div>
        <div class="block-B">
          <div class="block-B__item-1"></div>
          <div class="block-B__item-2"></div>
          <div class="block-B__item-3"></div>
        </div>
      `
      const rootNode = new NavTreeNode(elem)

      navTree.parseHtml(elem, rootNode)

      expect(rootNode.getFirstChildNode()).toEqual(null)
    })

    it('should parse html and build correct tree', () => {
      const elem = document.createElement('div')
      elem.innerHTML = `
        <div class="block-A" data-nav="${NavNodeTypes.Column}">
          <div class="block-A__item-1" data-nav="${NavNodeTypes.Item}"></div>
          <div class="block-A__item-2" data-nav="${NavNodeTypes.Item}"></div>
          <div class="block-A__item-3" data-nav="${NavNodeTypes.Item}"></div>
        </div>
        <div class="block-B" data-nav="${NavNodeTypes.Row}">
          <div class="block-B__item-1" data-nav="${NavNodeTypes.Item}"></div>
          <div class="block-B__item-2" data-nav="${NavNodeTypes.Item}"></div>
          <div class="block-B__item-3" data-nav="${NavNodeTypes.Item}"></div>
        </div>
      `
      const rootNode = new NavTreeNode(elem)

      navTree.parseHtml(elem, rootNode)

      const blockANode = rootNode.getChildNode(0)
      expect(blockANode?.elem).toHaveClass('block-A')
      expect(blockANode?.getChildNode(0)?.elem).toHaveClass('block-A__item-1')
      expect(blockANode?.getChildNode(1)?.elem).toHaveClass('block-A__item-2')
      expect(blockANode?.getChildNode(2)?.elem).toHaveClass('block-A__item-3')

      const blockBNode = rootNode.getChildNode(1)
      expect(blockBNode?.elem).toHaveClass('block-B')
      expect(blockBNode?.getChildNode(0)?.elem).toHaveClass('block-B__item-1')
      expect(blockBNode?.getChildNode(1)?.elem).toHaveClass('block-B__item-2')
      expect(blockBNode?.getChildNode(2)?.elem).toHaveClass('block-B__item-3')
    })
  })

  describe('<registerNode> method', () => {
    beforeEach(() => {
      navTree.clear()
    })

    it('should add uuid entry to nodeMapByUuid', () => {
      const node = new NavTreeNode(document.createElement('div'))

      navTree.registerNode(node)

      expect(navTree.nodeMapByUuid[node.uuid]).toEqual(node)
    })

    it('should add label entry to nodeMapByLabel', () => {
      const node = new NavTreeNode(document.createElement('div'))
      node.elem.dataset[NavNodeDataAttrs.NavLabel] = 'TEST'

      navTree.registerNode(node)

      expect(navTree.nodeMapByLabel[node.label as string]).toEqual(node)
    })

    it('should not add label entry to nodeMapByLabel if node does not have label', () => {
      const node = new NavTreeNode(document.createElement('div'))

      navTree.registerNode(node)

      expect(navTree.nodeMapByLabel[node.label as string]).toBeFalsy()
    })
  })

  describe('<build> method', () => {
    let elem: HTMLElement
    beforeEach(() => {
      elem = document.createElement('div')
      elem.dataset[NavNodeDataAttrs.NavType] = NavNodeTypes.Row
    })

    it('should not build if element is not transferred', () => {
      navTree.build()

      expect(navTree.elem).toEqual(null)
    })

    it('should not build if element has not nav attribute', () => {
      navTree.build(document.createElement('div'))

      expect(navTree.elem).toEqual(null)
    })

    it('should clear previous build', () => {
      navTree.clear = jest.fn()

      navTree.build(elem)

      expect(navTree.clear).toBeCalled()
    })

    it('should parse html from transferred element', () => {
      navTree.parseHtml = jest.fn()

      navTree.build(elem)

      expect(navTree.parseHtml).toBeCalledWith(elem, expect.any(NavTreeNode))
    })

    it('should activate root node if there was not active node', () => {
      navTree.activateNode = jest.fn()

      navTree.build(elem)

      expect(navTree.activateNode).toBeCalledWith(expect.any(NavTreeNode))
    })

    it('should activate node by uuid if there was active node', () => {
      navTree.activateNodeByUuid = jest.fn()
      elem.innerHTML = `
        <div data-nav-uuid="TEST_UUID" data-nav="${NavNodeTypes.Item}"></div>
      `

      navTree.build(elem)
      expect(navTree.activateNodeByUuid).not.toBeCalled()

      navTree.build(elem)
      expect(navTree.activateNodeByUuid).toBeCalledWith('TEST_UUID')
    })
  })

  describe('<clear> method', () => {
    it('should reset fields', () => {
      const node = new NavTreeNode(document.createElement('div'))

      navTree.elem = document.createElement('div')
      navTree.nodeMapByUuid = { TEST: node }
      navTree.nodeMapByLabel = { TEST: node }
      navTree.activeNode = node

      navTree.clear()

      expect(navTree.elem).toEqual(null)
      expect(navTree.nodeMapByUuid).toEqual({})
      expect(navTree.nodeMapByLabel).toEqual({})
      expect(navTree.activeNode).toEqual(null)
    })

    it('should call deactivateNode', () => {
      navTree.deactivateNode = jest.fn()
      navTree.activeNode = new NavTreeNode(document.createElement('div'))

      navTree.clear()

      expect(navTree.deactivateNode).toBeCalled()
    })
  })

  describe('<activateNodeByLabel> method', () => {
    it('should find node by label and call activateNode', () => {
      const node = new NavTreeNode(document.createElement('div'))
      navTree.activateNode = jest.fn()
      navTree.nodeMapByLabel = { TEST: node }

      navTree.activateNodeByLabel('TEST')

      expect(navTree.activateNode).toBeCalledWith(node)
    })
  })

  describe('<activateNodeByUuid> method', () => {
    it('should find node by uuid and call activateNode', () => {
      const node = new NavTreeNode(document.createElement('div'))
      navTree.activateNode = jest.fn()
      navTree.nodeMapByUuid = { TEST: node }

      navTree.activateNodeByUuid('TEST')

      expect(navTree.activateNode).toBeCalledWith(node)
    })
  })

  describe('<activateNode> method', () => {
    // TODO: write 2d example
    it('should not activate node if node is not transferred', () => {
      navTree.activateNode()

      expect(navTree.activeNode).toEqual(null)
    })

    it('should not activate node if node uuid is equal active node uuid', () => {
      const node = new NavTreeNode(document.createElement('div'))
      node.elem.dataset[NavNodeDataAttrs.NavType] = NavNodeTypes.Item
      node.elem.dataset[NavNodeDataAttrs.NavUuid] = 'TEST_UUID'
      node.activate = jest.fn()

      navTree.activateNode(node)
      navTree.activateNode(node)

      expect(node.activate).toBeCalledTimes(1)
    })

    it('should deactivate previous active node', () => {
      const prevElem = document.createElement('div')
      prevElem.dataset[NavNodeDataAttrs.NavType] = NavNodeTypes.Item
      const prevNode = new NavTreeNode(prevElem)
      prevNode.deactivate = jest.fn()

      const nextElem = document.createElement('div')
      nextElem.dataset[NavNodeDataAttrs.NavType] = NavNodeTypes.Item
      const nextNode = new NavTreeNode(nextElem)

      navTree.activateNode(prevNode)
      navTree.activateNode(nextNode)

      expect(prevNode.deactivate).toBeCalled()
    })

    it('should activate node if node has nav type Item', () => {
      const node = new NavTreeNode(document.createElement('div'))
      node.elem.dataset[NavNodeDataAttrs.NavType] = NavNodeTypes.Item
      node.activate = jest.fn()

      navTree.activateNode(node)

      expect(node.activate).toBeCalled()
    })

    it('should find first nested nav item by first child node if node nav type is not Item', () => {
      const node1 = new NavTreeNode(document.createElement('div'))
      node1.elem.dataset[NavNodeDataAttrs.NavType] = NavNodeTypes.Row

      const node2 = new NavTreeNode(document.createElement('div'), node1)
      node2.elem.dataset[NavNodeDataAttrs.NavType] = NavNodeTypes.Column

      const node3 = new NavTreeNode(document.createElement('div'), node2)
      node3.elem.dataset[NavNodeDataAttrs.NavType] = NavNodeTypes.Item
      node3.activate = jest.fn()

      navTree.activateNode(node1)

      expect(navTree.activeNode).toEqual(node3)
      expect(node3.activate).toBeCalled()
    })
  })

  describe('<deactivateNode> method', () => {
    it('should deactivate active node if there is one', () => {
      const node = new NavTreeNode(document.createElement('div'))

      node.deactivate = jest.fn()
      navTree.activeNode = node

      navTree.deactivateNode()

      expect(node.deactivate).toBeCalled()
    })

    it('should reset active node', () => {
      navTree.activeNode = new NavTreeNode(document.createElement('div'))

      navTree.deactivateNode()

      expect(navTree.activeNode).toEqual(null)
    })
  })

  describe('<move> method', () => {
    // TODO: write 2d example
    it('should not look for next node if node is not transferred', () => {
      const node = new NavTreeNode(document.createElement('div'))
      navTree.activeNode = node

      navTree.move(null, NavNodeTypes.Row, Offset.Next)

      expect(navTree.activeNode).toEqual(node)
    })

    it('should not look for next node if node has not parent node', () => {
      const node1 = new NavTreeNode(document.createElement('h1'))
      const node2 = new NavTreeNode(document.createElement('h2'))
      navTree.activeNode = node1

      navTree.move(node2, NavNodeTypes.Row, Offset.Next)

      expect(navTree.activeNode).toEqual(node1)
    })

    it('should activate next node if parent node type is equal transferred type', () => {
      const blockNode = new NavTreeNode(document.createElement('div'))
      blockNode.elem.dataset[NavNodeDataAttrs.NavType] = NavNodeTypes.Row
      const navNode1 = new NavTreeNode(document.createElement('h1'), blockNode)
      const navNode2 = new NavTreeNode(document.createElement('h2'), blockNode)
      navTree.activateNode = jest.fn()

      navTree.move(navNode1, NavNodeTypes.Row, Offset.Next)

      expect(navTree.activateNode).toBeCalledWith(navNode2)
    })

    it('should activate next node if parent contains child by current child index + offset', () => {
      const blockNode = new NavTreeNode(document.createElement('div'))
      blockNode.elem.dataset[NavNodeDataAttrs.NavType] = NavNodeTypes.Row
      const navNode1 = new NavTreeNode(document.createElement('h1'), blockNode)
      const navNode2 = new NavTreeNode(document.createElement('h2'), blockNode)
      const navNode3 = new NavTreeNode(document.createElement('h3'), blockNode)
      const navNode4 = new NavTreeNode(document.createElement('h4'), blockNode)
      navTree.activateNode = jest.fn()

      navTree.move(navNode1, NavNodeTypes.Row, 3)

      expect(navTree.activateNode).toBeCalledWith(navNode4)
    })

    it('should look into next parent node if parent does not contain next child or has wrong type', () => {
      const blockNode1 = new NavTreeNode(document.createElement('div'))
      blockNode1.elem.dataset[NavNodeDataAttrs.NavType] = NavNodeTypes.Row
      const blockNode2 = new NavTreeNode(document.createElement('div'), blockNode1)
      blockNode2.elem.dataset[NavNodeDataAttrs.NavType] = NavNodeTypes.Column
      const blockNode3 = new NavTreeNode(document.createElement('div'), blockNode2)
      blockNode3.elem.dataset[NavNodeDataAttrs.NavType] = NavNodeTypes.Row
      const blockNode4 = new NavTreeNode(document.createElement('div'), blockNode3)
      blockNode4.elem.dataset[NavNodeDataAttrs.NavType] = NavNodeTypes.Column
      const navNode1 = new NavTreeNode(document.createElement('h1'), blockNode1)
      const navNode2 = new NavTreeNode(document.createElement('h2'), blockNode4)
      navTree.activateNode = jest.fn()

      navTree.move(navNode2, NavNodeTypes.Row, Offset.Next)

      expect(navTree.activateNode).toBeCalledWith(navNode1)
    })
  })

  describe('<up> method', () => {
    it('should call move', () => {
      navTree.move = jest.fn()
      navTree.activeNode = new NavTreeNode(document.createElement('div'))

      navTree.up()

      expect(navTree.move).toBeCalledWith(navTree.activeNode, NavNodeTypes.Row, Offset.Prev)
    })
  })

  describe('<down> method', () => {
    it('should call move', () => {
      navTree.move = jest.fn()
      navTree.activeNode = new NavTreeNode(document.createElement('div'))

      navTree.down()

      expect(navTree.move).toBeCalledWith(navTree.activeNode, NavNodeTypes.Row, Offset.Next)
    })
  })

  describe('<left> method', () => {
    it('should call move', () => {
      navTree.move = jest.fn()
      navTree.activeNode = new NavTreeNode(document.createElement('div'))

      navTree.left()

      expect(navTree.move).toBeCalledWith(navTree.activeNode, NavNodeTypes.Column, Offset.Prev)
    })
  })

  describe('<right> method', () => {
    it('should call move', () => {
      navTree.move = jest.fn()
      navTree.activeNode = new NavTreeNode(document.createElement('div'))

      navTree.right()

      expect(navTree.move).toBeCalledWith(navTree.activeNode, NavNodeTypes.Column, Offset.Next)
    })
  })
})
