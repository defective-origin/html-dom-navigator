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

// TODO: add images to readme.md
// TODO: check tests after all
// TODO: register package in npm
