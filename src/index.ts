import Navigator from './Navigator'

declare global {
  interface Window {
    HtmlDomNavigator: Navigator;
  }
}

// inject navigator to window
if (typeof window !== 'undefined') {
  window.HtmlDomNavigator = new Navigator()
}
