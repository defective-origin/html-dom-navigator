export interface INavTreeHtmlObservable {
  elem: HTMLElement | null

  build(elem: HTMLElement | null): void
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
    // FIXME: remove memory leaks
    if (observable.elem) {
      this.observable = observable
      this.mutationObserver.observe(observable.elem, this.observerConfig)
    }
  }

  public onHtmlChangeDetected = (): void => {
    this.observable?.build(this.observable.elem)
  }

  public unsubscribe = (): void => {
    this.mutationObserver.disconnect()
    this.observable = null
  }
}
