import { NavItemDataAttrs, NavItemTypes } from '../../NavTreeNode'
import NavTreeClickObserver, { INavTreeClickObservable } from '../NavTreeClickObserver'

class TestObservable implements INavTreeClickObservable {
  activateNodeByUuid = jest.fn()
}

describe('<NavTreeClickObserver> class', () => {
  let observer: NavTreeClickObserver
  let observable: TestObservable
  beforeEach(() => {
    observer = new NavTreeClickObserver()
    observable = new TestObservable()
  })

  describe('<subscribe> method', () => {
    it('should call unsubscribe', () => {
      observer.unsubscribe = jest.fn()
      observer.subscribe(observable)

      expect(observer.unsubscribe).toBeCalled()
    })

    it('should set click event', () => {
      observer.subscribe(observable)

      expect(window.onclick).toBeTruthy()
    })
  })

  describe('<unsubscribe> method', () => {
    it('should remove click event', () => {
      observer.subscribe(observable)
      observer.unsubscribe()

      expect(window.onclick).toBeFalsy()
    })
  })

  describe('<onClickEventDetected> method', () => {
    let elem: HTMLElement
    let event: MouseEvent
    beforeEach(() => {
      elem = document.createElement('div')
      event = {
        target: elem,
      } as any
    })

    it('should handle click event', () => {
      elem.dataset[NavItemDataAttrs.NavType] = NavItemTypes.Item
      observer.subscribe(observable)
      observer.onClickEventDetected(event)

      expect(observable.activateNodeByUuid).toBeCalled()
    })

    it('should not handle click event if element with nav item attribute is not return by elem.closest()', () => {
      observer.subscribe(observable)
      observer.onClickEventDetected(event)

      expect(observable.activateNodeByUuid).not.toBeCalled()
    })

    it('should not handle click event if observable is not set', () => {
      observer.onClickEventDetected(event)

      expect(observable.activateNodeByUuid).not.toBeCalled()
    })
  })
})
