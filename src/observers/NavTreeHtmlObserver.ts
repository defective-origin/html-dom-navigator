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

  public subscribe = (observable: INavTreeHtmlObservable): void => {
    this.unsubscribe()

    this.observable = observable
    this.observer = new MutationObserver(this.onHtmlChangeDetected)
    this.observer.observe(this.observable.elem, this.observerConfig)
  }

  public onHtmlChangeDetected = (): void => {
    this.observable?.rebuild()
  }

  public unsubscribe = (): void => {
    this.observer?.disconnect()
    this.observer = null
    this.observable = null
  }
}
