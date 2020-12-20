export interface INavTreeHtmlObservable {
  elem: HTMLElement | null

  build(elem: HTMLElement): void
}

export default class NavTreeHtmlObserver {
  public mutationObserver: MutationObserver
  private observable: INavTreeHtmlObservable | null = null
  private observerConfig: MutationObserverInit = {
    attributes: true,
    childList: true,
    subtree: true,
    attributeFilter: ['data-nav'],
  }

  constructor() {
    this.mutationObserver = new MutationObserver(this.onHtmlChangeDetected)
  }

  public subscribe = (observable: INavTreeHtmlObservable): void => {
    this.unsubscribe()

    if (observable.elem) {
      this.observable = observable
      this.mutationObserver.observe(observable.elem, this.observerConfig)
    }
  }

  public onHtmlChangeDetected = (): void => {
    if (this.observable?.elem) {
      this.observable.build(this.observable.elem)
    } else {
      this.unsubscribe()
    }
  }

  public unsubscribe = (): void => {
    this.mutationObserver.disconnect()
    this.observable = null
  }
}
