import Navigator from './Navigator'

declare global {
  interface Window {
    HtmlDomNavigator: Navigator;
  }
}

if (typeof window !== 'undefined') {
  window.HtmlDomNavigator = new Navigator()
}

// TODO: add documentation to repo
// TODO: add tests
// TODO: implement nice styles for interaction test page
