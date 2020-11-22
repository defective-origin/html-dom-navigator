import Navigator from './Navigator'

declare global {
  interface Window {
    HtmlDomNavigator: Navigator;
  }
}

if (typeof window !== 'undefined') {
  window.HtmlDomNavigator = new Navigator()
}
