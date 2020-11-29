import { NavItemDataAttrs, NavItemTypes } from '../NavTreeNode'

export interface INavTreeClickObservable {
  activateNodeByUuid(node: string): void
}

export default class NavTreeClickObserver {
  private observable: INavTreeClickObservable | null = null

  public watch = (observable: INavTreeClickObservable): void => {
    this.unwatch()

    this.observable = observable
    window.onclick = this.onClickEventDetected
  }

  public onClickEventDetected = (event: MouseEvent): void => {
    const elem = (event.target as HTMLElement).closest<HTMLElement>(`[data-nav="${NavItemTypes.Item}"]`)

    if (!elem) {
      return
    }

    this.observable?.activateNodeByUuid(elem.dataset[NavItemDataAttrs.NavUuid] as string)
  }

  public unwatch = (): void => {
    window.onclick = null
    this.observable = null
  }
}
