// Constants
const DEFAULT_SETTINGS = {
  darkMode: true,
  clockFormat: '24',
  background: 'https://images.unsplash.com/photo-1572270907014-c31da1c54124?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2089&q=80',
  customBackground: null,
  timeZone: 'local',
  showSeconds: true,
  useFahrenheit: false,
  githubUsername: 'github',
  autoRotateBackgrounds: false,
  showWeatherWidget: true,
  showBookmarks: true,
  showDevPanel: true,
  showTerminalNotes: true,
  defaultSearchEngine: 'google',
  openSearchInNewTab: true
};

// DOM Elements
const clockElement = document.getElementById('clock');
const dateElement = document.getElementById('date');
const bookmarksContainer = document.getElementById('bookmarks');
const settingsToggle = document.getElementById('settingsToggle');
const settingsPanel = document.getElementById('settingsPanel');
const closeSettings = document.getElementById('closeSettings');
const overlay = document.getElementById('overlay');
const darkModeToggle = document.getElementById('darkModeToggle');
const clockFormatSelect = document.getElementById('clockFormat');
const backgroundOptions = document.querySelectorAll('.background-option');
const customBgInput = document.getElementById('customBgInput');
const addBookmarkBtn = document.getElementById('addBookmark');
const bookmarkModal = document.getElementById('bookmarkModal');
const closeModal = document.getElementById('closeModal');
const saveBookmarkBtn = document.getElementById('saveBookmark');
const timeZoneSelect = document.getElementById('timeZone');
const showSecondsToggle = document.getElementById('showSeconds');
const tempUnitToggle = document.getElementById('tempUnitToggle');
const githubUsernameInput = document.getElementById('githubUsername');
const refreshGitHubBtn = document.getElementById('refreshGitHub');
const searchBookmarks = document.getElementById('searchBookmarks');
const bookmarksTabs = document.querySelectorAll('.bookmarks-tabs .tab');
const addBookmarkFolder = document.getElementById('addBookmarkFolder');
const folderModal = document.getElementById('folderModal');
const closeFolderModalBtn = document.getElementById('closeFolderModal');
const saveFolderBtn = document.getElementById('saveFolder');
const searchForm = document.getElementById('searchForm');
const searchInput = document.getElementById('searchInput');
const searchEngineButton = document.getElementById('searchEngineButton');
const searchEngineIcon = document.getElementById('searchEngineIcon');
const searchEngineDropdown = document.getElementById('searchEngineDropdown');
const searchEngineOptions = document.querySelectorAll('.search-engine-option');
const defaultSearchEngineSelect = document.getElementById('defaultSearchEngine');
const openInNewTabToggle = document.getElementById('openInNewTab');
const weatherWidgetToggle = document.getElementById('weatherWidgetToggle');
const bookmarksToggle = document.getElementById('bookmarksToggle');
const devPanelToggleSwitch = document.getElementById('devPanelToggle');
const terminalNotesToggle = document.getElementById('terminalNotesToggle');
const devPanel = document.getElementById('devPanel');
const githubActivity = document.getElementById('githubActivity');
const timerDisplay = document.getElementById('timerDisplay');
const timerStart = document.getElementById('timerStart');
const timerReset = document.getElementById('timerReset');
const pomodoroMode = document.getElementById('pomodoroMode');
const breakMode = document.getElementById('breakMode');
const terminalNotes = document.getElementById('terminalNotes');
const terminalToggle = document.getElementById('terminalToggle');
const terminalInput = document.getElementById('terminalInput');
const terminalOutput = document.getElementById('terminalOutput');
const devPanelHeaderToggle = document.getElementById('devPanelToggleBtn');
const iconOptions = document.querySelectorAll('.icon-option');


// Pomodoro Timer functionality
let timerInterval;
let timerRunning = false;
let timerMode = 'pomodoro';
let timeLeft = 25 * 60; // 25 minutes in seconds

// Default Bookmarks and Folders for Developers
const DEFAULT_BOOKMARKS = [
  // Essential Productivity
  { title: 'Gmail', url: 'https://mail.google.com', icon: 'M', color: '#D44638', category: 'prod' },
  { title: 'Google', url: 'https://www.google.com', icon: 'G', color: '#4285f4', category: 'other' },

  // Development Essential
  { title: 'GitHub', url: 'https://www.github.com', icon: 'GH', color: '#333333', category: 'dev' },
  { title: 'Stack Overflow', url: 'https://stackoverflow.com', icon: 'SO', color: '#F48024', category: 'dev' },
  { title: 'VSCode', url: 'https://vscode.dev', icon: '<i class="fas fa-code"></i>', color: '#007ACC', iconIsHtml: true, category: 'dev' },

  // Web Development Resources
  { title: 'Tailwind CSS', url: 'https://tailwindcss.com', icon: 'TW', color: '#38B2AC', category: 'dev' },
  { title: 'MDN Web Docs', url: 'https://developer.mozilla.org', icon: 'MDN', color: '#000000', category: 'dev' },

  // AI Resources
  { title: 'Claude', url: 'https://claude.ai', icon: 'CL', color: '#0057FF', category: 'ai' },
  { title: 'ChatGPT', url: 'https://chat.openai.com', icon: 'AI', color: '#10A37F', category: 'ai' },

  // Social and Learning
  { title: 'YouTube', url: 'https://www.youtube.com', icon: 'Y', color: '#FF0000', category: 'social' },
  { title: 'Dev.to', url: 'https://dev.to', icon: 'D', color: '#0A0A0A', category: 'dev' }
];

const DEFAULT_FOLDERS = [
  {
    id: 'dev-tools',
    name: 'Development Tools',
    color: '#007ACC',
    category: 'dev',
    items: [
      { title: 'GitHub', url: 'https://www.github.com', icon: 'GH', color: '#333333' },
      { title: 'CodePen', url: 'https://codepen.io', icon: 'CP', color: '#47cf73' },
      { title: 'NPM', url: 'https://www.npmjs.com', icon: 'NPM', color: '#cb3837' }
    ]
  },
  {
    id: 'web-frameworks',
    name: 'Web Frameworks',
    color: '#61DAFB',
    category: 'dev',
    items: [
      { title: 'React', url: 'https://react.dev', icon: 'R', color: '#61DAFB' },
      { title: 'Next.js', url: 'https://nextjs.org', icon: 'NX', color: '#000000' },
      { title: 'TypeScript', url: 'https://www.typescriptlang.org', icon: 'TS', color: '#3178C6' }
    ]
  },
  {
    id: 'ai-resources',
    name: 'AI & Machine Learning',
    color: '#FF6F61',
    category: 'ai',
    items: [
      { title: 'Claude', url: 'https://claude.ai', icon: 'CL', color: '#0057FF' },
      { title: 'Hugging Face', url: 'https://huggingface.co', icon: 'HF', color: '#FFD21E' },
      { title: 'Kaggle', url: 'https://www.kaggle.com', icon: 'K', color: '#20BEFF' }
    ]
  }
];
function getCategoryLabel(category) {
  switch (category) {
    case 'dev': return 'Dev';
    case 'prod': return 'Prod';
    case 'social': return 'Social';
    case 'ai': return 'AI';
    case 'other': return 'Other';
    default: return 'Other';
  }
}
// Utility Functions
function highlightText(text, query) {
  const regex = new RegExp(`(${query})`, 'gi');
  return text.replace(regex, '<span class="search-highlight">$1</span>');
}



function getTimeAgo(date) {
  const seconds = Math.floor((new Date() - date) / 1000);
  let interval = Math.floor(seconds / 31536000);
  if (interval > 1) return `${interval} years ago`;
  if (interval === 1) return `1 year ago`;
  interval = Math.floor(seconds / 2592000);
  if (interval > 1) return `${interval} months ago`;
  if (interval === 1) return `1 month ago`;
  interval = Math.floor(seconds / 86400);
  if (interval > 1) return `${interval} days ago`;
  if (interval === 1) return `1 day ago`;
  interval = Math.floor(seconds / 3600);
  if (interval > 1) return `${interval} hours ago`;
  if (interval === 1) return `1 hour ago`;
  interval = Math.floor(seconds / 60);
  if (interval > 1) return `${interval} minutes ago`;
  if (interval === 1) return `1 minute ago`;
  return `${Math.floor(seconds)} seconds ago`;
}

function getRandomBackground() {
  const randomIndex = Math.floor(Math.random() * BACKGROUND_URLS.length);
  return BACKGROUND_URLS[randomIndex];
}

// Event Listeners
function setupEventListeners() {
  settingsToggle.addEventListener('click', toggleSettingsPanel);
  closeSettings.addEventListener('click', closeSettingsModal);
  darkModeToggle.addEventListener('change', toggleDarkMode);
  clockFormatSelect.addEventListener('change', updateClockFormat);
  backgroundOptions.forEach(option => option.addEventListener('click', selectBackground));
  customBgInput.addEventListener('change', uploadCustomBackground);
  addBookmarkBtn.addEventListener('click', openBookmarkModal);
  closeModal.addEventListener('click', closeBookmarkModal);
  saveBookmarkBtn.addEventListener('click', addBookmark);
  timeZoneSelect.addEventListener('change', updateTimeZone);
  showSecondsToggle.addEventListener('change', toggleShowSeconds);
  tempUnitToggle.addEventListener('change', updateTemperatureUnit);
  githubUsernameInput.addEventListener('change', updateGitHubUsername);
  refreshGitHubBtn.addEventListener('click', refreshGitHubActivity);
  searchBookmarks.addEventListener('input', filterBookmarks);
  bookmarksTabs.forEach(tab => tab.addEventListener('click', switchBookmarkTab));
  addBookmarkFolder.addEventListener('click', openFolderModal);
  closeFolderModalBtn.addEventListener('click', closeFolderModal);
  saveFolderBtn.addEventListener('click', saveFolder);
  searchForm.addEventListener('submit', handleSearch);
  searchEngineButton.addEventListener('click', toggleSearchEngineDropdown);
  searchEngineOptions.forEach(option => option.addEventListener('click', selectSearchEngine));
  defaultSearchEngineSelect.addEventListener('change', updateDefaultSearchEngine);
  openInNewTabToggle.addEventListener('change', toggleOpenInNewTab);
  weatherWidgetToggle.addEventListener('change', toggleWeatherWidget);
  bookmarksToggle.addEventListener('change', toggleBookmarks);
  devPanelToggleSwitch.addEventListener('change', toggleDevPanel);
  terminalNotesToggle.addEventListener('change', toggleTerminalNotes);
  timerStart.addEventListener('click', startTimer);
  timerReset.addEventListener('click', resetTimer);
  pomodoroMode.addEventListener('click', switchToPomodoro);
  breakMode.addEventListener('click', switchToBreak);
  terminalToggle.addEventListener('click', toggleTerminalVisibility);
  terminalInput.addEventListener('keydown', getTerminalFunctionality);
  overlay.addEventListener('click', closeModals);
  devPanelHeaderToggle.addEventListener('click', toggleDevPanelHeader);

  // ? load icon click
  // Icon selection in bookmark modal
iconOptions.forEach(option => {
  option.addEventListener('click', function() {
    // Remove selected class from all options
    iconOptions.forEach(opt => opt.classList.remove('selected'));

    // Add selected class to clicked option
    this.classList.add('selected');

    // Update the icon input with the selected icon (HTML content)
    const icon = this.querySelector('i').className;
    document.getElementById('bookmarkIcon').value = icon;
    document.getElementById('bookmarkIcon').dataset.isHtml = "true";
  });
});
}


function toggleDevPanelHeader() {
  devPanel.classList.toggle('collapsed');
  devPanelHeaderToggle.classList.toggle('collapsed');
  githubActivity.classList.toggle('hidden');
  if (githubActivity.classList.contains('hidden')) {
    devPanelHeaderToggle.innerHTML = '<i class="fas fa-chevron-down"></i>';
    devPanel.classList.add('collapsed');
  } else {
    devPanelHeaderToggle.innerHTML = '<i class="fas fa-chevron-up"></i>';
    devPanel.classList.remove('collapsed');
  }

  // if (githubActivity.classList.contains('hidden')) {
  //     devPanelHeaderToggle.innerHTML = '<i class="fas fa-chevron-down"></i>';
  //     devPanel.classList.add('collapsed');
  //   } else {
  //     devPanelHeaderToggle.innerHTML = '<i class="fas fa-chevron-up"></i>';
  //     devPanel.classList.remove('collapsed');
  //   }
}




// Settings Functions
function loadSettings() {
  chrome.storage.sync.get(['settings', 'bookmarks', 'folders'], function(data) {
    const settings = data.settings || DEFAULT_SETTINGS;
    const bookmarks = data.bookmarks || DEFAULT_BOOKMARKS;
    const folders = data.folders || DEFAULT_FOLDERS;
    applySettings(settings);
    renderBookmarks(bookmarks, folders);
  });
}

function saveSettings(settings) {
  chrome.storage.sync.set({ settings: settings });
}

function applySettings(settings) {
  if (settings.darkMode) {
    document.body.classList.remove('light-mode');
    darkModeToggle.checked = true;
  } else {
    document.body.classList.add('light-mode');
    darkModeToggle.checked = false;
  }

  clockFormatSelect.value = settings.clockFormat;
  document.body.style.backgroundImage = `url('${settings.background}')`;
  if (settings.background === 'custom' && settings.customBackground) {
    document.body.style.backgroundImage = `url('${settings.customBackground}')`;
  }

  backgroundOptions.forEach(option => {
    if (option.getAttribute('data-bg') === settings.background) {
      option.classList.add('active');
    } else {
      option.classList.remove('active');
    }
  });

  timeZoneSelect.value = settings.timeZone || 'local';
  showSecondsToggle.checked = settings.showSeconds;
  tempUnitToggle.checked = settings.useFahrenheit;
  githubUsernameInput.value = settings.githubUsername;
  weatherWidgetToggle.checked = settings.showWeatherWidget;
  bookmarksToggle.checked = settings.showBookmarks;
  devPanelToggleSwitch.checked = settings.showDevPanel;
  terminalNotesToggle.checked = settings.showTerminalNotes;
  defaultSearchEngineSelect.value = settings.defaultSearchEngine;
  openInNewTabToggle.checked = settings.openSearchInNewTab;
  updateSearchEngineIcon(settings.defaultSearchEngine);

  // Apply show seconds setting
  if (settings.hasOwnProperty('showSeconds')) {
    showSecondsToggle.checked = settings.showSeconds;

    // Toggle visibility of seconds in the clock
    const secondsElement = document.querySelector('.seconds');
    const secondsSeparator = document.querySelectorAll('.time-separator')[1];

    if (secondsElement && secondsSeparator) {
      if (settings.showSeconds) {
        secondsElement.style.display = 'inline-block';
        secondsSeparator.style.display = 'inline-block';
      } else {
        secondsElement.style.display = 'none';
        secondsSeparator.style.display = 'none';
      }
    }
  }

  // Ensure visibility settings are applied immediately
  document.querySelector('.weather-widget').style.display = settings.showWeatherWidget ? 'flex' : 'none';
  document.querySelector('.bookmarks-container').style.display = settings.showBookmarks ? 'block' : 'none';
  document.getElementById('devPanel').style.display = settings.showDevPanel ? 'block' : 'none';
  document.getElementById('terminalNotes').style.display = settings.showTerminalNotes ? 'block' : 'none';
}

function updateSearchEngineIcon(engine) {
  const engineData = {
    google: 'https://www.google.com/favicon.ico',
    duckduckgo: 'https://www.duckduckgo.com/favicon.ico',
    bing: 'https://www.bing.com/favicon.ico',
    yahoo: 'https://www.yahoo.com/favicon.ico'
  };
  const iconUrl = engineData[engine] || 'https://www.google.com/favicon.ico';
  searchEngineIcon.src = iconUrl;
  searchEngineIcon.setAttribute('data-engine', engine);
  searchEngineIcon.setAttribute('data-icon', iconUrl);
  searchEngineIcon.setAttribute('alt', engine.charAt(0).toUpperCase() + engine.slice(1));
}

// Bookmark Functions
function renderBookmarks(bookmarks = [], folders = [], filter = '') {
  bookmarksContainer.innerHTML = '';
  bookmarks = Array.isArray(bookmarks) ? bookmarks : [];
  folders = Array.isArray(folders) ? folders : [];
  const activeTab = document.querySelector('.bookmarks-tabs .tab.active');
  const activeCategory = activeTab ? activeTab.dataset.category : 'all';
  let filteredBookmarks = bookmarks;

  if (filter) {
    filteredBookmarks = bookmarks.filter(bookmark =>
      bookmark.title.toLowerCase().includes(filter.toLowerCase()) ||
      bookmark.url.toLowerCase().includes(filter.toLowerCase())
    );
  }

  if (activeCategory !== 'all') {
    filteredBookmarks = filteredBookmarks.filter(bookmark => bookmark.category === activeCategory);
  }

  let filteredFolders = folders;

  if (filter) {
    filteredFolders = folders.filter(folder => {
      if (folder.name.toLowerCase().includes(filter.toLowerCase())) {
        return true;
      }
      return folder.items.some(item =>
        item.title.toLowerCase().includes(filter.toLowerCase()) ||
        (item.url && item.url.toLowerCase().includes(filter.toLowerCase()))
      );
    });
  }

  if (filteredFolders && activeCategory !== 'all') {
    filteredFolders = filteredFolders.filter(folder => folder.category === activeCategory);
  }

  filteredFolders.forEach(folder => {
    const folderEl = document.createElement('div');
    folderEl.className = 'bookmark-folder';
    folderEl.dataset.folderId = folder.id;

    const folderHeader = document.createElement('div');
    folderHeader.className = 'folder-header';
    folderHeader.addEventListener('click', () => toggleFolderContent(folder.id));

    const folderIcon = document.createElement('div');
    folderIcon.className = 'folder-icon';
    folderIcon.innerHTML = '<i class="fas fa-folder"></i>';
    folderIcon.style.backgroundColor = folder.color;

    const folderTitle = document.createElement('div');
    folderTitle.className = 'folder-title';
    folderTitle.textContent = folder.name;

    if (filter) {
      folderTitle.innerHTML = highlightText(folder.name, filter);
    }

    const folderActions = document.createElement('div');
    folderActions.className = 'folder-actions';

    const editAction = document.createElement('div');
    editAction.className = 'folder-action';
    editAction.innerHTML = '<i class="fas fa-edit"></i>';
    editAction.addEventListener('click', e => {
      e.stopPropagation();
      editFolder(folder.id);
    });

    const deleteAction = document.createElement('div');
    deleteAction.className = 'folder-action';
    deleteAction.innerHTML = '<i class="fas fa-trash-alt"></i>';
    deleteAction.addEventListener('click', e => {
      e.stopPropagation();
      deleteFolder(folder.id);
    });

    folderActions.appendChild(editAction);
    folderActions.appendChild(deleteAction);

    folderHeader.appendChild(folderIcon);
    folderHeader.appendChild(folderTitle);
    folderHeader.appendChild(folderActions);

    const folderContent = document.createElement('div');
    folderContent.className = 'folder-content';
    folderContent.dataset.folderId = folder.id;

    if (localStorage.getItem(`folder_${folder.id}_open`) === 'true') {
      folderContent.classList.add('open');
    }

    if (folder.items.length > 0) {
      folder.items.forEach((item, itemIndex) => {
        const bookmarkEl = createBookmarkElement(item, () => deleteBookmarkFromFolder(folder.id, itemIndex));
        if (filter && item.title.toLowerCase().includes(filter.toLowerCase())) {
          const titleEl = bookmarkEl.querySelector('.bookmark-title');
          titleEl.innerHTML = highlightText(item.title, filter);
        }
        folderContent.appendChild(bookmarkEl);
      });
    } else {
      const emptyEl = document.createElement('div');
      emptyEl.className = 'folder-empty';
      emptyEl.textContent = 'No bookmarks in this folder yet';
      folderContent.appendChild(emptyEl);
    }

    folderEl.appendChild(folderHeader);
    folderEl.appendChild(folderContent);

    bookmarksContainer.appendChild(folderEl);
  });

  filteredBookmarks.forEach((bookmark, index) => {
    const bookmarkEl = createBookmarkElement(bookmark, () => deleteBookmark(index));
    const categoryEl = document.createElement('div');
    categoryEl.className = 'bookmark-category';
    categoryEl.textContent = getCategoryLabel(bookmark.category);
    bookmarkEl.appendChild(categoryEl);
    if (filter && bookmark.title.toLowerCase().includes(filter.toLowerCase())) {
      const titleEl = bookmarkEl.querySelector('.bookmark-title');
      titleEl.innerHTML = highlightText(bookmark.title, filter);
    }
    bookmarksContainer.appendChild(bookmarkEl);
  });

  if (filteredBookmarks.length === 0 && filteredFolders.length === 0) {
    const noResultsEl = document.createElement('div');
    noResultsEl.className = 'no-results';
    noResultsEl.style.gridColumn = '1 / -1';
    noResultsEl.style.textAlign = 'center';
    noResultsEl.style.padding = '20px';
    noResultsEl.style.color = 'var(--text-secondary)';
    noResultsEl.innerHTML = filter
      ? `No results found for <strong>"${filter}"</strong>`
      : `No bookmarks in the <strong>${getCategoryLabel(activeCategory)}</strong> category`;
    bookmarksContainer.appendChild(noResultsEl);
  }
}


function createBookmarkElement(bookmark, deleteCallback) {
  const bookmarkEl = document.createElement('a');
  bookmarkEl.href = bookmark.url;
  bookmarkEl.className = 'bookmark-item';
  bookmarkEl.style.animationDelay = '0.1s';

  const iconEl = document.createElement('div');
  iconEl.className = 'bookmark-icon';

  // Function to set fallback icon
  const setFallbackIcon = () => {
    // Improved Font Awesome detection
    if (bookmark.iconIsHtml || (typeof bookmark.icon === 'string' && bookmark.icon.match(/fa[srb]? fa-\w+/))) {
      // For Font Awesome icons
      if (bookmark.icon.match(/fa[srb]? fa-\w+/)) {
        iconEl.innerHTML = `<i class="${bookmark.icon}"></i>`;
      } else {
        iconEl.innerHTML = bookmark.icon;
      }
    } else {
      // For text/emoji icons
      iconEl.textContent = bookmark.icon;
    }
    iconEl.style.backgroundColor = bookmark.color;
  };

  // Try to fetch favicon
  const faviconImg = document.createElement('img');
  faviconImg.src = `https://www.google.com/s2/favicons?domain=${encodeURIComponent(bookmark.url)}&sz=32`;
  faviconImg.alt = 'Favicon';
  faviconImg.classList.add('favicon');

  faviconImg.onload = () => {
    // If favicon loads successfully, use it
    iconEl.innerHTML = '';
    iconEl.appendChild(faviconImg);
  };

  faviconImg.onerror = () => {
    // If favicon fails to load, use fallback icon
    setFallbackIcon();
  };

  // Initially set fallback icon in case favicon doesn't load immediately
  setFallbackIcon();

  const titleEl = document.createElement('div');
  titleEl.className = 'bookmark-title';
  titleEl.textContent = bookmark.title;

  const deleteBtn = document.createElement('div');
  deleteBtn.className = 'bookmark-delete';
  deleteBtn.innerHTML = '<i class="fas fa-times"></i>';
  deleteBtn.addEventListener('click', e => {
    e.preventDefault();
    deleteCallback();
  });

  bookmarkEl.appendChild(iconEl);
  bookmarkEl.appendChild(titleEl);
  bookmarkEl.appendChild(deleteBtn);

  return bookmarkEl;
}


function toggleFolderContent(folderId) {
  const folderContent = document.querySelector(`.folder-content[data-folder-id="${folderId}"]`);
  const folderHeader = document.querySelector(`.bookmark-folder[data-folder-id="${folderId}"] .folder-header`);

  if (folderContent && folderHeader) {
    folderContent.classList.toggle('open');
    if (folderContent.classList.contains('open')) {
      folderHeader.querySelector('.folder-icon i').className = 'fas fa-folder-open';
      localStorage.setItem(`folder_${folderId}_open`, 'true');
    } else {
      folderHeader.querySelector('.folder-icon i').className = 'fas fa-folder';
      localStorage.setItem(`folder_${folderId}_open`, 'false');
    }
  }
}

function deleteBookmarkFromFolder(folderId, itemIndex) {
  chrome.storage.sync.get(['folders'], function(data) {
    const folders = data.folders || DEFAULT_FOLDERS;
    const folderIndex = folders.findIndex(f => f.id === folderId);
    if (folderIndex !== -1) {
      folders[folderIndex].items.splice(itemIndex, 1);
      chrome.storage.sync.set({ folders: folders });
      renderBookmarks(data.bookmarks || DEFAULT_BOOKMARKS, folders, searchBookmarks.value);
    }
  });
}

function deleteBookmark(index) {
  chrome.storage.sync.get(['bookmarks', 'folders'], function(data) {
    const bookmarks = data.bookmarks || DEFAULT_BOOKMARKS;
    const folders = data.folders || DEFAULT_FOLDERS;
    bookmarks.splice(index, 1);
    saveBookmarks(bookmarks);
    renderBookmarks(bookmarks, folders, searchBookmarks ? searchBookmarks.value : '');
  });
}

// Function to save bookmarks to storage
function saveBookmarks(bookmarks) {
  chrome.storage.sync.set({ bookmarks: bookmarks });
}



function editFolder(folderId) {
  chrome.storage.sync.get(['folders'], function(data) {
    const folders = data.folders || DEFAULT_FOLDERS;
    const folder = folders.find(f => f.id === folderId);
    if (folder) {
      document.getElementById('folderName').value = folder.name;
      document.getElementById('folderColor').value = folder.color;
      document.getElementById('folderCategory').value = folder.category;
      document.getElementById('saveFolder').dataset.editId = folderId;
      openFolderModal();
    }
  });
}

function deleteFolder(folderId) {
  if (confirm('Are you sure you want to delete this folder?')) {
    chrome.storage.sync.get(['folders'], function(data) {
      const folders = data.folders || DEFAULT_FOLDERS;
      const updatedFolders = folders.filter(f => f.id !== folderId);
      chrome.storage.sync.set({ folders: updatedFolders });
      chrome.storage.sync.get(['bookmarks'], function(bookmarkData) {
        renderBookmarks(bookmarkData.bookmarks || DEFAULT_BOOKMARKS, updatedFolders, searchBookmarks.value);
      });
    });
  }
}

function addBookmark() {
  const title = document.getElementById('bookmarkTitle').value.trim();
  const url = document.getElementById('bookmarkUrl').value.trim();
  const icon = document.getElementById('bookmarkIcon').value.trim();
  const iconIsHtml = document.getElementById('bookmarkIcon').dataset.isHtml === "true";
  const color = document.getElementById('bookmarkColor').value;
  const category = document.getElementById('bookmarkCategory').value;
  const folderId = document.getElementById('bookmarkFolder').value;

  if (!title || !url) {
    alert('Title and URL are required');
    return;
  }

  let formattedUrl = url;
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    formattedUrl = 'https://' + url;
  }

  const newBookmark = {
    title: title,
    url: formattedUrl,
    icon: icon || title.charAt(0),
    iconIsHtml: iconIsHtml,
    color: color,
    category: category || 'other'
  };

  if (folderId && folderId !== 'none') {
    chrome.storage.sync.get(['folders'], function(data) {
      const folders = data.folders || DEFAULT_FOLDERS;
      const folderIndex = folders.findIndex(f => f.id === folderId);
      if (folderIndex !== -1) {
        folders[folderIndex].items.push(newBookmark);
        chrome.storage.sync.set({ folders: folders });
        chrome.storage.sync.get(['bookmarks'], function(bookmarkData) {
          renderBookmarks(bookmarkData.bookmarks || DEFAULT_BOOKMARKS, folders, searchBookmarks.value);
        });
        closeBookmarkModal();
      }
    });
  } else {
    chrome.storage.sync.get(['bookmarks', 'folders'], function(data) {
      const bookmarks = data.bookmarks || DEFAULT_BOOKMARKS;
      bookmarks.push(newBookmark);
      chrome.storage.sync.set({ bookmarks: bookmarks });
      renderBookmarks(bookmarks, data.folders || DEFAULT_FOLDERS, searchBookmarks.value);
      closeBookmarkModal();
    });
  }
}

function openFolderModal() {
  folderModal.style.display = 'block';
  overlay.style.display = 'block';
  setTimeout(() => {
    overlay.classList.add('active');
    folderModal.classList.add('active');
    document.getElementById('folderName').focus();
  }, 10);
  if (!document.getElementById('saveFolder').dataset.editId) {
    document.getElementById('folderName').value = '';
    document.getElementById('folderColor').value = '#4285f4';
    document.getElementById('folderCategory').value = 'dev';
  }
}

function closeFolderModal() {
  folderModal.classList.remove('active');
  overlay.classList.remove('active');
  setTimeout(() => {
    folderModal.style.display = 'none';
    overlay.style.display = 'none';
    document.getElementById('saveFolder').dataset.editId = '';
  }, 300);
}

// toggleTerminalVisibility
function toggleTerminalVisibility() {
    terminalNotes.classList.toggle('active');
}

function saveFolder() {
  const folderName = document.getElementById('folderName').value.trim();
  const folderColor = document.getElementById('folderColor').value;
  const folderCategory = document.getElementById('folderCategory').value;
  const editId = document.getElementById('saveFolder').dataset.editId;

  if (!folderName) {
    alert('Folder name is required');
    return;
  }

  chrome.storage.sync.get(['folders'], function(data) {
    const folders = data.folders || DEFAULT_FOLDERS;
    if (editId) {
      const folderIndex = folders.findIndex(f => f.id === editId);
      if (folderIndex !== -1) {
        folders[folderIndex].name = folderName;
        folders[folderIndex].color = folderColor;
        folders[folderIndex].category = folderCategory;
      }
    } else {
      const newFolder = {
        id: 'folder_' + Date.now(),
        name: folderName,
        color: folderColor,
        category: folderCategory,
        items: []
      };
      folders.push(newFolder);
    }
    chrome.storage.sync.set({ folders: folders });
    closeFolderModal();
    chrome.storage.sync.get(['bookmarks'], function(bookmarkData) {
      renderBookmarks(bookmarkData.bookmarks || DEFAULT_BOOKMARKS, folders, searchBookmarks.value);
    });
  });
}

function openBookmarkModal() {
  bookmarkModal.style.display = 'block';
  overlay.style.display = 'block';
  setTimeout(() => {
    overlay.classList.add('active');
    bookmarkModal.classList.add('active');
    document.getElementById('bookmarkTitle').focus();
  }, 10);
  document.getElementById('bookmarkTitle').value = '';
  document.getElementById('bookmarkUrl').value = '';
  document.getElementById('bookmarkIcon').value = '';
  document.getElementById('bookmarkColor').value = '#4285f4';
  const folderSelect = document.getElementById('bookmarkFolder');
  folderSelect.innerHTML = '<option value="none">No folder</option>';
  chrome.storage.sync.get(['folders'], function(data) {
    const folders = data.folders || DEFAULT_FOLDERS;
    folders.forEach(folder => {
      const option = document.createElement('option');
      option.value = folder.id;
      option.textContent = folder.name;
      folderSelect.appendChild(option);
    });
  });
  document.getElementById('bookmarkCategory').value = 'other';
}

function closeBookmarkModal() {
  bookmarkModal.classList.remove('active');
  overlay.classList.remove('active');
  setTimeout(() => {
    bookmarkModal.style.display = 'none';
    overlay.style.display = 'none';
  }, 300);
}

function closeSettingsModal() {
  settingsPanel.classList.remove('active');
  overlay.classList.remove('active');
  //  also remove the overlay style
  setTimeout(() => {
    overlay.style.display = 'none';
  }, 300);
}

function closeModals() {
  if (settingsPanel.classList.contains('active')) {
    closeSettingsModal();
  }
  if (bookmarkModal.style.display === 'block') {
    closeBookmarkModal();
  }
  overlay.classList.remove('active');
  setTimeout(() => {
    overlay.style.display = 'none';
  }, 400);
}

function toggleSettingsPanel() {
  settingsPanel.classList.add('active');
  overlay.style.display = 'block';
  setTimeout(() => {
    overlay.classList.add('active');
  }, 10);
}

function toggleDarkMode() {
  chrome.storage.sync.get('settings', function(data) {
    const settings = data.settings || DEFAULT_SETTINGS;
    settings.darkMode = darkModeToggle.checked;
    saveSettings(settings);
    applySettings(settings);
  });
}

function updateClockFormat() {
  chrome.storage.sync.get('settings', function(data) {
    const settings = data.settings || DEFAULT_SETTINGS;
    settings.clockFormat = clockFormatSelect.value;
    saveSettings(settings);
    updateClock();
  });
}

function selectBackground() {
  const bg = this.getAttribute('data-bg');
  if (bg === 'custom') {
    customBgInput.click();
    return;
  }
  chrome.storage.sync.get('settings', function(data) {
    const settings = data.settings || DEFAULT_SETTINGS;
    if (bg === 'random') {
      settings.background = getRandomBackground();
    } else {
      settings.background = bg;
    }
    saveSettings(settings);
    applySettings(settings);
  });
}

function uploadCustomBackground() {
  if (this.files && this.files[0]) {
    const reader = new FileReader();
    reader.onload = function(e) {
      chrome.storage.sync.get('settings', function(data) {
        const settings = data.settings || DEFAULT_SETTINGS;
        settings.background = 'custom';
        settings.customBackground = e.target.result;
        saveSettings(settings);
        applySettings(settings);
      });
    }
    reader.readAsDataURL(this.files[0]);
  }
}

function updateTimeZone() {
  chrome.storage.sync.get('settings', function(data) {
    const settings = data.settings || DEFAULT_SETTINGS;
    settings.timeZone = timeZoneSelect.value;
    saveSettings(settings);
    updateClock();
  });
}

function toggleShowSeconds() {
  chrome.storage.sync.get('settings', function(data) {
    const settings = data.settings || DEFAULT_SETTINGS;
    settings.showSeconds = showSecondsToggle.checked;
    saveSettings(settings);
    applySettings(settings);
  });
}

function updateTemperatureUnit() {
    chrome.storage.sync.get('settings', function(data) {
    const settings = data.settings || DEFAULT_SETTINGS;
    settings.useFahrenheit = tempUnitToggle.checked;
    saveSettings(settings);

    // Update weather display with new temperature unit
    if(settings.showWeatherWidget) {
    getWeatherData();
    }
  });
}

function updateGitHubUsername() {
  chrome.storage.sync.get('settings', function(data) {
    const settings = data.settings || DEFAULT_SETTINGS;
    settings.githubUsername = githubUsernameInput.value;
    saveSettings(settings);
    fetchGitHubActivity(settings.githubUsername);
  });
}

function refreshGitHubActivity() {
  document.getElementById('refreshGitHub').classList.add('rotating');
  chrome.storage.sync.get('settings', function(data) {
    const settings = data.settings || DEFAULT_SETTINGS;
    fetchGitHubActivity(settings.githubUsername);
    setTimeout(() => {
      document.getElementById('refreshGitHub').classList.remove('rotating');
    }, 1000);
  });
}

function filterBookmarks() {
  const searchTerm = this.value.trim();
  chrome.storage.sync.get(['bookmarks', 'folders'], function(data) {
    renderBookmarks(data.bookmarks || DEFAULT_BOOKMARKS, data.folders || DEFAULT_FOLDERS, searchTerm);
  });
}

function switchBookmarkTab() {
  bookmarksTabs.forEach(tab => tab.classList.remove('active'));
  this.classList.add('active');
  localStorage.setItem('active_bookmarks_tab', this.dataset.category);
  chrome.storage.sync.get(['bookmarks', 'folders'], function(data) {
    renderBookmarks(data.bookmarks || DEFAULT_BOOKMARKS, data.folders || DEFAULT_FOLDERS, searchBookmarks.value);
  });
}

function handleSearch(e) {
  e.preventDefault();
  const query = searchInput.value.trim();

    const SEARCH_ENGINES = {
    google: 'https://www.google.com/search?q=',
    duckduckgo: 'https://www.duckduckgo.com/?q=',
    bing: 'https://www.bing.com/search?q=',
    yahoo: 'https://search.yahoo.com/search?p='
  };
  if (query) {
    chrome.storage.sync.get('settings', function(data) {
      const settings = data.settings || DEFAULT_SETTINGS;
      const currentSearchEngine = settings.defaultSearchEngine || 'google';
      const searchUrl = SEARCH_ENGINES[currentSearchEngine] + encodeURIComponent(query);
      if (settings.openSearchInNewTab) {
        window.open(searchUrl, '_blank');
      } else {
        window.location.href = searchUrl;
      }
      searchInput.value = '';
    });
  }
}

function toggleSearchEngineDropdown(e) {
  e.preventDefault();
  e.stopPropagation();
  searchEngineDropdown.classList.toggle('active');
}

function selectSearchEngine() {
  const engine = this.getAttribute('data-engine');
  const icon = this.getAttribute('data-icon');
  searchEngineIcon.src = icon;
  currentSearchEngine = engine;
  searchEngineOptions.forEach(opt => opt.classList.remove('selected'));
  this.classList.add('selected');
  searchEngineDropdown.classList.remove('active');
  chrome.storage.sync.get('settings', function(data) {
    const settings = data.settings || DEFAULT_SETTINGS;
    settings.defaultSearchEngine = engine;
    saveSettings(settings);
  });
}

function updateDefaultSearchEngine() {
  const engine = defaultSearchEngineSelect.value;
  currentSearchEngine = engine;
  updateSearchEngineIcon(engine);
  chrome.storage.sync.get('settings', function(data) {
    const settings = data.settings || DEFAULT_SETTINGS;
    settings.defaultSearchEngine = engine;
    saveSettings(settings);
  });
}

function toggleOpenInNewTab() {
  chrome.storage.sync.get('settings', function(data) {
    const settings = data.settings || DEFAULT_SETTINGS;
    settings.openSearchInNewTab = openInNewTabToggle.checked;
    saveSettings(settings);
  });
}

function toggleWeatherWidget() {
  chrome.storage.sync.get('settings', function(data) {
    const settings = data.settings || DEFAULT_SETTINGS;
    settings.showWeatherWidget = weatherWidgetToggle.checked;
    saveSettings(settings);
    const weatherWidget = document.querySelector('.weather-widget');
    if (weatherWidget) {
      weatherWidget.style.display = settings.showWeatherWidget ? 'flex' : 'none';
    }
  });
}

function toggleBookmarks() {
  chrome.storage.sync.get('settings', function(data) {
    const settings = data.settings || DEFAULT_SETTINGS;
    settings.showBookmarks = bookmarksToggle.checked;
    saveSettings(settings);
    const bookmarksContainer = document.querySelector('.bookmarks-container');
    if (bookmarksContainer) {
      bookmarksContainer.style.display = settings.showBookmarks ? 'block' : 'none';
    }
  });
}

function toggleDevPanel() {
  chrome.storage.sync.get('settings', function(data) {
    const settings = data.settings || DEFAULT_SETTINGS;
    settings.showDevPanel = devPanelToggleSwitch.checked;
    saveSettings(settings);
    const devPanel = document.getElementById('devPanel');
    if (devPanel) {
      devPanel.style.display = settings.showDevPanel ? 'block' : 'none';
    }
  });
}

function toggleTerminalNotes() {
  chrome.storage.sync.get('settings', function(data) {
    const settings = data.settings || DEFAULT_SETTINGS;
    settings.showTerminalNotes = terminalNotesToggle.checked;
    saveSettings(settings);
    const terminalNotes = document.getElementById('terminalNotes');
    if (terminalNotes) {
      terminalNotes.style.display = settings.showTerminalNotes ? 'block' : 'none';
    }
  });
}

function initializeClock() {
  if (!clockElement.innerHTML.trim()) {
    clockElement.innerHTML = `
      <span class="time-part hours">00</span>
      <span class="time-separator">:</span>
      <span class="time-part minutes">00</span>
      <span class="time-separator">:</span>
      <span class="time-part seconds">00</span>
      <span class="ampm"></span>
    `;
  }
}

function updateClock() {
  const now = new Date();
  chrome.storage.sync.get('settings', function(data) {
    const settings = data.settings || DEFAULT_SETTINGS;
    const format = settings.clockFormat;
    const timeZoneSetting = settings.timeZone || 'local';
    let timeToShow = now;

    if (timeZoneSetting !== 'local') {
      const timeZoneOffsets = {
        'UTC': 0,
        'EST': -5,
        'PST': -8,
        'JST': 9,
        'GMT': 0
      };
      const utcTime = now.getTime() + (now.getTimezoneOffset() * 60000);
      timeToShow = new Date(utcTime + (3600000 * timeZoneOffsets[timeZoneSetting]));
    }

    let hours = timeToShow.getHours();
    let ampm = '';

    if (format === '12') {
      ampm = hours >= 12 ? ' PM' : ' AM';
      hours = hours % 12;
      hours = hours ? hours : 12;
    }

    const hoursStr = hours.toString().padStart(2, '0');
    const minutes = timeToShow.getMinutes().toString().padStart(2, '0');
    const seconds = timeToShow.getSeconds().toString().padStart(2, '0');

    const hoursElement = document.querySelector('.hours');
    const minutesElement = document.querySelector('.minutes');
    const secondsElement = document.querySelector('.seconds');
    const ampmElement = document.querySelector('.ampm');

    if (hoursElement.textContent !== hoursStr) {
      hoursElement.classList.add('counting');
      setTimeout(() => {
        hoursElement.textContent = hoursStr;
        hoursElement.classList.remove('counting');
        hoursElement.classList.add('changing');
        setTimeout(() => hoursElement.classList.remove('changing'), 400);
      }, 200);
    }

    if (minutesElement.textContent !== minutes) {
      minutesElement.classList.add('counting');
      setTimeout(() => {
        minutesElement.textContent = minutes;
        minutesElement.classList.remove('counting');
        minutesElement.classList.add('changing');
        setTimeout(() => minutesElement.classList.remove('changing'), 400);
      }, 200);
    }

    if (secondsElement.textContent !== seconds) {
      secondsElement.classList.add('counting');
      setTimeout(() => {
        secondsElement.textContent = seconds;
        secondsElement.classList.remove('counting');
        secondsElement.classList.add('changing');
        setTimeout(() => secondsElement.classList.remove('changing'), 400);
      }, 400);
    }

    if (ampmElement) {
      ampmElement.textContent = ampm;
    }
  });
}

// async function fetchTechNews() {
//   const apiKey = 'e0aa6c2966654e288b1202437230e4d2';
//   const url = `https://newsapi.org/v2/top-headlines?sources=hacker-news,ars-technica,techcrunch&apiKey=${apiKey}`;

//   try {
//     const response = await fetch(url);
//     if (!response.ok) {
//       throw new Error(`News API Error: ${response.status}`);
//     }
//     const data = await response.json();
//     let newsPanel = document.getElementById('techNewsPanel');
//     if (!newsPanel) {
//       newsPanel = document.createElement('div');
//       newsPanel.className = 'tech-news-panel';
//       newsPanel.id = 'techNewsPanel';
//       document.body.appendChild(newsPanel);
//       newsPanel.innerHTML = `
//         <div class="news-panel-header">
//           <h3><i class="fas fa-newspaper"></i> Tech News</h3>
//           <button class="news-panel-toggle">
//             <i class="fas fa-times"></i>
//           </button>
//         </div>
//         <div class="news-content" id="newsContent"></div>
//       `;
//       const closeBtn = newsPanel.querySelector('.news-panel-toggle');
//       closeBtn.addEventListener('click', function() {
//         newsPanel.classList.add('hidden');
//       });
//     }
//     const newsContent = document.getElementById('newsContent');
//     newsContent.innerHTML = '';
//     data.articles.slice(0, 5).forEach(article => {
//       const newsItem = document.createElement('a');
//       newsItem.href = article.url;
//       newsItem.target = '_blank';
//       newsItem.className = 'news-item';
//       newsItem.innerHTML = `
//         <div class="news-title">${article.title}</div>
//         <div class="news-source">${article.source.name}</div>
//       `;
//       newsContent.appendChild(newsItem);
//     });
//   } catch (error) {
//     console.error('Error fetching tech news:', error);
//   }
// }

async function fetchGitHubActivity(username) {
  if (!username || username.trim() === '') {
    githubActivity.innerHTML = `<div class="no-activity">Please enter a valid GitHub username</div>`;
    return;
  }

  try {
    githubActivity.innerHTML = '<div class="loading">Loading commits...</div>';
    const response = await fetch(`https://api.github.com/users/${username}/events/public`);
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`Username '${username}' not found`);
      } else if (response.status === 403) {
        throw new Error(`API rate limit exceeded. Try again later.`);
      } else {
        throw new Error(`GitHub API error: ${response.status}`);
      }
    }
    const events = await response.json();
    const commitEvents = events.filter(event =>
      event.type === "PushEvent" ||
      event.type === "CommitCommentEvent" ||
      event.type === "CreateEvent"
    ).slice(0, 5);

    if (commitEvents.length === 0) {
      githubActivity.innerHTML = `<div class="no-activity">No recent GitHub activity found for ${username}</div>`;
      return;
    }

    githubActivity.innerHTML = '';
    commitEvents.forEach(event => {
      const eventDate = new Date(event.created_at);
      const timeAgo = getTimeAgo(eventDate);
      let message = '';
      let repo = event.repo.name;
      let eventType = '';

      if (event.type === "PushEvent" && event.payload.commits && event.payload.commits.length > 0) {
        message = event.payload.commits[0].message;
        eventType = 'Commit';
      } else if (event.type === "CreateEvent") {
        message = `Created ${event.payload.ref_type}: ${event.payload.ref || ''}`;
        eventType = 'Create';
      } else if (event.type === "CommitCommentEvent") {
        message = event.payload.comment.body.substring(0, 60) + '...';
        eventType = 'Comment';
      }

      const commitItem = document.createElement('div');
      commitItem.className = 'commit-item';
      commitItem.innerHTML = `
        <div class="commit-message">${message || 'No message'}</div>
        <div class="commit-repo">${repo} <span class="event-type">${eventType}</span></div>
        <div class="commit-time">${timeAgo}</div>
      `;
      githubActivity.appendChild(commitItem);
    });
  } catch (error) {
    console.error('Error fetching GitHub activity:', error);
    githubActivity.innerHTML = `<div class="error">Could not load GitHub activity: ${error.message}</div>`;
  }
}

function getWeatherData() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      position => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        const apiKey = 'a4ab361fb6db1ab8f8731476393027ad';
        const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;

        fetch(weatherUrl)
          .then(response => {
            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
          })
          .then(data => {
            displayWeather(data);
          })
          .catch(error => {
            console.error('Error fetching weather data:', error);
            displayWeatherError();
          });
      },
      error => {
        console.error('Geolocation error:', error);
        displayWeatherError();
      },
      { maximumAge: 600000, timeout: 10000 }
    );
  } else {
    console.error('Geolocation is not supported by this browser');
    displayWeatherError();
  }
}

function displayWeather(data) {
  let weatherWidget = document.querySelector('.weather-widget');
  if (!weatherWidget) {
    weatherWidget = document.createElement('div');
    weatherWidget.className = 'weather-widget';
    document.body.appendChild(weatherWidget);
  }

  try {
    const iconCode = data.weather[0].icon;
    let temp = Math.round(data.main.temp);
    const location = data.name;
    const description = data.weather[0].description;

    chrome.storage.sync.get('settings', function(data) {
      const settings = data.settings || DEFAULT_SETTINGS;
      const useFahrenheit = settings.useFahrenheit;
      let unit = '°C';
      if (useFahrenheit) {
        temp = Math.round((temp * 9/5) + 32);
        unit = '°F';
      }

      const iconMap = {
        '01d': 'fas fa-sun',
        '01n': 'fas fa-moon',
        '02d': 'fas fa-cloud-sun',
        '02n': 'fas fa-cloud-moon',
        '03d': 'fas fa-cloud',
        '03n': 'fas fa-cloud',
        '04d': 'fas fa-cloud',
        '04n': 'fas fa-cloud',
        '09d': 'fas fa-cloud-showers-heavy',
        '09n': 'fas fa-cloud-showers-heavy',
        '10d': 'fas fa-cloud-rain',
        '10n': 'fas fa-cloud-rain',
        '11d': 'fas fa-bolt',
        '11n': 'fas fa-bolt',
        '13d': 'fas fa-snowflake',
        '13n': 'fas fa-snowflake',
        '50d': 'fas fa-smog',
        '50n': 'fas fa-smog'
      };

      const weatherIcon = iconMap[iconCode] || 'fas fa-cloud';

      weatherWidget.innerHTML = `
        <div class="weather-icon">
          <i class="${weatherIcon}"></i>
        </div>
        <div class="weather-info">
          <div class="weather-temp">${temp}${unit}</div>
          <div class="weather-location">${location}</div>
          <div class="weather-desc">${description}</div>
        </div>
      `;
    });
  } catch (error) {
    console.error('Error displaying weather:', error);
    displayWeatherError();
  }
}

function displayWeatherError() {
  let weatherWidget = document.querySelector('.weather-widget');
  if (!weatherWidget) {
    weatherWidget = document.createElement('div');
    weatherWidget.className = 'weather-widget';
    document.body.appendChild(weatherWidget);
  }

  chrome.storage.sync.get('settings', function(data) {
    const settings = data.settings || DEFAULT_SETTINGS;
    const unit = settings.useFahrenheit ? '°F' : '°C';

    weatherWidget.innerHTML = `
      <div class="weather-icon">
        <i class="fas fa-cloud"></i>
      </div>
      <div class="weather-info">
        <div class="weather-temp">--${unit}</div>
        <div class="weather-location">Weather unavailable</div>
      </div>
    `;
  });
}

// Request notification permission
function requestNotificationPermission() {
    if (!("Notification" in window)) {
        console.warn("This browser does not support desktop notifications");
        return false;
    }

    if (Notification.permission !== "granted") {
        Notification.requestPermission().then(permission => {
            if (permission === "granted") {
                console.log("Notification permission granted");
            }
        });
        return false;
    }
    return true;
}

function startTimer() {
  if (!requestNotificationPermission()) return;
  if (timerRunning) {
    clearInterval(timerInterval);
    timerRunning = false;
    timerStart.innerHTML = '<i class="fas fa-play"></i>';
    return;
  }

  timerRunning = true;
  timerStart.innerHTML = '<i class="fas fa-pause"></i>';

  timerInterval = setInterval(() => {
    if (timeLeft > 0) {
      timeLeft--;
      updateTimerDisplay();
    } else {
      clearInterval(timerInterval);
      timerRunning = false;
      timerStart.innerHTML = '<i class="fas fa-play"></i>';

      if (Notification.permission === "granted") {
        const title = timerMode === 'pomodoro'
          ? "Pomodoro Complete! Take a break"
          : "Break Complete! Back to work";

        new Notification(title, {
          icon: "https://example.com/icon.png",
          body: timerMode === 'pomodoro'
            ? "Time to take a short break"
            : "Time to focus again"
        });
      }

      if (timerMode === 'pomodoro') {
        switchToBreak();
      } else {
        switchToPomodoro();
      }
    }
  }, 1000);
}

function resetTimer() {
  clearInterval(timerInterval);
  timerRunning = false;
  timerStart.innerHTML = '<i class="fas fa-play"></i>';
  timeLeft = timerMode === 'pomodoro' ? 25 * 60 : 5 * 60;
  updateTimerDisplay();
}

function switchToPomodoro() {
  timerMode = 'pomodoro';
  pomodoroMode.classList.add('active');
  breakMode.classList.remove('active');
  timeLeft = 25 * 60;
  updateTimerDisplay();
  if (timerRunning) {
    clearInterval(timerInterval);
    startTimer();
  }
}

function switchToBreak() {
  timerMode = 'break';
  breakMode.classList.add('active');
  pomodoroMode.classList.remove('active');
  timeLeft = 5 * 60;
  updateTimerDisplay();
  if (timerRunning) {
    clearInterval(timerInterval);
    startTimer();
  }
}

function updateTimerDisplay() {
  const minutes = Math.floor(timeLeft / 60).toString().padStart(2, '0');
  const seconds = (timeLeft % 60).toString().padStart(2, '0');
  timerDisplay.textContent = `${minutes}:${seconds}`;
  if (timerRunning) {
    document.title = `${minutes}:${seconds} - Developer Workspace`;
  } else {
    document.title = `Developer Workspace`;
  }
}

function loadNotes() {
  chrome.storage.sync.get('devNotes', function(data) {
    if (data.devNotes) {
      notes = data.devNotes;
      renderNotes();
    }
  });
}

function saveNotes() {
  chrome.storage.sync.set({ devNotes: notes });
}

function renderNotes() {
  terminalOutput.innerHTML = '';
  notes.forEach((note, index) => {
    const noteElement = document.createElement('div');
    noteElement.className = 'terminal-line';
    noteElement.innerHTML = `
      <span class="note-index">[${index + 1}]</span>
      <span class="note-content">${formatNoteText(note.content)}</span>
      <span class="note-time">${formatNoteDate(note.timestamp)}</span>
      <span class="note-delete" data-index="${index}">
        <i class="fas fa-times"></i>
      </span>
    `;
    terminalOutput.appendChild(noteElement);
  });

  document.querySelectorAll('.note-delete').forEach(btn => {
    btn.addEventListener('click', function() {
      const index = parseInt(this.getAttribute('data-index'));
      notes.splice(index, 1);
      saveNotes();
      renderNotes();
    });
  });
}

function formatNoteText(text) {
  text = text.replace(/`([^`]+)`/g, '<code>$1</code>');
  text = text.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank">$1</a>');
  return text;
}

function formatNoteDate(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleString();
}

function addNote(content) {
  const note = {
    content,
    timestamp: Date.now()
  };
  notes.unshift(note);
  saveNotes();
  renderNotes();
}

function getTerminalFunctionality(e) {
  if (e.key === 'Enter') {
      e.preventDefault();
      const command = terminalInput.textContent.trim();

      if (command) {
        handleTerminalCommand(command);
        terminalInput.textContent = '';
      }
    }
}

function handleTerminalCommand(command) {
  if (command.toLowerCase() === 'clear') {
    notes = [];
    saveNotes();
    renderNotes();
    return;
  }

  if (command.toLowerCase() === 'help') {
    addNote(`Available commands:
    - clear: Clear all notes
    - help: Show this help
    - Any other text will be saved as a note`);
    return;
  }

  addNote(command);
}

function startAutoRotate() {
  autoRotateInterval = setInterval(() => {
    chrome.storage.sync.get('settings', function(data) {
      const settings = data.settings || DEFAULT_SETTINGS;
      if (settings.autoRotateBackgrounds) {
        const randomBg = getRandomBackground();
        settings.background = randomBg;
        saveSettings(settings);
        applySettings(settings);
      }
    });
  }, 30 * 60 * 1000);
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
  setupEventListeners();
  loadSettings();
  initializeClock();
  updateClock();
  setInterval(updateClock, 1000);
  chrome.storage.sync.get('settings', function(data) {
    const settings = data.settings || DEFAULT_SETTINGS;
    if (settings.showWeatherWidget) {
      getWeatherData();
      setInterval(getWeatherData, 30 * 60 * 1000);
    }
    fetchGitHubActivity(settings.githubUsername || 'github');
    if (settings.autoRotateBackgrounds) {
      startAutoRotate();
    }
  });

  loadNotes();
  updateTimerDisplay();
});
