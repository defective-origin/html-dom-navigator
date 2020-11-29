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
    ArrowRight: () => this.observable?.right(),
  }

  public watch = (observable: INavTreeKeyPressObservable): void => {
    this.unwatch()

    this.observable = observable
    window.onkeydown = this.onKeyEventDetected
  }

  public onKeyEventDetected = (event: KeyboardEvent): void => {
    const handler = this.controls[event.key]
    if (handler) {
      handler()
    }
  }

  public unwatch = (): void => {
    window.onkeydown = null
    this.observable = null
  }
}
