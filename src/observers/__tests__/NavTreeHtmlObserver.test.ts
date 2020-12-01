import NavTreeHtmlObserver, { INavTreeHtmlObservable } from '../NavTreeHtmlObserver'

class TestObservable implements INavTreeHtmlObservable {
  elem = document.createElement('div')
  rebuild = jest.fn()
}

describe('<NavTreeHtmlObserver> class', () => {
  let observer: NavTreeHtmlObserver
  let observable: TestObservable
  beforeEach(() => {
    observer = new NavTreeHtmlObserver()
    observable = new TestObservable()
  })

  describe('<subscribe> method', () => {
    it('should call unsubscribe', () => {
      observer.unsubscribe = jest.fn()
      observer.subscribe(observable)

      expect(observer.unsubscribe).toBeCalled()
    })

    it('should set html change event', () => {
      observer.mutationObserver.observe = jest.fn()
      observer.subscribe(observable)

      expect(observer.mutationObserver.observe).toBeCalled()
    })
  })

  describe('<unsubscribe> method', () => {
    it('should call disconnect', () => {
      observer.subscribe(observable)

      observer.mutationObserver.disconnect = jest.fn()
      observer.unsubscribe()

      expect(observer.mutationObserver.disconnect).toBeCalled()
    })
  })

  describe('<onHtmlChangeDetected> method', () => {
    it('should handle html change event', () => {
      observer.subscribe(observable)
      observer.onHtmlChangeDetected()

      expect(observable.rebuild).toBeCalled()
    })

    it('should not handle html change event if observable is not set', () => {
      observer.onHtmlChangeDetected()

      expect(observable.rebuild).not.toBeCalled()
    })
  })
})
