import Navigator from '../Navigator'

describe('<Navigator> class', () => {

  let navigator: Navigator
  beforeEach(() => {
    navigator = new Navigator()
  })

  describe('<subscribe> method', () => {
    beforeEach(() => {
      navigator.navTreeHtmlObserver.subscribe = jest.fn()
      navigator.navTreeClickObserver.subscribe = jest.fn()
      navigator.navTreeKeyPressObserver.subscribe = jest.fn()
    })

    it('should build tree and subscribe on observers', () => {
      const elem = document.createElement('h1')

      navigator.subscribe(elem)

      expect(navigator.navTree?.elem).toEqual(elem)
      expect(navigator.navTreeHtmlObserver.subscribe).toBeCalled()
      expect(navigator.navTreeClickObserver.subscribe).toBeCalled()
      expect(navigator.navTreeKeyPressObserver.subscribe).toBeCalled()
    })

    it('should not do anything if previous element is equal with transferred element', () => {
      const previousElem = document.createElement('h1')
      const newElem = document.createElement('h2')

      navigator.subscribe(previousElem)
      navigator.subscribe(newElem)

      expect(navigator.navTree?.elem).toEqual(previousElem)
      expect(navigator.navTreeHtmlObserver.subscribe).toBeCalledTimes(1)
      expect(navigator.navTreeClickObserver.subscribe).toBeCalledTimes(1)
      expect(navigator.navTreeKeyPressObserver.subscribe).toBeCalledTimes(1)
    })
  })

  describe('<unsubscribe> method', () => {
    it('should unsubscribe from all subscriptions', () => {
      navigator.navTreeHtmlObserver.unsubscribe = jest.fn()
      navigator.navTreeClickObserver.unsubscribe = jest.fn()
      navigator.navTreeKeyPressObserver.unsubscribe = jest.fn()

      navigator.unsubscribe()

      expect(navigator.navTreeHtmlObserver.unsubscribe).toBeCalled()
      expect(navigator.navTreeClickObserver.unsubscribe).toBeCalled()
      expect(navigator.navTreeKeyPressObserver.unsubscribe).toBeCalled()
    })
  })

  describe('<activateNavNodeByLabel> method', () => {
    it('should call activateNodeByLabel', () => {
      navigator.subscribe(document.createElement('h1'))
      navigator.activateNavNodeByLabel('TEST')

      expect(navigator.navTree?.activateNodeByLabel).toBeCalled()
    })

    it('should not call activateNodeByLabel if nav tree is not built', () => {
      navigator.activateNavNodeByLabel('TEST')

      expect(navigator.navTree?.activateNodeByLabel).not.toBeCalled()
    })
  })

  describe('<activateNavNodeByUuid> method', () => {
    it('should call activateNodeByUuid', () => {
      navigator.subscribe(document.createElement('h1'))
      navigator.activateNavNodeByUuid('TEST')

      expect(navigator.navTree?.activateNodeByUuid).toBeCalled()
    })

    it('should not call activateNodeByUuid if nav tree is not built', () => {
      navigator.activateNavNodeByUuid('TEST')

      expect(navigator.navTree?.activateNodeByUuid).not.toBeCalled()
    })
  })

  describe('<deactivateNavNode> method', () => {
    it('should call deactivateNode', () => {
      navigator.subscribe(document.createElement('h1'))
      navigator.deactivateNavNode()

      expect(navigator.navTree?.deactivateNode).toBeCalled()
    })

    it('should not call deactivateNode if nav tree is not built', () => {
      navigator.deactivateNavNode()

      expect(navigator.navTree?.deactivateNode).not.toBeCalled()
    })
  })
})
