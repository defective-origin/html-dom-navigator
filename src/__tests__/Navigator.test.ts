import Navigator from '../Navigator'
import NavTree from '../NavTree'

describe('<Navigator> class', () => {

  let navigator: Navigator
  beforeEach(() => {
    navigator = new Navigator()
  })

  describe('<subscribe> method', () => {
    beforeEach(() => {
      navigator.unsubscribe = jest.fn()
      navigator.navTree.build = jest.fn((elem = null) => { navigator.navTree.elem = elem })
      navigator.navTreeHtmlObserver.subscribe = jest.fn()
      navigator.navTreeClickObserver.subscribe = jest.fn()
      navigator.navTreeKeyPressObserver.subscribe = jest.fn()
    })

    it('should build tree and subscribe on observers', () => {
      const elem = document.createElement('h1')

      navigator.subscribe(elem)

      expect(navigator.unsubscribe).toBeCalled()
      expect(navigator.navTree.build).toBeCalledWith(elem)
      expect(navigator.navTreeHtmlObserver.subscribe).toBeCalledWith(navigator.navTree)
      expect(navigator.navTreeClickObserver.subscribe).toBeCalledWith(navigator.navTree)
      expect(navigator.navTreeKeyPressObserver.subscribe).toBeCalledWith(navigator.navTree)
    })

    it('should build tree and subscribe on observers if previous element is not equal with transferred element', () => {
      const previousElem = document.createElement('h1')
      const newElem = document.createElement('h2')

      navigator.subscribe(previousElem)
      navigator.subscribe(newElem)

      expect(navigator.unsubscribe).toBeCalledTimes(2)
      expect(navigator.navTree.build).toBeCalledTimes(2)
      expect(navigator.navTreeHtmlObserver.subscribe).toBeCalledTimes(2)
      expect(navigator.navTreeClickObserver.subscribe).toBeCalledTimes(2)
      expect(navigator.navTreeKeyPressObserver.subscribe).toBeCalledTimes(2)
    })

    it('should not do anything if previous element is equal with transferred element', () => {
      const elem = document.createElement('h1')

      navigator.subscribe(elem)
      navigator.subscribe(elem)
      navigator.subscribe(elem)
      navigator.subscribe(elem)

      expect(navigator.unsubscribe).toBeCalledTimes(1)
      expect(navigator.navTree.build).toBeCalledTimes(1)
      expect(navigator.navTreeHtmlObserver.subscribe).toBeCalledTimes(1)
      expect(navigator.navTreeClickObserver.subscribe).toBeCalledTimes(1)
      expect(navigator.navTreeKeyPressObserver.subscribe).toBeCalledTimes(1)
    })
  })

  describe('<unsubscribe> method', () => {
    it('should unsubscribe from all subscriptions', () => {
      navigator.navTree.clear = jest.fn()
      navigator.navTreeHtmlObserver.unsubscribe = jest.fn()
      navigator.navTreeClickObserver.unsubscribe = jest.fn()
      navigator.navTreeKeyPressObserver.unsubscribe = jest.fn()

      navigator.unsubscribe()

      expect(navigator.navTree.clear).toBeCalled()
      expect(navigator.navTreeHtmlObserver.unsubscribe).toBeCalled()
      expect(navigator.navTreeClickObserver.unsubscribe).toBeCalled()
      expect(navigator.navTreeKeyPressObserver.unsubscribe).toBeCalled()
    })
  })

  describe('<activateNavNodeByLabel> method', () => {
    it('should call activateNodeByLabel', () => {
      navigator.subscribe(document.createElement('h1'));
      (navigator.navTree as NavTree).activateNodeByLabel = jest.fn()
      navigator.activateNavNodeByLabel('TEST')

      expect((navigator.navTree as NavTree).activateNodeByLabel).toBeCalledWith('TEST')
    })
  })

  describe('<activateNavNodeByUuid> method', () => {
    it('should call activateNodeByUuid', () => {
      navigator.subscribe(document.createElement('h1'));
      (navigator.navTree as NavTree).activateNodeByUuid = jest.fn()
      navigator.activateNavNodeByUuid('TEST')

      expect((navigator.navTree as NavTree).activateNodeByUuid).toBeCalledWith('TEST')
    })
  })

  describe('<deactivateNavNode> method', () => {
    it('should call deactivateNode', () => {
      navigator.subscribe(document.createElement('h1'));
      (navigator.navTree as NavTree).deactivateNode = jest.fn()
      navigator.deactivateNavNode()

      expect((navigator.navTree as NavTree).deactivateNode).toBeCalled()
    })
  })
})
