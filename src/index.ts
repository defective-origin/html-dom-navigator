import Navigator from './Navigator'
import NavTree from './NavTree'
import NavTreeNode from './NavTreeNode'
import NavTreeObservers from './observers'

declare global {
  interface Window {
    HtmlDomNavigator: typeof Navigator;
  }
}

// inject navigator to window
if (typeof window !== 'undefined') {
  window.HtmlDomNavigator = Navigator
}

export default Navigator
export {
  NavTree,
  NavTreeNode,
  NavTreeObservers,
}
