export interface INavTreeHtmlObservable {
  elem: HTMLElement

  rebuild(): void
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

    this.observable = observable
    this.mutationObserver.observe(this.observable.elem, this.observerConfig)
  }

  public onHtmlChangeDetected = (): void => {
    this.observable?.rebuild()
  }

  public unsubscribe = (): void => {
    this.mutationObserver.disconnect()
    this.observable = null
  }
}
