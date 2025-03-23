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

// New DOM elements
const timeZoneSelect = document.getElementById('timeZone');
const showSecondsToggle = document.getElementById('showSeconds');
const iconOptions = document.querySelectorAll('.icon-option');
const tempUnitToggle = document.getElementById('tempUnitToggle');

// Get the GitHub username input element
const githubUsernameInput = document.getElementById('githubUsername');
const refreshGitHubBtn = document.getElementById('refreshGitHub');

// Add these new DOM elements
const searchBookmarks = document.getElementById('searchBookmarks');
const bookmarksTabs = document.querySelectorAll('.bookmarks-tabs .tab');
const addBookmarkFolder = document.getElementById('addBookmarkFolder');
const folderModal = document.getElementById('folderModal');
const closeFolderModal = document.getElementById('closeFolderModal');
const saveFolderBtn = document.getElementById('saveFolder');

// Add these DOM elements at the top with other DOM elements
const searchForm = document.getElementById('searchForm');
const searchInput = document.getElementById('searchInput');
const searchEngineButton = document.getElementById('searchEngineButton');
const searchEngineIcon = document.getElementById('searchEngineIcon');
const searchEngineDropdown = document.getElementById('searchEngineDropdown');
const searchEngineOptions = document.querySelectorAll('.search-engine-option');
const defaultSearchEngineSelect = document.getElementById('defaultSearchEngine');
const openInNewTabToggle = document.getElementById('openInNewTab');
const settingsModal = document.getElementById('settingsPanel');

// Default settings
const defaultSettings = {
  darkMode: true,
  clockFormat: '24',
  background: 'https://images.unsplash.com/photo-1572270907014-c31da1c54124?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2089&q=80',
  customBackground: null,
  timeZone: 'local',
  showSeconds: true,
  useFahrenheit: false,
  githubUsername: 'github', // Add default GitHub username
  autoRotateBackgrounds: false, // Add default auto-rotate setting
  showWeatherWidget: true,
  showBookmarks: true,
  showDevPanel: true,
  showTerminalNotes: true,
  defaultSearchEngine: 'google',
  openSearchInNewTab: true
};

// Default bookmarks
const defaultBookmarks = [
  { title: 'Google', url: 'https://www.google.com', icon: 'G', color: '#4285f4', category: 'other' },
  { title: 'YouTube', url: 'https://www.youtube.com', icon: 'Y', color: '#FF0000', category: 'social' },
  { title: 'Gmail', url: 'https://mail.google.com', icon: 'M', color: '#D44638', category: 'prod' },
  { title: 'GitHub', url: 'https://www.github.com', icon: 'GH', color: '#333333', category: 'dev' },
  { title: 'Stack Overflow', url: 'https://stackoverflow.com', icon: 'SO', color: '#F48024', category: 'dev' },
  { title: 'VSCode', url: 'https://vscode.dev', icon: '<i class="fas fa-code"></i>', color: '#007ACC', iconIsHtml: true, category: 'dev' }
];

// Add a sample folder
const defaultFolders = [
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
  }
];

// Function to load settings from storage
function loadSettings() {
  chrome.storage.sync.get(['settings', 'bookmarks', 'folders'], function(data) {
    const settings = data.settings || defaultSettings;
    const bookmarks = data.bookmarks || defaultBookmarks;
    const folders = data.folders || defaultFolders;

    // Apply settings
    applySettings(settings);

    // Load bookmarks with folders
    renderBookmarks(bookmarks, folders);
  });
}

// Function to save settings to storage
function saveSettings(settings) {
  chrome.storage.sync.set({ settings: settings });
}

// Function to save bookmarks to storage
function saveBookmarks(bookmarks) {
  chrome.storage.sync.set({ bookmarks: bookmarks });
}

// Apply settings to the UI
function applySettings(settings) {
  // Apply dark/light mode
  if (settings.darkMode) {
    document.body.classList.remove('light-mode');
    darkModeToggle.checked = true;
  } else {
    document.body.classList.add('light-mode');
    darkModeToggle.checked = false;
  }

  // Set clock format
  clockFormatSelect.value = settings.clockFormat;

  // Set background
  document.body.style.backgroundImage = `url('${settings.background}')`;
  if (settings.background === 'custom' && settings.customBackground) {
    document.body.style.backgroundImage = `url('${settings.customBackground}')`;
  }

  // Highlight active background option
  backgroundOptions.forEach(option => {
    if (option.getAttribute('data-bg') === settings.background) {
      option.classList.add('active');
    } else {
      option.classList.remove('active');
    }
  });

  // Apply time zone setting
  timeZoneSelect.value = settings.timeZone || 'local';

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

  // Apply temperature unit setting
  if (settings.hasOwnProperty('useFahrenheit')) {
    tempUnitToggle.checked = settings.useFahrenheit;
  }

  // Set GitHub username
  if (settings.githubUsername) {
    githubUsernameInput.value = settings.githubUsername;
  }

  // Apply component visibility settings
  const weatherWidget = document.querySelector('.weather-widget');
  if (weatherWidget) {
    if (settings.hasOwnProperty('showWeatherWidget')) {
      weatherWidget.style.display = settings.showWeatherWidget ? 'flex' : 'none';
      weatherWidgetToggle.checked = settings.showWeatherWidget;
    }
  }

  const bookmarksContainer = document.querySelector('.bookmarks-container');
  if (bookmarksContainer) {
    if (settings.hasOwnProperty('showBookmarks')) {
      bookmarksContainer.style.display = settings.showBookmarks ? 'block' : 'none';
      bookmarksToggle.checked = settings.showBookmarks;
    }
  }

  const devPanel = document.getElementById('devPanel');
  if (devPanel) {
    if (settings.hasOwnProperty('showDevPanel')) {
      devPanel.style.display = settings.showDevPanel ? 'block' : 'none';
      devPanelToggleSwitch.checked = settings.showDevPanel;
    }
  }

  const terminalNotes = document.getElementById('terminalNotes');
  if (terminalNotes) {
    if (settings.hasOwnProperty('showTerminalNotes')) {
      terminalNotes.style.display = settings.showTerminalNotes ? 'block' : 'none';
      terminalNotesToggle.checked = settings.showTerminalNotes;
    }
  }

  // Apply search engine setting
  if (settings.defaultSearchEngine) {
    currentSearchEngine = settings.defaultSearchEngine;
    defaultSearchEngineSelect.value = settings.defaultSearchEngine;
    updateSearchEngineIcon(settings.defaultSearchEngine);
  }

  // Apply open in new tab setting
  if (settings.hasOwnProperty('openSearchInNewTab')) {
    openInNewTabToggle.checked = settings.openSearchInNewTab;
  }
}

// Update your clock function with the counting effect animation

function updateClock() {
  const now = new Date();

  // Get references to the time elements
  const hoursElement = document.querySelector('.hours');
  const minutesElement = document.querySelector('.minutes');
  const secondsElement = document.querySelector('.seconds');

  // Get current settings
  chrome.storage.sync.get('settings', function(data) {
    const settings = data.settings || defaultSettings;
    const format = settings.clockFormat;
    const timeZoneSetting = settings.timeZone || 'local';

    // Apply time zone adjustment
    let timeToShow = now;

    if (timeZoneSetting !== 'local') {
      const timeZoneOffsets = {
        'UTC': 0,
        'EST': -5,
        'PST': -8,
        'JST': 9,
        'GMT': 0
      };

      // Create a new date with the appropriate time zone offset
      const utcTime = now.getTime() + (now.getTimezoneOffset() * 60000);
      timeToShow = new Date(utcTime + (3600000 * timeZoneOffsets[timeZoneSetting]));
    }

    // Update time based on format (12h or 24h)
    let hours = timeToShow.getHours();
    let ampm = '';

    if (format === '12') {
      ampm = hours >= 12 ? ' PM' : ' AM';
      hours = hours % 12;
      hours = hours ? hours : 12; // Convert 0 to 12
    }

    const hoursStr = hours.toString().padStart(2, '0');
    const minutes = timeToShow.getMinutes().toString().padStart(2, '0');
    const seconds = timeToShow.getSeconds().toString().padStart(2, '0');

    // Check if time has changed and apply animations
    if (hoursElement.textContent !== hoursStr) {
      // Apply counting effect first
      hoursElement.classList.add('counting');

      // Set the new content after a small delay (middle of animation)
      setTimeout(() => {
        hoursElement.textContent = hoursStr;
        // Remove counting and add changing after text is updated
        hoursElement.classList.remove('counting');
        hoursElement.classList.add('changing');

        // Remove changing class after animation is complete
        setTimeout(() => hoursElement.classList.remove('changing'), 400);
      }, 200); // Halfway through the counting animation
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
      }, 400); // Halfway through the counting animation
    }

    // Set AM/PM if in 12-hour format
    const ampmElement = document.querySelector('.ampm');
    if (ampmElement) {
      ampmElement.textContent = ampm;
    }
  });
}

// Function to render bookmarks
function renderBookmarks(bookmarks = [], folders = [], filter = '') {
  // Clear container
  bookmarksContainer.innerHTML = '';

  // Ensure bookmarks and folders are arrays
  bookmarks = Array.isArray(bookmarks) ? bookmarks : [];
  folders = Array.isArray(folders) ? folders : [];

  // Get active category tab
  const activeTab = document.querySelector('.bookmarks-tabs .tab.active');
  const activeCategory = activeTab ? activeTab.dataset.category : 'all';

  // Filter bookmarks by search query and category
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

  // Filter folders by search query and category
  let filteredFolders = folders;

  // Remove this redundant storage call
  // chrome.storage.sync.get(['bookmarks', 'folders'], function(data) {
  //   // Use default values if data is not available
  //   filteredFolders = data.folders || defaultFolders;
  // });

  if (filter && filteredFolders && filteredFolders.length > 0) {
    filteredFolders = filteredFolders.filter(folder => {
      // Check folder name
      if (folder.name.toLowerCase().includes(filter.toLowerCase())) {
        return true;
      }
      // Check folder items (with null check)
      return folder.items && folder.items.some(item =>
        item.title.toLowerCase().includes(filter.toLowerCase()) ||
        (item.url && item.url.toLowerCase().includes(filter.toLowerCase()))
      );
    });
  }

  if (filteredFolders && filteredFolders.length > 0 && activeCategory !== 'all') {
    filteredFolders = filteredFolders.filter(folder => folder.category === activeCategory);
  }

  // Rest of your renderBookmarks function remains the same
  // ...

  // Render folders first
  filteredFolders && filteredFolders.forEach(folder => {
    const folderEl = document.createElement('div');
    folderEl.className = 'bookmark-folder';
    folderEl.dataset.folderId = folder.id;

    const folderHeader = document.createElement('div');
    folderHeader.className = 'folder-header';
    folderHeader.addEventListener('click', function() {
      toggleFolderContent(folder.id);
    });

    const folderIcon = document.createElement('div');
    folderIcon.className = 'folder-icon';
    folderIcon.innerHTML = '<i class="fas fa-folder"></i>';
    folderIcon.style.backgroundColor = folder.color;

    const folderTitle = document.createElement('div');
    folderTitle.className = 'folder-title';
    folderTitle.textContent = folder.name;

    // Highlight search term in folder name
    if (filter) {
      folderTitle.innerHTML = highlightText(folder.name, filter);
    }

    const folderActions = document.createElement('div');
    folderActions.className = 'folder-actions';

    const editAction = document.createElement('div');
    editAction.className = 'folder-action';
    editAction.innerHTML = '<i class="fas fa-edit"></i>';
    editAction.addEventListener('click', function(e) {
      e.stopPropagation();
      editFolder(folder.id);
    });

    const deleteAction = document.createElement('div');
    deleteAction.className = 'folder-action';
    deleteAction.innerHTML = '<i class="fas fa-trash-alt"></i>';
    deleteAction.addEventListener('click', function(e) {
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

    // Check if folder was previously open
    if (localStorage.getItem(`folder_${folder.id}_open`) === 'true') {
      folderContent.classList.add('open');
    }

    // Add bookmark items in the folder
    if (folder.items.length > 0) {
      folder.items.forEach((item, itemIndex) => {
        const bookmarkEl = createBookmarkElement(item, () => {
          deleteBookmarkFromFolder(folder.id, itemIndex);
        });

        // Highlight search term in bookmark title
        if (filter && item.title.toLowerCase().includes(filter.toLowerCase())) {
          const titleEl = bookmarkEl.querySelector('.bookmark-title');
          titleEl.innerHTML = highlightText(item.title, filter);
        }

        folderContent.appendChild(bookmarkEl);
      });
    } else {
      // Empty folder state
      const emptyEl = document.createElement('div');
      emptyEl.className = 'folder-empty';
      emptyEl.textContent = 'No bookmarks in this folder yet';
      folderContent.appendChild(emptyEl);
    }

    folderEl.appendChild(folderHeader);
    folderEl.appendChild(folderContent);

    bookmarksContainer.appendChild(folderEl);
  });

  // Render individual bookmarks
  filteredBookmarks.forEach((bookmark, index) => {
    const bookmarkEl = createBookmarkElement(bookmark, () => {
      deleteBookmark(index);
    });

    // Add category label
    const categoryEl = document.createElement('div');
    categoryEl.className = 'bookmark-category';
    categoryEl.textContent = getCategoryLabel(bookmark.category);
    bookmarkEl.appendChild(categoryEl);

    // Highlight search term in bookmark title
    if (filter && bookmark.title.toLowerCase().includes(filter.toLowerCase())) {
      const titleEl = bookmarkEl.querySelector('.bookmark-title');
      titleEl.innerHTML = highlightText(bookmark.title, filter);
    }

    bookmarksContainer.appendChild(bookmarkEl);
  });

  // Show "no results" message if nothing is found
  if (filteredBookmarks.length === 0 && filteredFolders.length === 0) {
    const noResultsEl = document.createElement('div');
    noResultsEl.className = 'no-results';
    noResultsEl.style.gridColumn = '1 / -1';
    noResultsEl.style.textAlign = 'center';
    noResultsEl.style.padding = '20px';
    noResultsEl.style.color = 'var(--text-secondary)';

    if (filter) {
      noResultsEl.innerHTML = `No results found for <strong>"${filter}"</strong>`;
    } else {
      noResultsEl.innerHTML = `No bookmarks in the <strong>${getCategoryLabel(activeCategory)}</strong> category`;
    }

    bookmarksContainer.appendChild(noResultsEl);
  }
}

// Helper function to create bookmark element
function createBookmarkElement(bookmark, deleteCallback) {
  const bookmarkEl = document.createElement('a');
  bookmarkEl.href = bookmark.url;
  bookmarkEl.className = 'bookmark-item';
  bookmarkEl.style.animationDelay = '0.1s'; // All have same animation delay now

  const iconEl = document.createElement('div');
  iconEl.className = 'bookmark-icon';

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

  const titleEl = document.createElement('div');
  titleEl.className = 'bookmark-title';
  titleEl.textContent = bookmark.title;

  const deleteBtn = document.createElement('div');
  deleteBtn.className = 'bookmark-delete';
  deleteBtn.innerHTML = '<i class="fas fa-times"></i>';
  deleteBtn.addEventListener('click', function(e) {
    e.preventDefault();
    deleteCallback();
  });

  bookmarkEl.appendChild(iconEl);
  bookmarkEl.appendChild(titleEl);
  bookmarkEl.appendChild(deleteBtn);

  return bookmarkEl;
}

// Highlight search text
function highlightText(text, query) {
  const regex = new RegExp(`(${query})`, 'gi');
  return text.replace(regex, '<span class="search-highlight">$1</span>');
}

// Get category display label
function getCategoryLabel(category) {
  switch (category) {
    case 'dev': return 'Dev';
    case 'prod': return 'Prod';
    case 'social': return 'Social';
    default: return 'Other';
  }
}

// Function to delete bookmark from folder
function deleteBookmarkFromFolder(folderId, itemIndex) {
  chrome.storage.sync.get(['folders'], function(data) {
    const folders = data.folders || defaultFolders;
    const folderIndex = folders.findIndex(f => f.id === folderId);

    if (folderIndex !== -1) {
      folders[folderIndex].items.splice(itemIndex, 1);
      chrome.storage.sync.set({ folders: folders });
      renderBookmarks(data.bookmarks || defaultBookmarks, folders, searchBookmarks.value);
    }
  });
}

// Function to delete bookmark
function deleteBookmark(index) {
  chrome.storage.sync.get(['bookmarks', 'folders'], function(data) {
    const bookmarks = data.bookmarks || defaultBookmarks;
    const folders = data.folders || defaultFolders;

    bookmarks.splice(index, 1);
    saveBookmarks(bookmarks);

    // Pass both bookmarks and folders to renderBookmarks
    renderBookmarks(bookmarks, folders, searchBookmarks ? searchBookmarks.value : '');
  });
}

// Function to edit folder
function editFolder(folderId) {
  chrome.storage.sync.get(['folders'], function(data) {
    const folders = data.folders || defaultFolders;
    const folder = folders.find(f => f.id === folderId);

    if (folder) {
      // Open folder modal with folder data
      document.getElementById('folderName').value = folder.name;
      document.getElementById('folderColor').value = folder.color;
      document.getElementById('folderCategory').value = folder.category;

      // Save folder ID to use in save function
      document.getElementById('saveFolder').dataset.editId = folderId;

      // Open modal
      openFolderModal();
    }
  });
}

// Function to delete folder
function deleteFolder(folderId) {
  if (confirm('Are you sure you want to delete this folder?')) {
    chrome.storage.sync.get(['folders'], function(data) {
      const folders = data.folders || defaultFolders;
      const updatedFolders = folders.filter(f => f.id !== folderId);

      chrome.storage.sync.set({ folders: updatedFolders });
      chrome.storage.sync.get(['bookmarks'], function(bookmarkData) {
        renderBookmarks(bookmarkData.bookmarks || defaultBookmarks, updatedFolders, searchBookmarks.value);
      });
    });
  }
}

// Modify the addBookmark function to detect Font Awesome classes

function addBookmark() {
  // Get existing fields
  const title = document.getElementById('bookmarkTitle').value.trim();
  const url = document.getElementById('bookmarkUrl').value.trim();
  const icon = document.getElementById('bookmarkIcon').value.trim();

  // Detect if the icon value is a Font Awesome class
  let iconIsHtml = document.getElementById('bookmarkIcon').dataset.isHtml === "true";

  // Additional check for Font Awesome classes that might be pasted in
  if (!iconIsHtml && icon.match(/fa[srb]? fa-\w+/)) {
    iconIsHtml = true;
  }

  const color = document.getElementById('bookmarkColor').value;
  const category = document.getElementById('bookmarkCategory').value;
  const folderId = document.getElementById('bookmarkFolder').value;

  if (!title || !url) {
    alert('Title and URL are required');
    return;
  }

  // Add http:// if not present
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

  // Rest of the function remains the same...

  // If folder is selected, add to folder instead of main bookmarks
  if (folderId && folderId !== 'none') {
    // Existing folder logic...
  } else {
    // Add to main bookmarks
    chrome.storage.sync.get(['bookmarks', 'folders'], function(data) {
      const bookmarks = data.bookmarks || defaultBookmarks;
      bookmarks.push(newBookmark);

      chrome.storage.sync.set({ bookmarks: bookmarks });
      renderBookmarks(bookmarks, data.folders || defaultFolders, searchBookmarks.value);
      closeBookmarkModal();
    });
  }
}

// Open folder modal
function openFolderModal() {
  folderModal.style.display = 'block';
  overlay.style.display = 'block';

  setTimeout(() => {
    overlay.classList.add('active');
    folderModal.classList.add('active');
    document.getElementById('folderName').focus();
  }, 10);

  // Reset form if not editing
  if (!document.getElementById('saveFolder').dataset.editId) {
    document.getElementById('folderName').value = '';
    document.getElementById('folderColor').value = '#4285f4';
    document.getElementById('folderCategory').value = 'dev';
  }
}

// Close folder modal
function FolderModalclose() {
  folderModal.classList.remove('active');
  overlay.classList.remove('active');

  setTimeout(() => {
    folderModal.style.display = 'none';
    overlay.style.display = 'none';

    // Clear edit ID
    document.getElementById('saveFolder').dataset.editId = '';
  }, 300);
}

// Save folder
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
    const folders = data.folders || defaultFolders;

    if (editId) {
      // Update existing folder
      const folderIndex = folders.findIndex(f => f.id === editId);
      if (folderIndex !== -1) {
        folders[folderIndex].name = folderName;
        folders[folderIndex].color = folderColor;
        folders[folderIndex].category = folderCategory;
      }
    } else {
      // Create new folder
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
    FolderModalclose();

    // Re-render bookmarks
    chrome.storage.sync.get(['bookmarks'], function(bookmarkData) {
      renderBookmarks(bookmarkData.bookmarks || defaultBookmarks, folders, searchBookmarks.value);
    });
  });
}

// Update the openBookmarkModal function to load folders into select
function openBookmarkModal() {
  bookmarkModal.style.display = 'block';
  overlay.style.display = 'block';

  // Force browser reflow
  bookmarkModal.offsetHeight;

  setTimeout(() => {
    overlay.classList.add('active');
    bookmarkModal.classList.add('active');
    document.getElementById('bookmarkTitle').focus();
  }, 10);

  document.getElementById('bookmarkTitle').value = '';
  document.getElementById('bookmarkUrl').value = '';
  document.getElementById('bookmarkIcon').value = '';
  document.getElementById('bookmarkColor').value = '#4285f4';

  // Populate folder select
  const folderSelect = document.getElementById('bookmarkFolder');
  folderSelect.innerHTML = '<option value="none">No folder</option>';

  chrome.storage.sync.get(['folders'], function(data) {
    const folders = data.folders || defaultFolders;

    folders.forEach(folder => {
      const option = document.createElement('option');
      option.value = folder.id;
      option.textContent = folder.name;
      folderSelect.appendChild(option);
    });
  });

  // Reset category select
  document.getElementById('bookmarkCategory').value = 'other';
}

// ?  close bookmark modal
function closeBookmarkModal() {
  bookmarkModal.classList.remove('active');
  overlay.classList.remove('active');
  setTimeout(() => {
    bookmarkModal.style.display = 'none';
    overlay.style.display = 'none';
  }, 300);
}
// Close settings modal
function closeSettingsModal() {
  settingsModal.classList.remove('active');
  overlay.classList.remove('active');
  setTimeout(() => {
    settingsModal.style.display = 'none';
    overlay.style.display = 'none';
  }, 300);
}
// Add event listeners for modal close buttons
closeModal.addEventListener('click', closeBookmarkModal);
closeSettings.addEventListener('click', closeSettingsModal);
// Add event listener for settings toggle
settingsToggle.addEventListener('click', function() {
  settingsPanel.classList.toggle('active');
  overlay.classList.toggle('active');
  if (settingsPanel.classList.contains('active')) {
    settingsPanel.style.display = 'block';
    overlay.style.display = 'block';
    setTimeout(() => {
      settingsPanel.classList.add('active');
      overlay.classList.add('active');
    }
    , 10);
  } else {
    settingsPanel.classList.remove('active');
    overlay.classList.remove('active');
    setTimeout(() => {
      settingsPanel.style.display = 'none';
      overlay.style.display = 'none';
    }, 300);
  }
});

// Fix the weather data function
function getWeatherData() {
  // First, get user's location
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      // Success callback
      position => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        // Using OpenWeatherMap API
        const apiKey = 'a4ab361fb6db1ab8f8731476393027ad'; // Your API key
        const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;

        fetch(weatherUrl)
          .then(response => {
            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
          })
          .then(data => {
            console.log("Weather data received:", data);
            displayWeather(data);
          })
          .catch(error => {
            console.error('Error fetching weather data:', error);
            displayWeatherError();
          });
      },
      // Error callback
      error => {
        console.error('Geolocation error:', error);
        displayWeatherError();
      },
      // Options
      { maximumAge: 600000, timeout: 10000 } // Cache location for 10 minutes, timeout after 10 seconds
    );
  } else {
    console.error('Geolocation is not supported by this browser');
    displayWeatherError();
  }
}

// Improve the display weather function to respect temperature unit setting
function displayWeather(data) {
  // Create weather widget if it doesn't exist
  let weatherWidget = document.querySelector('.weather-widget');

  if (!weatherWidget) {
    weatherWidget = document.createElement('div');
    weatherWidget.className = 'weather-widget';
    document.body.appendChild(weatherWidget);
  }

  try {
    // Get weather data
    const iconCode = data.weather[0].icon;
    let temp = Math.round(data.main.temp);
    const location = data.name;
    const description = data.weather[0].description;

    // Get current settings for temperature unit
    chrome.storage.sync.get('settings', function(data) {
      const settings = data.settings || defaultSettings;
      const useFahrenheit = settings.useFahrenheit;

      // Convert to Fahrenheit if needed
      let unit = '°C';
      if (useFahrenheit) {
        temp = Math.round((temp * 9/5) + 32);
        unit = '°F';
      }

      // Map weather icon codes to Font Awesome icons
      const iconMap = {
        '01d': 'fas fa-sun',           // clear sky day
        '01n': 'fas fa-moon',          // clear sky night
        '02d': 'fas fa-cloud-sun',     // few clouds day
        '02n': 'fas fa-cloud-moon',    // few clouds night
        '03d': 'fas fa-cloud',         // scattered clouds
        '03n': 'fas fa-cloud',
        '04d': 'fas fa-cloud',         // broken clouds
        '04n': 'fas fa-cloud',
        '09d': 'fas fa-cloud-showers-heavy', // shower rain
        '09n': 'fas fa-cloud-showers-heavy',
        '10d': 'fas fa-cloud-rain',    // rain day
        '10n': 'fas fa-cloud-rain',    // rain night
        '11d': 'fas fa-bolt',          // thunderstorm
        '11n': 'fas fa-bolt',
        '13d': 'fas fa-snowflake',     // snow
        '13n': 'fas fa-snowflake',
        '50d': 'fas fa-smog',          // mist
        '50n': 'fas fa-smog'
      };

      // Choose the icon (use Font Awesome as fallback)
      const weatherIcon = iconMap[iconCode] || 'fas fa-cloud';

      // Update widget content with font awesome icon and proper temperature unit
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

// Add a function to handle weather errors
function displayWeatherError() {
  let weatherWidget = document.querySelector('.weather-widget');

  if (!weatherWidget) {
    weatherWidget = document.createElement('div');
    weatherWidget.className = 'weather-widget';
    document.body.appendChild(weatherWidget);
  }

  // Get current settings for temperature unit
  chrome.storage.sync.get('settings', function(data) {
    const settings = data.settings || defaultSettings;
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

// Event listener for temperature unit toggle
tempUnitToggle.addEventListener('change', function() {
  chrome.storage.sync.get('settings', function(data) {
    const settings = data.settings || defaultSettings;
    settings.useFahrenheit = tempUnitToggle.checked;
    saveSettings(settings);

    // Update weather display with new temperature unit
    if(settings.showWeatherWidget) {
    getWeatherData();
    }
  });
});

// Update the initialization of the clock HTML structure
function initializeClock() {
  // Create the clock structure if it doesn't exist
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

// Add this function to fetch tech news headlines

async function fetchTechNews() {
  const apiKey = 'e0aa6c2966654e288b1202437230e4d2'; // Get one from newsapi.org
  const url = `https://newsapi.org/v2/top-headlines?sources=hacker-news,ars-technica,techcrunch&apiKey=${apiKey}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`News API Error: ${response.status}`);
    }

    const data = await response.json();

    // Create news panel dynamically if it doesn't exist
    let newsPanel = document.getElementById('techNewsPanel');
    if (!newsPanel) {
      newsPanel = document.createElement('div');
      newsPanel.className = 'tech-news-panel';
      newsPanel.id = 'techNewsPanel';
      document.body.appendChild(newsPanel);

      newsPanel.innerHTML = `
        <div class="news-panel-header">
          <h3><i class="fas fa-newspaper"></i> Tech News</h3>
          <button class="news-panel-toggle">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="news-content" id="newsContent"></div>
      `;

      const closeBtn = newsPanel.querySelector('.news-panel-toggle');
      closeBtn.addEventListener('click', function() {
        newsPanel.classList.add('hidden');
      });
    }

    const newsContent = document.getElementById('newsContent');
    newsContent.innerHTML = '';

    // Display 5 top headlines
    data.articles.slice(0, 5).forEach(article => {
      const newsItem = document.createElement('a');
      newsItem.href = article.url;
      newsItem.target = '_blank';
      newsItem.className = 'news-item';

      newsItem.innerHTML = `
        <div class="news-title">${article.title}</div>
        <div class="news-source">${article.source.name}</div>
      `;

      newsContent.appendChild(newsItem);
    });
  } catch (error) {
    console.error('Error fetching tech news:', error);
  }
}

// Add the function call in the DOMContentLoaded event
document.addEventListener('DOMContentLoaded', function() {
  // Initialize clock HTML structure
  initializeClock();

  // Load settings and bookmarks
  loadSettings();

  // Update clock immediately and then every second
  updateClock();
  setInterval(updateClock, 1000);


 chrome.storage.sync.get('settings', function(data) {
   const settings = data.settings || defaultSettings;
  if(settings.showWeatherWidget) {

  // Get weather data
  getWeatherData();

  // Update weather every 30 minutes
  setInterval(getWeatherData, 30 * 60 * 1000);
  }
   });
  // Initialize GitHub activity tracking with stored username
  chrome.storage.sync.get('settings', function(data) {
    const settings = data.settings || defaultSettings;
    fetchGitHubActivity(settings.githubUsername || 'github');
  });

  // Start auto-rotate for backgrounds if enabled
  chrome.storage.sync.get('settings', function(data) {
    const settings = data.settings || defaultSettings;
    if (settings.autoRotateBackgrounds) {
      startAutoRotate();
    }
  });

  // Toggle search engine dropdown
  searchEngineButton.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    searchEngineDropdown.classList.toggle('active');

    // Close dropdown when clicking outside
    document.addEventListener('click', function closeDropdown(event) {
      if (!searchEngineButton.contains(event.target) && !searchEngineDropdown.contains(event.target)) {
        searchEngineDropdown.classList.remove('active');
        document.removeEventListener('click', closeDropdown);
      }
    });
  });

  // Handle search engine selection
  searchEngineOptions.forEach(option => {
    option.addEventListener('click', function() {
      const engine = this.getAttribute('data-engine');
      const icon = this.getAttribute('data-icon');

      currentSearchEngine = engine;
      searchEngineIcon.src = icon;
      searchEngineDropdown.classList.remove('active');

      // Save preference
      chrome.storage.sync.get('settings', function(data) {
        const settings = data.settings || defaultSettings;
        settings.defaultSearchEngine = engine;
        saveSettings(settings);
      });
    });
  });

  // Handle search form submission
  searchForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const query = searchInput.value.trim();

    if (query) {
      chrome.storage.sync.get('settings', function(data) {
        const settings = data.settings || defaultSettings;
        const searchUrl = searchEngines[currentSearchEngine] + encodeURIComponent(query);

        if (settings.openSearchInNewTab) {
          window.open(searchUrl, '_blank');
        } else {
          window.location.href = searchUrl;
        }

        searchInput.value = '';
      });
    }
  });

  // Focus search input with keyboard shortcut (/ key)
  document.addEventListener('keydown', function(e) {
    // If / is pressed and not in an input field
    if (e.key === '/' && document.activeElement.tagName !== 'INPUT' &&
        document.activeElement.tagName !== 'TEXTAREA') {
      e.preventDefault();
      searchInput.focus();
    }
  });

  // Add event listener for default search engine change
  defaultSearchEngineSelect.addEventListener('change', function() {
    chrome.storage.sync.get('settings', function(data) {
      const settings = data.settings || defaultSettings;
      settings.defaultSearchEngine = defaultSearchEngineSelect.value;
      currentSearchEngine = defaultSearchEngineSelect.value;
      saveSettings(settings);
      updateSearchEngineIcon(settings.defaultSearchEngine);
    });
  });

  // Add event listener for open in new tab toggle
  openInNewTabToggle.addEventListener('change', function() {
    chrome.storage.sync.get('settings', function(data) {
      const settings = data.settings || defaultSettings;
      settings.openSearchInNewTab = openInNewTabToggle.checked;
      saveSettings(settings);
    });
  });
});

// Add this code at the end of your script.js file

// Developer panel functionality
const devPanel = document.getElementById('devPanel');
const devPanelHeaderToggle = document.getElementById('devPanelToggleBtn'); // Changed from devPanelToggle
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

// GitHub activity tracking
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

// Pomodoro Timer functionality
let timerInterval;
let timerRunning = false;
let timerMode = 'pomodoro';
let timeLeft = 25 * 60; // 25 minutes in seconds

function updateTimerDisplay() {
  const minutes = Math.floor(timeLeft / 60).toString().padStart(2, '0');
  const seconds = (timeLeft % 60).toString().padStart(2, '0');
  timerDisplay.textContent = `${minutes}:${seconds}`;

  // Change title when timer is running
  if (timerRunning) {
    document.title = `${minutes}:${seconds} - Developer Workspace`;
  } else {
    document.title = `Developer Workspace`;
  }
}

function startTimer() {
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
      // Timer complete
      clearInterval(timerInterval);
      timerRunning = false;
      timerStart.innerHTML = '<i class="fas fa-play"></i>';

      // Notification
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

      // Auto-switch modes
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

// Terminal notes functionality
let notes = [];

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

  // Add event listeners to delete buttons
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
  // Format code blocks between backticks
  text = text.replace(/`([^`]+)`/g, '<code>$1</code>');

  // Format URLs
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

  notes.unshift(note); // Add to beginning of array
  saveNotes();
  renderNotes();
}

function handleTerminalCommand(command) {
  // Clear command
  if (command.toLowerCase() === 'clear') {
    notes = [];
    saveNotes();
    renderNotes();
    return;
  }

  // Help command
  if (command.toLowerCase() === 'help') {
    addNote(`Available commands:
    - clear: Clear all notes
    - help: Show this help
    - Any other text will be saved as a note`);
    return;
  }

  // Otherwise save as a note
  addNote(command);
}

// Event listeners for developer features
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOMContentLoaded event fired',devPanelHeaderToggle);


  // Initialize GitHub activity tracking
  const defaultGithubUsername = 'github'; // Replace with your GitHub username
  fetchGitHubActivity(defaultGithubUsername);

  // Toggle developer panel
  devPanelHeaderToggle.addEventListener('click', function() {
    console.log('devPanelHeaderToggle clicked',githubActivity.classList.contains('hidden'),devPanel)
    // githubActivity.classList.toggle('hidden');


    if (githubActivity.classList.contains('hidden')) {
      devPanelHeaderToggle.innerHTML = '<i class="fas fa-chevron-down"></i>';
      devPanel.classList.add('collapsed');
    } else {
      devPanelHeaderToggle.innerHTML = '<i class="fas fa-chevron-up"></i>';
      devPanel.classList.remove('collapsed');
    }
  });

  // Timer controls
  timerStart.addEventListener('click', startTimer);
  timerReset.addEventListener('click', resetTimer);
  pomodoroMode.addEventListener('click', switchToPomodoro);
  breakMode.addEventListener('click', switchToBreak);

  // Initialize timer display
  updateTimerDisplay();

  // Terminal functionality
  loadNotes();

  // Toggle terminal visibility
  terminalToggle.addEventListener('click', function() {
    terminalNotes.classList.toggle('active');
  });

  // Handle terminal input
  terminalInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      const command = terminalInput.textContent.trim();

      if (command) {
        handleTerminalCommand(command);
        terminalInput.textContent = '';
      }
    }
  });

  // Request notification permission
  if (Notification.permission !== "granted" && Notification.permission !== "denied") {
    Notification.requestPermission();
  }
});

// Add event listener for GitHub username change
githubUsernameInput.addEventListener('change', function() {
  chrome.storage.sync.get('settings', function(data) {
    const settings = data.settings || defaultSettings;
    settings.githubUsername = githubUsernameInput.value;
    saveSettings(settings);

    // Refresh GitHub activity
    fetchGitHubActivity(settings.githubUsername);
  });
});

// Add event listener for refresh button
refreshGitHubBtn.addEventListener('click', function() {
  this.classList.add('rotating');

  chrome.storage.sync.get('settings', function(data) {
    const settings = data.settings || defaultSettings;
    fetchGitHubActivity(settings.githubUsername);

    // Remove rotating class after animation completes
    setTimeout(() => {
      document.getElementById('refreshGitHub').classList.remove('rotating');
    }, 1000);
  });
});

// Add a feature to auto-rotate backgrounds if desired
let autoRotateInterval;

function startAutoRotate() {
  // Change backgrounds every 30 minutes
  autoRotateInterval = setInterval(() => {
    chrome.storage.sync.get('settings', function(data) {
      const settings = data.settings || defaultSettings;
      if (settings.autoRotateBackgrounds) {
        const randomBg = getRandomBackground();
        settings.background = randomBg;
        saveSettings(settings);
        applySettings(settings);
      }
    });
  }, 30 * 60 * 1000); // 30 minutes
}

// Event listeners
// Settings toggle
settingsToggle.addEventListener('click', function() {
  settingsPanel.classList.add('active');
  overlay.style.display = 'block';
  setTimeout(() => {
    overlay.classList.add('active');
  }, 10);
});

closeSettings.addEventListener('click', function() {
  settingsPanel.classList.remove('active');
  overlay.classList.remove('active');
  setTimeout(() => {
    overlay.style.display = 'none';
  }, 400); // Match the CSS transition duration
});

// Dark mode toggle
darkModeToggle.addEventListener('change', function() {
  chrome.storage.sync.get('settings', function(data) {
    const settings = data.settings || defaultSettings;
    settings.darkMode = darkModeToggle.checked;
    saveSettings(settings);
    applySettings(settings);
  });
});

// Clock format change
clockFormatSelect.addEventListener('change', function() {
  chrome.storage.sync.get('settings', function(data) {
    const settings = data.settings || defaultSettings;
    settings.clockFormat = clockFormatSelect.value;
    saveSettings(settings);
    updateClock(); // Update immediately
  });
});

// Array of all background URLs (excluding custom and random)
const backgroundUrls = [
  'https://images.unsplash.com/photo-1572270907014-c31da1c54124?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2089&q=80',
  'https://images.unsplash.com/photo-1485470733090-0aae1788d5af?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjI0MX0&auto=format&fit=crop&w=1991&q=80',
  'https://images.unsplash.com/photo-1499623838158-29acea518eaa?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2000&q=80',
  'https://images.unsplash.com/photo-1494806812796-244fe51b774d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2000&q=80',
  'https://images.unsplash.com/photo-1519501025264-65ba15a82390?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2000&q=80',
  'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2000&q=80',
  'https://images.unsplash.com/photo-1550859492-d5da9d8e45f3?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2000&q=80',
  'https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80',
  'https://images.unsplash.com/photo-1484417894907-623942c8ee29?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80',
  'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80',
  'https://images.unsplash.com/photo-1489861518096-4d12b732e831?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80',
  'https://images.unsplash.com/photo-1520034475321-cbe63696469a?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80',
  'https://images.unsplash.com/photo-1506477331477-33d5d8b3dc85?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80',
  'https://images.unsplash.com/photo-1498036882173-b41c28a8ba34?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80',
  'https://images.unsplash.com/photo-1504639725590-34d0984388bd?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80',
  'https://images.unsplash.com/photo-1483401757487-2ced3fa77952?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80',
  'https://images.unsplash.com/photo-1536599018102-9f803c140fc1?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80'
];

function getRandomBackground() {
  const randomIndex = Math.floor(Math.random() * backgroundUrls.length);
  return backgroundUrls[randomIndex];
}

// Background selection
backgroundOptions.forEach(option => {
  option.addEventListener('click', function() {
    const bg = this.getAttribute('data-bg');

    if (bg === 'custom') {
      customBgInput.click();
      return;
    }

    chrome.storage.sync.get('settings', function(data) {
      const settings = data.settings || defaultSettings;

      if (bg === 'random') {
        // Get random background
        const randomBg = getRandomBackground();
        settings.background = randomBg;
      } else {
        settings.background = bg;
      }

      saveSettings(settings);
      applySettings(settings);
    });
  });
});

// Custom background upload
customBgInput.addEventListener('change', function() {
  if (this.files && this.files[0]) {
    const reader = new FileReader();

    reader.onload = function(e) {
      chrome.storage.sync.get('settings', function(data) {
        const settings = data.settings || defaultSettings;
        settings.background = 'custom';
        settings.customBackground = e.target.result;
        saveSettings(settings);
        applySettings(settings);
      });
    }

    reader.readAsDataURL(this.files[0]);
  }
});

// Add bookmark
addBookmarkBtn.addEventListener('click', function() {
  openBookmarkModal();
});

closeModal.addEventListener('click', function() {
  closeBookmarkModal();
});

saveBookmarkBtn.addEventListener('click', addBookmark);

// Enter key in modal to save
document.querySelectorAll('#bookmarkModal input[type="text"]').forEach(input => {
  input.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
      addBookmark();
    }
  });
});

// Close modal and settings when clicking overlay
overlay.addEventListener('click', function() {
  if (settingsPanel.classList.contains('active')) {
    settingsPanel.classList.remove('active');
  }

  if (bookmarkModal.style.display === 'block') {
    bookmarkModal.classList.remove('active');
    setTimeout(() => {
      bookmarkModal.style.display = 'none';
    }, 300);
  }

  overlay.classList.remove('active');
  setTimeout(() => {
    overlay.style.display = 'none';
  }, 400);
});

// Time zone select change
timeZoneSelect.addEventListener('change', function() {
  chrome.storage.sync.get('settings', function(data) {
    const settings = data.settings || defaultSettings;
    settings.timeZone = timeZoneSelect.value;
    saveSettings(settings);
    updateClock(); // Update immediately
  });
});

// Show seconds toggle
showSecondsToggle.addEventListener('change', function() {
  chrome.storage.sync.get('settings', function(data) {
    const settings = data.settings || defaultSettings;
    settings.showSeconds = showSecondsToggle.checked;
    saveSettings(settings);
    applySettings(settings);
  });
});

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

// Add event listeners for new features
document.addEventListener('DOMContentLoaded', function() {
  // Existing event listeners...

  // Search bookmarks
  searchBookmarks.addEventListener('input', function() {
    const searchTerm = this.value.trim();

    chrome.storage.sync.get(['bookmarks', 'folders'], function(data) {
      renderBookmarks(data.bookmarks || defaultBookmarks, data.folders || defaultFolders, searchTerm);
    });
  });

  // Category tabs
  bookmarksTabs.forEach(tab => {
    tab.addEventListener('click', function() {
      bookmarksTabs.forEach(t => t.classList.remove('active'));
      this.classList.add('active');

      // Save active tab preference
      localStorage.setItem('active_bookmarks_tab', this.dataset.category);

      // Re-render with new filter
      chrome.storage.sync.get(['bookmarks', 'folders'], function(data) {
        renderBookmarks(data.bookmarks || defaultBookmarks, data.folders || defaultFolders, searchBookmarks.value);
      });
    });
  });

  // Add folder button
  addBookmarkFolder.addEventListener('click', function() {
    openFolderModal();
  });

  // Close folder modal
  closeFolderModal.addEventListener('click', function() {
    // Call the closeFolderModal function
    FolderModalclose();
  });

  // Save folder
  saveFolderBtn.addEventListener('click', saveFolder);

  // Restore active tab
  const savedTab = localStorage.getItem('active_bookmarks_tab');
  if (savedTab) {
    const tabToActivate = document.querySelector(`.bookmarks-tabs .tab[data-category="${savedTab}"]`);
    if (tabToActivate) {
      bookmarksTabs.forEach(t => t.classList.remove('active'));
      tabToActivate.classList.add('active');
    }
  }

  // Initialize folders data if not exists
  chrome.storage.sync.get(['folders'], function(data) {
    if (!data.folders) {
      chrome.storage.sync.set({ folders: defaultFolders });
    }
  });
});

// Add this function to make folder management more robust

function toggleFolderContent(folderId) {
  const folderContent = document.querySelector(`.folder-content[data-folder-id="${folderId}"]`);
  const folderHeader = document.querySelector(`.bookmark-folder[data-folder-id="${folderId}"] .folder-header`);

  if (folderContent && folderHeader) {
    // Toggle open class
    folderContent.classList.toggle('open');

    // Add visual feedback to indicate state
    if (folderContent.classList.contains('open')) {
      folderHeader.querySelector('.folder-icon i').className = 'fas fa-folder-open';
      localStorage.setItem(`folder_${folderId}_open`, 'true');
    } else {
      folderHeader.querySelector('.folder-icon i').className = 'fas fa-folder';
      localStorage.setItem(`folder_${folderId}_open`, 'false');
    }
  }
}

// Update renderBookmarks function to include proper folder click behavior
function renderBookmarks(bookmarks, folders, filter = '') {
  // Clear container
  bookmarksContainer.innerHTML = '';

  // Get active category tab
  const activeTab = document.querySelector('.bookmarks-tabs .tab.active');
  const activeCategory = activeTab ? activeTab.dataset.category : 'all';

  // Filter bookmarks by search query and category
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

  // Filter folders by search query and category
  let filteredFolders = folders ?? [];
   chrome.storage.sync.get(['bookmarks', 'folders'], function(data) {
    // Use default values if data is not available
    filteredFolders =  data.folders || defaultFolders;

      });



  if (filter) {
    filteredFolders = folders.filter(folder => {
      // Check folder name
      if (folder.name.toLowerCase().includes(filter.toLowerCase())) {
        return true;
      }
      // Check folder items
      return folder.items.some(item =>
        item.title.toLowerCase().includes(filter.toLowerCase()) ||
        (item.url && item.url.toLowerCase().includes(filter.toLowerCase()))
      );
    });
  }

  if (filteredFolders && activeCategory !== 'all') {
    console.log('filteredFolders', filteredFolders);
    filteredFolders = filteredFolders.filter(folder => folder.category === activeCategory);
  }



  // Render folders first
  filteredFolders && filteredFolders.forEach(folder => {
    const folderEl = document.createElement('div');
    folderEl.className = 'bookmark-folder';
    folderEl.dataset.folderId = folder.id;

    const folderHeader = document.createElement('div');
    folderHeader.className = 'folder-header';
    folderHeader.addEventListener('click', function() {
      toggleFolderContent(folder.id);
    });

    const folderIcon = document.createElement('div');
    folderIcon.className = 'folder-icon';
    folderIcon.innerHTML = '<i class="fas fa-folder"></i>';
    folderIcon.style.backgroundColor = folder.color;

    const folderTitle = document.createElement('div');
    folderTitle.className = 'folder-title';
    folderTitle.textContent = folder.name;

    // Highlight search term in folder name
    if (filter) {
      folderTitle.innerHTML = highlightText(folder.name, filter);
    }

    const folderActions = document.createElement('div');
    folderActions.className = 'folder-actions';

    const editAction = document.createElement('div');
    editAction.className = 'folder-action';
    editAction.innerHTML = '<i class="fas fa-edit"></i>';
    editAction.addEventListener('click', function(e) {
      e.stopPropagation();
      editFolder(folder.id);
    });

    const deleteAction = document.createElement('div');
    deleteAction.className = 'folder-action';
    deleteAction.innerHTML = '<i class="fas fa-trash-alt"></i>';
    deleteAction.addEventListener('click', function(e) {
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

    // Check if folder was previously open
    if (localStorage.getItem(`folder_${folder.id}_open`) === 'true') {
      folderContent.classList.add('open');
    }

    // Add bookmark items in the folder
    if (folder.items.length > 0) {
      folder.items.forEach((item, itemIndex) => {
        const bookmarkEl = createBookmarkElement(item, () => {
          deleteBookmarkFromFolder(folder.id, itemIndex);
        });

        // Highlight search term in bookmark title
        if (filter && item.title.toLowerCase().includes(filter.toLowerCase())) {
          const titleEl = bookmarkEl.querySelector('.bookmark-title');
          titleEl.innerHTML = highlightText(item.title, filter);
        }

        folderContent.appendChild(bookmarkEl);
      });
    } else {
      // Empty folder state
      const emptyEl = document.createElement('div');
      emptyEl.className = 'folder-empty';
      emptyEl.textContent = 'No bookmarks in this folder yet';
      folderContent.appendChild(emptyEl);
    }

    folderEl.appendChild(folderHeader);
    folderEl.appendChild(folderContent);

    bookmarksContainer.appendChild(folderEl);
  });

  // Render individual bookmarks
  filteredBookmarks.forEach((bookmark, index) => {
    const bookmarkEl = createBookmarkElement(bookmark, () => {
      deleteBookmark(index);
    });

    // Add category label
    const categoryEl = document.createElement('div');
    categoryEl.className = 'bookmark-category';
    categoryEl.textContent = getCategoryLabel(bookmark.category);
    bookmarkEl.appendChild(categoryEl);

    // Highlight search term in bookmark title
    if (filter && bookmark.title.toLowerCase().includes(filter.toLowerCase())) {
      const titleEl = bookmarkEl.querySelector('.bookmark-title');
      titleEl.innerHTML = highlightText(bookmark.title, filter);
    }

    bookmarksContainer.appendChild(bookmarkEl);
  });

  // Show "no results" message if nothing is found
  if (filteredBookmarks.length === 0 && filteredFolders.length === 0) {
    const noResultsEl = document.createElement('div');
    noResultsEl.className = 'no-results';
    noResultsEl.style.gridColumn = '1 / -1';
    noResultsEl.style.textAlign = 'center';
    noResultsEl.style.padding = '20px';
    noResultsEl.style.color = 'var(--text-secondary)';

    if (filter) {
      noResultsEl.innerHTML = `No results found for <strong>"${filter}"</strong>`;
    } else {
      noResultsEl.innerHTML = `No bookmarks in the <strong>${getCategoryLabel(activeCategory)}</strong> category`;
    }

    bookmarksContainer.appendChild(noResultsEl);
  }
}

// At the end of your document ready event listener, add these new DOM elements

// Add component toggle DOM elements
const weatherWidgetToggle = document.getElementById('weatherWidgetToggle');
const bookmarksToggle = document.getElementById('bookmarksToggle');
const devPanelToggleSwitch = document.getElementById('devPanelToggle');
const terminalNotesToggle = document.getElementById('terminalNotesToggle');

// Add event listeners for component toggle switches
document.addEventListener('DOMContentLoaded', function() {
  // Existing event listeners...

  // Component visibility toggle listeners
  weatherWidgetToggle.addEventListener('change', function() {
    chrome.storage.sync.get('settings', function(data) {
      const settings = data.settings || defaultSettings;
      settings.showWeatherWidget = weatherWidgetToggle.checked;
      saveSettings(settings);

      const weatherWidget = document.querySelector('.weather-widget');
      if (weatherWidget) {
        weatherWidget.style.display = settings.showWeatherWidget ? 'flex' : 'none';
      }
    });
  });

  bookmarksToggle.addEventListener('change', function() {
    chrome.storage.sync.get('settings', function(data) {
      const settings = data.settings || defaultSettings;
      settings.showBookmarks = bookmarksToggle.checked;
      saveSettings(settings);

      const bookmarksContainer = document.querySelector('.bookmarks-container');
      if (bookmarksContainer) {
        bookmarksContainer.style.display = settings.showBookmarks ? 'block' : 'none';
      }
    });
  });

  devPanelToggleSwitch.addEventListener('change', function() {
    chrome.storage.sync.get('settings', function(data) {
      const settings = data.settings || defaultSettings;
      settings.showDevPanel = devPanelToggleSwitch.checked;
      saveSettings(settings);

      const devPanel = document.getElementById('devPanel');
      if (devPanel) {
        devPanel.style.display = settings.showDevPanel ? 'block' : 'none';
      }
    });
  });

  terminalNotesToggle.addEventListener('change', function() {
    chrome.storage.sync.get('settings', function(data) {
      const settings = data.settings || defaultSettings;
      settings.showTerminalNotes = terminalNotesToggle.checked;
      saveSettings(settings);

      const terminalNotes = document.getElementById('terminalNotes');
      if (terminalNotes) {
        terminalNotes.style.display = settings.showTerminalNotes ? 'block' : 'none';
      }
    });
  });
});

// Add search functionality
const searchEngines = {
  google: 'https://www.google.com/search?q=',
  duckduckgo: 'https://duckduckgo.com/?q=',
  bing: 'https://www.bing.com/search?q=',
  yahoo: 'https://search.yahoo.com/search?p='
};

let currentSearchEngine = 'google';

// Add this function to update the search engine icon
function updateSearchEngineIcon(engine) {
  const option = document.querySelector(`.search-engine-option[data-engine="${engine}"]`);
  if (option) {
    const iconUrl = option.getAttribute('data-icon');
    searchEngineIcon.src = iconUrl;

    // Debug logging to verify icon URL is correct
    console.log("Updating search engine icon to:", iconUrl, "for engine:", engine);
  }
}

// Replace the existing search engine functions with this consolidated solution
function initializeSearchFunctionality() {
  const searchEngineButton = document.getElementById('searchEngineButton');
  const searchEngineIcon = document.getElementById('searchEngineIcon');
  const searchEngineDropdown = document.getElementById('searchEngineDropdown');
  const searchEngineOptions = document.querySelectorAll('.search-engine-option');

  if (!searchEngineButton || !searchEngineIcon || !searchEngineDropdown) {
    console.error("Search elements not found");
    return;
  }

  // Toggle dropdown visibility
  searchEngineButton.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    searchEngineDropdown.classList.toggle('active');
  });

  // Close dropdown when clicking outside
  document.addEventListener('click', function(event) {
    if (!searchEngineButton.contains(event.target) &&
        !searchEngineDropdown.contains(event.target)) {
      searchEngineDropdown.classList.remove('active');
    }
  });

  // Handle engine selection
  searchEngineOptions.forEach(option => {
    option.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();

      const engine = this.getAttribute('data-engine');
      const icon = this.getAttribute('data-icon');

      // Update the icon immediately
      if (icon) {
        searchEngineIcon.src = icon;
        console.log("Icon updated to:", icon);
      }

      // Update current engine
      window.currentSearchEngine = engine;

      // Update selection visual
      searchEngineOptions.forEach(opt => opt.classList.remove('selected'));
      this.classList.add('selected');

      // Close dropdown
      searchEngineDropdown.classList.remove('active');

      // Save to settings
      chrome.storage.sync.get('settings', function(data) {
        const settings = data.settings || defaultSettings;
        settings.defaultSearchEngine = engine;
        saveSettings(settings);
      });
    });
  });

  // Initialize from settings
  chrome.storage.sync.get('settings', function(data) {
    const settings = data.settings || defaultSettings;
    window.currentSearchEngine = settings.defaultSearchEngine || 'google';

    // Set the correct icon and selection
    const selectedOption = document.querySelector(`.search-engine-option[data-engine="${window.currentSearchEngine}"]`);
    if (selectedOption) {
      const iconUrl = selectedOption.getAttribute('data-icon');
      if (iconUrl) {
        searchEngineIcon.src = iconUrl;
      }

      searchEngineOptions.forEach(opt => opt.classList.remove('selected'));
      selectedOption.classList.add('selected');
    }
  });
}

// Call this function when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  // Remove older initialization code and use this single call
  initializeSearchFunctionality();

  // Rest of your existing initialization
  // ...
});

// First let's debug what's going on with the search engine dropdown
function fixSearchEngineDropdown() {
  const searchEngineButton = document.getElementById('searchEngineButton');
  const searchEngineDropdown = document.getElementById('searchEngineDropdown');
  const searchEngineIcon = document.getElementById('searchEngineIcon');

  if (!searchEngineButton || !searchEngineDropdown || !searchEngineIcon) {
    console.error("Search engine elements not found");
    return;
  }

  // Clear any existing listeners
  const newButton = searchEngineButton.cloneNode(true);
  searchEngineButton.parentNode.replaceChild(newButton, searchEngineButton);

  // Add click listener to toggle dropdown
  newButton.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();

    // Toggle dropdown visibility
    if (searchEngineDropdown.classList.contains('active')) {
      searchEngineDropdown.classList.remove('active');
    } else {
      // Position the dropdown correctly
      const buttonRect = newButton.getBoundingClientRect();
      // searchEngineDropdown.style.top = (buttonRect.bottom + 5) + 'px';
      // searchEngineDropdown.style.left = buttonRect.left + 'px';
      searchEngineDropdown.classList.add('active');
    }
  });

  // Close dropdown when clicking elsewhere
  document.addEventListener('click', function(e) {
    if (!newButton.contains(e.target) && !searchEngineDropdown.contains(e.target)) {
      searchEngineDropdown.classList.remove('active');
    }
  });

  // Add click handlers to search engine options
  document.querySelectorAll('.search-engine-option').forEach(option => {
    option.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();

      const engine = this.getAttribute('data-engine');
      const icon = this.getAttribute('data-icon');

      if (icon && searchEngineIcon) {
        searchEngineIcon.src = icon;
      }

      // Update current engine and save preference
      currentSearchEngine = engine;

      // Update selected class
      document.querySelectorAll('.search-engine-option').forEach(opt => {
        opt.classList.remove('selected');
      });
      this.classList.add('selected');

      // Close dropdown
      searchEngineDropdown.classList.remove('active');

      // Save setting
      chrome.storage.sync.get('settings', function(data) {
        const settings = data.settings || defaultSettings;
        settings.defaultSearchEngine = engine;
        saveSettings(settings);
      });
    });
  });
}

// Call this in your DOMContentLoaded event
document.addEventListener('DOMContentLoaded', function() {
  // Other initializations...
  fixSearchEngineDropdown();
});

// Fix search engine selection functionality
function setupSearchEngineSelection() {
  const searchEngineOptions = document.querySelectorAll('.search-engine-option');
  const searchEngineIcon = document.getElementById('searchEngineIcon');

  searchEngineOptions.forEach(option => {
    // Remove any existing event listeners
    option.replaceWith(option.cloneNode(true));
  });

  // Get fresh references after replacement
  const freshOptions = document.querySelectorAll('.search-engine-option');

  freshOptions.forEach(option => {
    option.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();

      const engine = this.getAttribute('data-engine');
      const icon = this.getAttribute('data-icon');

      console.log(`Engine selected: ${engine} with icon: ${icon}`);

      // Update current engine
      currentSearchEngine = engine;

      // Update icon
      searchEngineIcon.src = icon;

      // Update selected class
      freshOptions.forEach(opt => opt.classList.remove('selected'));
      this.classList.add('selected');

      // Close dropdown
      document.getElementById('searchEngineDropdown').classList.remove('active');

      // Save preference
      chrome.storage.sync.get('settings', function(data) {
        const settings = data.settings || defaultSettings;
        settings.defaultSearchEngine = engine;
        saveSettings(settings);
      });
    });
  });
}

// Call this in the DOMContentLoaded event
document.addEventListener('DOMContentLoaded', function() {
  // Existing code...

  // Fix search engine functionality
  fixSearchEngineDropdown();
  setupSearchEngineSelection();

  // Rest of your code...
});

// Debug helper for search dropdown
window.debugSearchDropdown = function() {
  const button = document.getElementById('searchEngineButton');
  const dropdown = document.getElementById('searchEngineDropdown');

  console.log('Search button exists:', !!button);
  console.log('Search dropdown exists:', !!dropdown);
  console.log('Dropdown classes:', dropdown.className);
  console.log('Dropdown display style:', getComputedStyle(dropdown).display);

  // Force toggle dropdown
  dropdown.classList.toggle('active');
  console.log('Dropdown active after toggle:', dropdown.classList.contains('active'));
  console.log('Dropdown display after toggle:', getComputedStyle(dropdown).display);
};

// Add to your DOMContentLoaded event at the end
document.addEventListener('DOMContentLoaded', function() {
  // Existing code...

  // Initialize search engine state
  chrome.storage.sync.get('settings', function(data) {
    const settings = data.settings || defaultSettings;
    currentSearchEngine = settings.defaultSearchEngine || 'google';

    // Update UI to reflect current search engine
    const selectedOption = document.querySelector(`.search-engine-option[data-engine="${currentSearchEngine}"]`);
    if (selectedOption) {
      const iconUrl = selectedOption.getAttribute('data-icon');
      if (iconUrl && searchEngineIcon) {
        searchEngineIcon.src = iconUrl;
      }

      // Update selected class
      document.querySelectorAll('.search-engine-option').forEach(opt => {
        opt.classList.remove('selected');
      });
      selectedOption.classList.add('selected');
    }

    console.log('Search engine initialized to:', currentSearchEngine);
  });
});

// Add a debug function that can be called from the browser console
window.testSearchEngineIcon = function(engineName) {
  const option = document.querySelector(`.search-engine-option[data-engine="${engineName}"]`);
  if (option) {
    const icon = option.getAttribute('data-icon');
    const searchEngineIcon = document.getElementById('searchEngineIcon');

    console.log("Setting icon to:", icon);
    searchEngineIcon.src = icon;

    // Force browser to redraw
    searchEngineIcon.style.display = 'none';
    searchEngineIcon.offsetHeight;
    searchEngineIcon.style.display = 'block';

    return "Icon updated to " + engineName;
  } else {
    return "Engine not found: " + engineName;
  }
};

// You can test this in the console with:
// window.testSearchEngineIcon('duckduckgo')

// Fix the toggle function
document.addEventListener('DOMContentLoaded', function() {
  // Other code...

  // Fixed toggle developer panel logic
  if (devPanelHeaderToggle) {
    devPanelHeaderToggle.addEventListener('click', function() {
      if (githubActivity) {
        githubActivity.classList.toggle('hidden');

        if (githubActivity.classList.contains('hidden')) {
          this.innerHTML = '<i class="fas fa-chevron-down"></i>';
          devPanel.classList.add('collapsed');
        } else {
          this.innerHTML = '<i class="fas fa-chevron-up"></i>';
          devPanel.classList.remove('collapsed');
        }
      }
    });
  }
});

document.addEventListener('DOMContentLoaded', function() {
  // Existing code...

  // Improved search bookmarks functionality
  if (searchBookmarks) {
    searchBookmarks.addEventListener('input', function() {
      const searchTerm = this.value.trim();

      // Add visual feedback when searching
      if (searchTerm.length > 0) {
        this.classList.add('searching');
      } else {
        this.classList.remove('searching');
      }

      chrome.storage.sync.get(['bookmarks', 'folders'], function(data) {
        renderBookmarks(data.bookmarks || defaultBookmarks, data.folders || defaultFolders, searchTerm);
      });
    });

    // Add clear search button functionality
    const searchContainer = searchBookmarks.parentElement;
    if (searchContainer) {
      const clearBtn = document.createElement('span');
      clearBtn.className = 'search-clear';
      clearBtn.innerHTML = '×';
      clearBtn.style.display = 'none';
      searchContainer.appendChild(clearBtn);

      searchBookmarks.addEventListener('input', function() {
        clearBtn.style.display = this.value.length ? 'block' : 'none';
      });

      clearBtn.addEventListener('click', function() {
        searchBookmarks.value = '';
        searchBookmarks.dispatchEvent(new Event('input'));
        this.style.display = 'none';
        searchBookmarks.focus();
      });
    }
  }
});
