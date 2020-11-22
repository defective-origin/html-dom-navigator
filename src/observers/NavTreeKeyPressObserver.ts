export interface INavTreeKeyPressObservable {
  up(): void
  down(): void
  left(): void
  right(): void
}

export default class NavTreeKeyPressObserver {
  private observable: INavTreeKeyPressObservable | null = null
  private controls: Record<string, () => void> = {
    ArrowUp: () => this.observable?.up(),
    ArrowDown: () => this.observable?.down(),
    ArrowLeft: () => this.observable?.left(),
    ArrowRight: () => this.observable?.up(),
  }

  public watch = (observable: INavTreeKeyPressObservable): void => {
    this.unwatch()

    this.observable = observable
    window.onkeypress = this.onKeyEventDetected
  }

  public onKeyEventDetected = (event: KeyboardEvent): void => {
    const handler = this.controls[event.key]
    if (handler) {
      handler()
    }
  }

  public unwatch = (): void => {
    window.onkeypress = null
    this.observable = null
  }
}
