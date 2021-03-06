import NavTreeNode, { NavNodeDataAttrs, NavNodeTypes } from '../NavTreeNode'

describe('<NavTreeNode> class', () => {

  let elem: HTMLDivElement
  beforeEach(() => {
    elem = document.createElement('div')
  })

  describe('<constructor>', () => {
    it('should update index if node is not first child', () => {
      const parent = new NavTreeNode(document.createElement('div'))
      const node1 = new NavTreeNode(document.createElement('div'), parent)
      const node2 = new NavTreeNode(elem, parent)

      expect(node2.index).toEqual(1)
    })

    it('should add himself to parent node', () => {
      const parent = new NavTreeNode(document.createElement('div'))
      const node = new NavTreeNode(elem, parent)

      expect(parent.getFirstChildNode()?.uuid).toEqual(node.uuid)
    })

    it('should set uuid', () => {
      const node = new NavTreeNode(elem)

      expect(node.uuid).toMatch(/\w{8}-\w{4}-\w{4}-\w{4}-\w{12}/)
    })

    it('should not set uuid if it is set already', () => {
      elem.dataset[NavNodeDataAttrs.NavUuid] = 'TEST'
      const node = new NavTreeNode(elem)

      expect(node.uuid).toEqual('TEST')
    })

    it('should set tabindex = -1 for node with type ITEM in order to navigate by it', () => {
      elem.dataset[NavNodeDataAttrs.NavType] = NavNodeTypes.Item
      const node = new NavTreeNode(elem)

      expect(elem.tabIndex).toEqual(-1)
    })

  })

  describe('<type> getter', () => {
    it('should return type', () => {
      elem.dataset[NavNodeDataAttrs.NavType] = NavNodeTypes.Item
      const node = new NavTreeNode(elem)

      expect(node.type).toEqual(NavNodeTypes.Item)
    })

    it('should return null if type is not defined', () => {
      const node = new NavTreeNode(elem)

      expect(node.type).toEqual(null)
    })
  })

  describe('<label> getter', () => {
    it('should return label', () => {
      elem.dataset[NavNodeDataAttrs.NavLabel] = 'TEST'
      const node = new NavTreeNode(elem)

      expect(node.label).toEqual('TEST')
    })

    it('should return null if label is not set', () => {
      const node = new NavTreeNode(elem)

      expect(node.label).toEqual(null)
    })
  })

  describe('<uuid> getter', () => {
    it('should return uuid', () => {
      elem.dataset[NavNodeDataAttrs.NavUuid] = 'TEST'
      const node = new NavTreeNode(elem)

      expect(node.uuid).toEqual('TEST')
    })
  })

  describe('<focus> getter', () => {
    it('should return selector to focusable element', () => {
      elem.dataset[NavNodeDataAttrs.NavFocus] = 'TEST'
      const node = new NavTreeNode(elem)

      expect(node.focus).toEqual('TEST')
    })

    it('should return null if focus is not set', () => {
      const node = new NavTreeNode(elem)

      expect(node.focus).toEqual(null)
    })
  })

  describe('<isActive> getter', () => {
    it('should return true if attribute is defined', () => {
      elem.dataset[NavNodeDataAttrs.ActiveNavItem] = 'true'
      const node = new NavTreeNode(elem)

      expect(node.isActive).toEqual(true)
    })

    it('should return false if attribute is not defined', () => {
      const node = new NavTreeNode(elem)

      expect(node.isActive).toEqual(false)
    })
  })

  describe('<hasType> method', () => {
    it('should return true if type is equal', () => {
      elem.dataset[NavNodeDataAttrs.NavType] = NavNodeTypes.Row
      const node = new NavTreeNode(elem)

      expect(node.hasType(NavNodeTypes.Row)).toEqual(true)
    })

    it('should return false if type is not equal', () => {
      const node = new NavTreeNode(elem)

      expect(node.hasType(NavNodeTypes.Row)).toEqual(false)
    })
  })

  describe('<getChildNode> method', () => {
    it('should return child node by index', () => {
      const node = new NavTreeNode(elem)

      // add children
      const childNode1 = new NavTreeNode(document.createElement('h1'), node)
      const childNode2 = new NavTreeNode(document.createElement('h2'), node)
      const childNode3 = new NavTreeNode(document.createElement('h3'), node)

      expect(node.getChildNode(1)).toEqual(childNode2)
    })

    it('should return null if there is not child node by index', () => {
      const node = new NavTreeNode(elem)

      expect(node.getChildNode(0)).toEqual(null)
    })
  })

  describe('<getFirstChildNode> method', () => {
    it('should return first child node', () => {
      const node = new NavTreeNode(elem)

      // add children
      const childNode1 = new NavTreeNode(document.createElement('h1'), node)
      const childNode2 = new NavTreeNode(document.createElement('h2'), node)
      const childNode3 = new NavTreeNode(document.createElement('h3'), node)

      expect(node.getFirstChildNode()).toEqual(childNode1)
    })

    it('should return null if there is not children', () => {
      const node = new NavTreeNode(elem)

      expect(node.getFirstChildNode()).toEqual(null)
    })
  })

  describe('<hasNavTypeAttribute> static method', () => {
    it('should return true if type is defined', () => {
      elem.dataset[NavNodeDataAttrs.NavType] = NavNodeTypes.Item

      expect(NavTreeNode.hasNavTypeAttribute(elem)).toEqual(true)
    })

    it('should return false if type is not defined', () => {
      expect(NavTreeNode.hasNavTypeAttribute(elem)).toEqual(false)
    })
  })

  describe('<activate> method', () => {
    beforeEach(() => {
      elem.focus = jest.fn()
      elem.scrollIntoView = jest.fn()
      elem.dataset[NavNodeDataAttrs.NavType] = NavNodeTypes.Item
    })

    it('should set active attribute', () => {
      const node = new NavTreeNode(elem)

      node.activate()

      expect(node.isActive).toEqual(true)
    })

    it('should focus on element and scroll to element', () => {
      const node = new NavTreeNode(elem)

      node.activate()

      expect(elem.focus).toHaveBeenCalled()
      expect(elem.scrollIntoView).toHaveBeenCalled()
    })

    it('should focus on element selected by data-focus attribute if it is set', () => {
      const child = document.createElement('h1')
      child.focus = jest.fn()
      child.scrollIntoView = jest.fn()

      elem.appendChild(child)
      elem.dataset[NavNodeDataAttrs.NavFocus] = 'h1'
      const node = new NavTreeNode(elem)

      node.activate()

      expect(child.focus).toHaveBeenCalled()
      expect(child.scrollIntoView).toHaveBeenCalled()
    })

    it('should not activate again if node is active already', () => {
      elem.dataset[NavNodeDataAttrs.ActiveNavItem] = 'true'
      const node = new NavTreeNode(elem)

      node.activate()

      expect(elem.focus).not.toHaveBeenCalled()
    })

    it('should not activate again if type is not item', () => {
      elem.dataset[NavNodeDataAttrs.NavType] = NavNodeTypes.Row
      const node = new NavTreeNode(elem)

      node.activate()

      expect(elem.focus).not.toHaveBeenCalled()
    })
  })

  describe('<deactivate> method', () => {
    beforeEach(() => {
      elem.blur = jest.fn()
    })

    it('should remove active attribute', () => {
      const node = new NavTreeNode(elem)

      node.deactivate()

      expect(node.isActive).toEqual(false)
    })

    it('should blur from element', () => {
      elem.dataset[NavNodeDataAttrs.ActiveNavItem] = 'true'
      const node = new NavTreeNode(elem)

      node.deactivate()

      expect(elem.blur).toHaveBeenCalled()
    })

    it('should not deactivate again if node is not active', () => {
      const node = new NavTreeNode(elem)

      node.deactivate()

      expect(elem.blur).not.toHaveBeenCalled()
    })
  })
})
