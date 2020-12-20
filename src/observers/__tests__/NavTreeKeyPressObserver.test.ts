import NavTreeKeyPressObserver, { INavTreeKeyPressObservable } from '../NavTreeKeyPressObserver'

class TestObservable implements INavTreeKeyPressObservable {
  up = jest.fn()
  down = jest.fn()
  left = jest.fn()
  right = jest.fn()
}

describe('<NavTreeClickObserver> class', () => {
  let observer: NavTreeKeyPressObserver
  let observable: TestObservable
  beforeEach(() => {
    observer = new NavTreeKeyPressObserver()
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

      expect(window.onkeydown).toBeTruthy()
    })
  })

  describe('<unsubscribe> method', () => {
    it('should remove click event', () => {
      observer.subscribe(observable)
      observer.unsubscribe()

      expect(window.onkeydown).toBeFalsy()
    })
  })

  describe('<onKeyEventDetected> method', () => {
    it('should handle navigation key press events', () => {
      observer.subscribe(observable)

      observer.onKeyEventDetected({ key: 'ArrowUp' } as any)
      expect(observable.up).toBeCalled()

      observer.onKeyEventDetected({ key: 'ArrowDown' } as any)
      expect(observable.down).toBeCalled()

      observer.onKeyEventDetected({ key: 'ArrowLeft' } as any)
      expect(observable.left).toBeCalled()

      observer.onKeyEventDetected({ key: 'ArrowRight' } as any)
      expect(observable.right).toBeCalled()
    })

    it('should not handle key press event if observable is not set', () => {
      const event = { key: 'ArrowUp' } as any

      observer.onKeyEventDetected(event)

      expect(observable.up).not.toBeCalled()
    })

    it('should not handle key press event if there is not handler by set key', () => {
      const event = { key: 'NotExist' } as any

      observer.subscribe(observable)
      observer.onKeyEventDetected(event)

      expect(observable.up).not.toBeCalled()
    })
  })
})
