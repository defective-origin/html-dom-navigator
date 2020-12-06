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

// TODO: add documentation to repo
// TODO: check tests after all
// TODO: check scrollIntoView
// TODO: implement nice styles for interaction test page
// TODO: register package in npm
