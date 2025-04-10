// Initialize extension
chrome.runtime.onInstalled.addListener(() => {
  // Initialize storage with default settings if not already set
  chrome.storage.sync.get(['settings', 'bookmarks', 'folders'], function(data) {
    if (!data.settings) {
      chrome.storage.sync.set({
        settings: {
          darkMode: true,
          clockFormat: '24',
          background: 'https://images.unsplash.com/photo-1572270907014-c31da1c54124?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2089&q=80',
          timeZone: 'local',
          showSeconds: true,
          useFahrenheit: false,
          githubUsername: 'github',
          autoRotateBackgrounds: false,
          showWeatherWidget: true,
          showBookmarks: true,
          showDevPanel: true,
          showTerminalNotes: true,
          showGitHubActivity: true,
          showApiStatus: true,
          showQuickDocs: true,
          showPomodoroTimer: true
        }
      });
    }
  });
});

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getBookmarks") {
    chrome.bookmarks.getTree((bookmarkTree) => {
      sendResponse({ bookmarks: bookmarkTree });
    });
    return true; // Will respond asynchronously
  }
});
