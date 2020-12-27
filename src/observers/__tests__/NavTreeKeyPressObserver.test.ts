import NavTreeKeyPressObserver, { INavTreeKeyPressObservable } from '../NavTreeKeyPressObserver'

class TestObservable implements INavTreeKeyPressObservable {
  up = jest.fn()
  down = jest.fn()
  left = jest.fn()
  right = jest.fn()
  next = jest.fn()
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

      observer.onKeyEventDetected({ key: 'Tab', preventDefault: jest.fn() } as any)
      expect(observable.next).toBeCalled()

      observer.onKeyEventDetected({ key: 'ArrowUp', preventDefault: jest.fn() } as any)
      expect(observable.up).toBeCalled()

      observer.onKeyEventDetected({ key: 'ArrowDown', preventDefault: jest.fn() } as any)
      expect(observable.down).toBeCalled()

      observer.onKeyEventDetected({ key: 'ArrowLeft', preventDefault: jest.fn() } as any)
      expect(observable.left).toBeCalled()

      observer.onKeyEventDetected({ key: 'ArrowRight', preventDefault: jest.fn() } as any)
      expect(observable.right).toBeCalled()
    })

    it('should not handle key press event if observable is not set', () => {
      const event = { key: 'ArrowUp', preventDefault: jest.fn() } as any

      observer.onKeyEventDetected(event)

      expect(observable.up).not.toBeCalled()
    })

    it('should not handle key press event if there is not handler by set key', () => {
      const event = { key: 'NotExist', preventDefault: jest.fn() } as any

      observer.subscribe(observable)
      observer.onKeyEventDetected(event)

      expect(observable.up).not.toBeCalled()
    })
  })
})
