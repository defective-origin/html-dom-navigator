export interface INavTreeKeyPressObservable {
  up(): void
  down(): void
  left(): void
  right(): void
  next(): void
}

export default class NavTreeKeyPressObserver {
  private controls: Record<string, () => void> = {}

  public subscribe = (observable: INavTreeKeyPressObservable): void => {
    this.unsubscribe()

    this.controls = {
      ArrowUp: () => observable.up(),
      ArrowDown: () => observable.down(),
      ArrowLeft: () => observable.left(),
      ArrowRight: () => observable.right(),
      Tab: () => observable.next(),
    }
    window.onkeydown = this.onKeyEventDetected
  }

  public onKeyEventDetected = (event: KeyboardEvent): void => {
    event.preventDefault()
    const handler = this.controls[event.key]
    if (handler) {
      handler()
    }
  }

  public unsubscribe = (): void => {
    window.onkeydown = null
  }
}
