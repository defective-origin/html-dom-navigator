export interface INavTreeHtmlObservable {
  elem: HTMLElement

  rebuild(): void
}

export default class NavTreeHtmlObserver {
  private observer: MutationObserver | null = null
  private observable: INavTreeHtmlObservable | null = null
  private observerConfig: MutationObserverInit = {
    attributes: true,
    childList: true,
    subtree: true,
    attributeFilter: ['data-nav'],
  }

  public watch = (observable: INavTreeHtmlObservable): void => {
    this.unwatch()

    this.observable = observable
    this.observer = new MutationObserver(this.onHtmlChangeDetected)
    this.observer.observe(this.observable.elem, this.observerConfig)
  }

  public onHtmlChangeDetected = (): void => {
    this.observable?.rebuild()
  }

  public unwatch = (): void => {
    this.observer?.disconnect()
    this.observer = null
    this.observable = null
  }
}
