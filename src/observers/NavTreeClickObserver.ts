import { NavNodeDataAttrs, NavNodeTypes } from '../NavTreeNode'

export interface INavTreeClickObservable {
  activateNodeByUuid(node: string): void
}

export default class NavTreeClickObserver {
  private observable: INavTreeClickObservable | null = null

  public subscribe = (observable: INavTreeClickObservable): void => {
    this.unsubscribe()

    this.observable = observable
    window.onclick = this.onClickEventDetected
  }

  public onClickEventDetected = (event: MouseEvent): void => {
    const elem = (event.target as HTMLElement).closest<HTMLElement>(`[data-nav="${NavNodeTypes.Item}"]`)

    if (elem && this.observable) {
      this.observable.activateNodeByUuid(elem.dataset[NavNodeDataAttrs.NavUuid] as string)
    }
  }

  public unsubscribe = (): void => {
    window.onclick = null
    this.observable = null
  }
}
