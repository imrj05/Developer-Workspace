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
  openSearchInNewTab: true,
  showGitHubActivity: true,
  showApiStatus: true,
  showQuickDocs: true,
  showPomodoroTimer: true,
  showBookmarks: false,
};
const resetDefaultBtn = document.getElementById('resetDefaultBtn');
const WEEK_IN_MS = 7 * 24 * 60 * 60 * 1000;
// Declare and initialize the notes variable
let notes = [];
const DEFAULT_APIS = [
  {
    name: 'GitHub',
    url: 'https://www.githubstatus.com/api/v2/status.json',
    icon: 'fab fa-github'
  },
  {
    name: 'Cloudflare',
    url: 'https://www.cloudflarestatus.com/api/v2/status.json',
    icon: 'fas fa-cloud'
  },
  {
    name: 'NPM',
    url: 'https://status.npmjs.org/api/v2/status.json',
    icon: 'fab fa-npm'
  },
  {
    name: 'Vercel',
    url: 'https://www.vercel-status.com/api/v2/status.json',
    icon: 'fas fa-shapes'
  },
  {
    name: 'Azure',
    url: 'https://status.dev.azure.com/_apis/status/health',
    icon: 'fab fa-microsoft'
  },
  {
    name: 'Netlify',
    url: 'https://www.netlifystatus.com/api/v2/status.json',
    icon: 'fas fa-network-wired'
  },
  {
    name: 'Digital Ocean',
    url: 'https://status.digitalocean.com/api/v2/status.json',
    icon: 'fas fa-water'
  },
  {
    name: 'Heroku',
    url: 'https://status.heroku.com/api/v4/current-status',
    icon: 'fas fa-h-square'
  },
  {
    name: 'CircleCI',
    url: 'https://status.circleci.com/api/v2/status.json',
    icon: 'fas fa-circle-notch'
  }
];
const DOCUMENTATION_LINKS = [
  { name: 'MDN Web Docs', url: 'https://developer.mozilla.org', icon: 'fab fa-firefox-browser' },
  { name: 'DevDocs', url: 'https://devdocs.io', icon: 'fas fa-book' },
  { name: 'Can I Use', url: 'https://caniuse.com', icon: 'fas fa-browser' },
  { name: 'W3Schools', url: 'https://www.w3schools.com', icon: 'fas fa-code' },
  { name: 'Stack Overflow', url: 'https://stackoverflow.com', icon: 'fab fa-stack-overflow' },
  { name: 'Web.dev', url: 'https://web.dev', icon: 'fab fa-chrome' }
];
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
const weatherWidgetToggle = document.getElementById('weatherWidgetToggle');
const bookmarksToggle = document.getElementById('toggleMostVisited');
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
// const devPanelHeaderToggle = document.getElementById('devPanelToggleBtn');
const iconOptions = document.querySelectorAll('.icon-option');
// Pomodoro Timer functionality
let timerInterval;
let timerRunning = false;
let timerMode = 'pomodoro';
let timeLeft = 25 * 60; // 25 minutes in seconds
// Default Bookmarks and Folders for Developers
const DEFAULT_BOOKMARKS = [
  // Development Category
  { title: 'GitHub', url: 'https://github.com', icon: 'GH', color: '#ffffff0f', category: 'dev' },
  { title: 'Stack Overflow', url: 'https://stackoverflow.com', icon: 'SO', color: '#ffffff0f', category: 'dev' },
  { title: 'GeeksforGeeks', url: 'https://geeksforgeeks.org', icon: 'GFG', color: '#ffffff0f', category: 'dev' },
  { title: 'InterviewBit', url: 'https://www.interviewbit.com', icon: 'IB', color: '#ffffff0f', category: 'dev' },
  { title: 'LeetCode', url: 'https://leetcode.com', icon: 'LC', color: '#ffffff0f', category: 'dev' },
  { title: 'HackerRank', url: 'https://hackerrank.com', icon: 'HR', color: '#ffffff0f', category: 'dev' },
  { title: 'CodeChef', url: 'https://codechef.com', icon: 'CC', color: '#ffffff0f', category: 'dev' },
  { title: 'HackerEarth', url: 'https://hackerearth.com', icon: 'HE', color: '#ffffff0f', category: 'dev' },
  { title: 'Dev.to', url: 'https://dev.to', icon: 'DT', color: '#ffffff0f', category: 'dev' },
  { title: 'Hashnode', url: 'https://hashnode.com', icon: 'HN', color: '#ffffff0f', category: 'dev' },
  // Productivity Category
  { title: 'Gmail', url: 'https://mail.google.com', icon: 'GM', color: '#ffffff0f', category: 'prod' },
  { title: 'Zoho Mail', url: 'https://mail.zoho.in', icon: 'ZH', color: '#ffffff0f', category: 'prod' },
  { title: 'Notion', url: 'https://notion.so', icon: 'N', color: '#ffffff0f', category: 'prod' },
  { title: 'Calendly', url: 'https://calendly.com', icon: 'CL', color: '#ffffff0f', category: 'prod' },
  { title: 'Microsoft Teams', url: 'https://teams.microsoft.com', icon: 'MT', color: '#ffffff0f', category: 'prod' },
  { title: 'Google Meet', url: 'https://meet.google.com', icon: 'GM', color: '#ffffff0f', category: 'prod' },
  { title: 'Google Drive', url: 'https://drive.google.com', icon: 'GD', color: '#ffffff0f', category: 'prod' },
  { title: 'Trello', url: 'https://trello.com', icon: 'TR', color: '#ffffff0f', category: 'prod' },
  // AI Category
  { title: 'ChatGPT', url: 'https://chat.openai.com', icon: 'AI', color: '#ffffff0f', category: 'ai' },
  { title: 'Claude', url: 'https://claude.ai', icon: 'CL', color: '#ffffff0f', category: 'ai' },
  { title: 'Bard', url: 'https://bard.google.com', icon: 'BA', color: '#ffffff0f', category: 'ai' },
  { title: 'Bing Chat', url: 'https://bing.com/chat', icon: 'BC', color: '#ffffff0f', category: 'ai' },
  { title: 'Hugging Face', url: 'https://huggingface.co', icon: 'HF', color: '#ffffff0f', category: 'ai' },
  { title: 'Midjourney', url: 'https://www.midjourney.com', icon: 'MJ', color: '#ffffff0f', category: 'ai' },
  { title: 'RunwayML', url: 'https://runwayml.com', icon: 'RW', color: '#ffffff0f', category: 'ai' },
  { title: 'Jasper', url: 'https://www.jasper.ai', icon: 'JP', color: '#ffffff0f', category: 'ai' },
  // Social Category
  { title: 'WhatsApp Web', url: 'https://web.whatsapp.com', icon: 'WA', color: '#ffffff0f', category: 'social' },
  { title: 'LinkedIn', url: 'https://linkedin.com', icon: 'LI', color: '#ffffff0f', category: 'social' },
  { title: 'Instagram', url: 'https://instagram.com', icon: 'IG', color: '#ffffff0f', category: 'social' },
  { title: 'Twitter', url: 'https://twitter.com', icon: 'TW', color: '#ffffff0f', category: 'social' },
  { title: 'Telegram', url: 'https://web.telegram.org', icon: 'TG', color: '#ffffff0f', category: 'social' },
  { title: 'Reddit', url: 'https://reddit.com', icon: 'RD', color: '#ffffff0f', category: 'social' },
  { title: 'Discord', url: 'https://discord.com', icon: 'DC', color: '#ffffff0f', category: 'social' },
  { title: 'Slack', url: 'https://slack.com', icon: 'SL', color: '#ffffff0f', category: 'social' },
  // Shopping Category
  { title: 'Amazon.in', url: 'https://amazon.in', icon: 'AZ', color: '#ffffff0f', category: 'shopping' },
  { title: 'Flipkart', url: 'https://flipkart.com', icon: 'FK', color: '#ffffff0f', category: 'shopping' },
  { title: 'Myntra', url: 'https://myntra.com', icon: 'MY', color: '#ffffff0f', category: 'shopping' },
  { title: 'Nykaa', url: 'https://nykaa.com', icon: 'NK', color: '#ffffff0f', category: 'shopping' },
  { title: 'Meesho', url: 'https://meesho.com', icon: 'ME', color: '#ffffff0f', category: 'shopping' },
  { title: 'Ajio', url: 'https://ajio.com', icon: 'AJ', color: '#ffffff0f', category: 'shopping' },
  { title: 'Tata CLiQ', url: 'https://tatacliq.com', icon: 'TC', color: '#ffffff0f', category: 'shopping' },
  { title: 'Reliance Digital', url: 'https://reliancedigital.in', icon: 'RD', color: '#ffffff0f', category: 'shopping' },
  // Entertainment Category
  { title: 'YouTube', url: 'https://youtube.com', icon: 'YT', color: '#ffffff0f', category: 'entertainment' },
  { title: 'Hotstar', url: 'https://hotstar.com', icon: 'HS', color: '#ffffff0f', category: 'entertainment' },
  { title: 'Prime Video', url: 'https://primevideo.com', icon: 'PV', color: '#ffffff0f', category: 'entertainment' },
  { title: 'SonyLIV', url: 'https://sonyliv.com', icon: 'SL', color: '#ffffff0f', category: 'entertainment' },
  { title: 'Netflix', url: 'https://netflix.com', icon: 'NF', color: '#ffffff0f', category: 'entertainment' },
  { title: 'Zee5', url: 'https://zee5.com', icon: 'Z5', color: '#ffffff0f', category: 'entertainment' },
  { title: 'Voot', url: 'https://voot.com', icon: 'VT', color: '#ffffff0f', category: 'entertainment' },
  { title: 'MX Player', url: 'https://mxplayer.in', icon: 'MX', color: '#ffffff0f', category: 'entertainment' },
  // Education Category
  { title: 'NPTEL', url: 'https://nptel.ac.in', icon: 'NP', color: '#ffffff0f', category: 'education' },
  { title: 'Coursera', url: 'https://coursera.org', icon: 'CO', color: '#ffffff0f', category: 'education' },
  { title: 'Unacademy', url: 'https://unacademy.com', icon: 'UA', color: '#ffffff0f', category: 'education' },
  { title: 'BYJU\'S', url: 'https://byjus.com', icon: 'BJ', color: '#ffffff0f', category: 'education' },
  { title: 'upGrad', url: 'https://upgrad.com', icon: 'UG', color: '#ffffff0f', category: 'education' },
  { title: 'Vedantu', url: 'https://vedantu.com', icon: 'VD', color: '#ffffff0f', category: 'education' },
  { title: 'Great Learning', url: 'https://greatlearning.in', icon: 'GL', color: '#ffffff0f', category: 'education' },
  { title: 'Simplilearn', url: 'https://simplilearn.com', icon: 'SL', color: '#ffffff0f', category: 'education' },
  // Other Category
  { title: 'IRCTC', url: 'https://irctc.co.in', icon: 'IR', color: '#ffffff0f', category: 'other' },
  { title: 'Paytm', url: 'https://paytm.com', icon: 'PT', color: '#ffffff0f', category: 'other' },
  { title: 'PhonePe', url: 'https://phonepe.com', icon: 'PP', color: '#ffffff0f', category: 'other' },
  { title: 'Aarogya Setu', url: 'https://aarogyasetu.gov.in', icon: 'AS', color: '#ffffff0f', category: 'other' },
  { title: 'DigiLocker', url: 'https://digilocker.gov.in', icon: 'DL', color: '#ffffff0f', category: 'other' },
  { title: 'Google Pay', url: 'https://pay.google.com', icon: 'GP', color: '#ffffff0f', category: 'other' },
  { title: 'MMT', url: 'https://makemytrip.com', icon: 'MT', color: '#ffffff0f', category: 'other' },
  { title: 'Swiggy', url: 'https://swiggy.com', icon: 'SW', color: '#ffffff0f', category: 'other' },
  { title: 'Zomato', url: 'https://zomato.com', icon: 'ZM', color: '#ffffff0f', category: 'other' },
  { title: 'Uber', url: 'https://uber.com', icon: 'UB', color: '#ffffff0f', category: 'other' }
];
const DEFAULT_FOLDERS = [
  {
    id: 'dev-tools',
    name: 'Dev Tools',
    color: '#007ACC',
    category: 'dev',
    items: [
      { title: 'GitHub', url: 'https://www.github.com', icon: 'GH', color: '#ffffff0f' },
      { title: 'CodePen', url: 'https://codepen.io', icon: 'CP', color: '#ffffff0f' },
      { title: 'NPM', url: 'https://www.npmjs.com', icon: 'NPM', color: '#ffffff0f' }
    ]
  },
  {
    id: 'web-frameworks',
    name: 'Web Frameworks',
    color: '#61DAFB',
    category: 'dev',
    items: [
      { title: 'React', url: 'https://react.dev', icon: 'R', color: '#ffffff0f' },
      { title: 'Next.js', url: 'https://nextjs.org', icon: 'NX', color: '#ffffff0f' },
      { title: 'TypeScript', url: 'https://www.typescriptlang.org', icon: 'TS', color: '#ffffff0f' },
      { title: 'Tailwind CSS', url: 'https://tailwindcss.com', icon: 'TW', color: '#ffffff0f' },
      { title: 'Bootstrap', url: 'https://getbootstrap.com', icon: 'BS', color: '#ffffff0f' },
      { title: 'Material UI', url: 'https://mui.com', icon: 'MUI', color: '#ffffff0f' },
      { title: 'Vue.js', url: 'https://vuejs.org', icon: 'V', color: '#ffffff0f' },
      { title: 'Angular', url: 'https://angular.io', icon: 'A', color: '#ffffff0f' },
      { title: 'Svelte', url: 'https://svelte.dev', icon: 'SV', color: '#ffffff0f' },
      { title: 'Ember.js', url: 'https://emberjs.com', icon: 'E', color: '#ffffff0f' },
      { title: 'Django', url: 'https://www.djangoproject.com', icon: 'DJ', color: '#ffffff0f' },
      { title: 'Flask', url: 'https://flask.palletsprojects.com', icon: 'FL', color: '#ffffff0f' },
      { title: 'Ruby on Rails', url: 'https://rubyonrails.org', icon: 'RR', color: '#ffffff0f' },
      { title: 'Spring', url: 'https://spring.io', icon: 'SP', color: '#ffffff0f' },
      { title: 'Laravel', url: 'https://laravel.com', icon: 'L', color: '#ffffff0f' },
      { title: 'ASP.NET', url: 'https://dotnet.microsoft.com/apps/aspnet', icon: 'ASPNET', color: '#ffffff0f' },
      { title: 'Express.js', url: 'https://expressjs.com', icon: 'EX', color: '#ffffff0f' }
    ]
  },
  {
    id: 'ai-resources',
    name: 'AI & Machine Learning',
    color: '#FF6F61',
    category: 'ai',
    items: [
      { title: 'Claude', url: 'https://claude.ai', icon: 'CL', color: '#ffffff0f' },
      { title: 'ChatGPT', url: 'https://chat.openai.com', icon: 'AI', color: '#ffffff0f' },
      { title: 'Hugging Face', url: 'https://huggingface.co', icon: 'HF', color: '#ffffff0f' },
      { title: 'Google AI', url: 'https://ai.google', icon: 'GA', color: '#ffffff0f' },
      { title: 'v0 by Vercel', url: 'https://v0.dev', icon: 'V0', color: '#ffffff0f' },
      { title: 'Bolt AI', url: 'https://bolt.ai', icon: 'BA', color: '#ffffff0f' },
      { title: 'Perplexity', url: 'https://perplexity.ai', icon: 'PP', color: '#ffffff0f' },
      { title: 'Midjourney', url: 'https://midjourney.com', icon: 'MJ', color: '#ffffff0f' },
      { title: 'Runway', url: 'https://runwayml.com', icon: 'RW', color: '#ffffff0f' },
      { title: 'Anthropic', url: 'https://anthropic.com', icon: 'AN', color: '#ffffff0f' },
      { title: 'Cohere', url: 'https://cohere.com', icon: 'CH', color: '#ffffff0f' },
      { title: 'Stability AI', url: 'https://stability.ai', icon: 'SA', color: '#ffffff0f' },
      { title: 'GPT-4 API', url: 'https://openai.com/api', icon: 'G4', color: '#ffffff0f' }
    ]
  }
];
// Array of all background URLs (excluding custom and random)
const BACKGROUND_URLS = [
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
function getCategoryLabel(category) {
  switch (category) {
    case 'dev': return 'Dev';
    case 'prod': return 'Prod';
    case 'social': return 'Social';
    case 'ai': return 'AI';
    case 'shopping': return 'Shopping';
    case 'entertainment': return 'Entertainment';
    case 'education': return 'Education';
    case 'other': return 'Other';
    case 'chrome': return 'Chrome';
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
  resetDefaultBtn.addEventListener('click', resetToDefault);
  // ? load icon click
  // Icon selection in bookmark modal
  iconOptions.forEach(option => {
    option.addEventListener('click', function () {
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
  // Add collapsible functionality
  document.querySelectorAll('.collapsible').forEach(header => {
    header.addEventListener('click', function () {
      const targetId = this.dataset.target;
      const content = document.getElementById(targetId);
      // Toggle collapsed state
      this.classList.toggle('collapsed');
      content.classList.toggle('collapsed');
      // Save state to localStorage
      localStorage.setItem(`${targetId}-collapsed`, this.classList.contains('collapsed'));
    });
  });
  document.getElementById('githubActivityToggle').addEventListener('change', toggleGitHubActivity);
  document.getElementById('apiStatusToggle').addEventListener('change', toggleApiStatus);
  document.getElementById('quickDocsToggle').addEventListener('change', toggleQuickDocs);
  document.getElementById('pomodoroToggle').addEventListener('change', togglePomodoroTimer);
  chrome.bookmarks.onCreated.addListener(refreshBookmarks);
  chrome.bookmarks.onRemoved.addListener(refreshBookmarks);
  chrome.bookmarks.onChanged.addListener(refreshBookmarks);
}
function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'toast-message';
  toast.innerHTML = `<i class="fas fa-info-circle"></i> ${message}`;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 2000);
  }, 100);
}
// Settings Functions
function loadSettings() {
  chrome.storage.sync.get(['settings', 'bookmarks', 'folders', 'apiList', 'showBookmarks'], function (data) {
    const settings = data.settings || DEFAULT_SETTINGS;
    const customBookmarks = data.bookmarks || [];
    const customFolders = data.folders || [];
    const showBookmarks = settings.showBookmarks !== undefined ? settings.showBookmarks : false;
    const apiList = settings.apiList || DEFAULT_APIS;
    // Get Chrome bookmarks
    chrome.bookmarks.getTree((chromeBookmarkTree) => {
      const chromeBookmark = processBookmarkTree(chromeBookmarkTree[0]);
      // Mark bookmarks by source
      const markedChromeBookmarks = chromeBookmark.map(b => ({
        ...b,
        isExtensionBookmark: true,
        category: 'chrome' // Add this helper function
      })) ?? [];
      const markedExtensionBookmarks = customBookmarks.map(b => ({
        ...b,
        isExtensionBookmark: false
      })) ?? [];
      // Combine and filter bookmarks/folders
      const allBookmarks = [...markedChromeBookmarks, ...markedExtensionBookmarks];
      const chromeFolders = chromeBookmark.folders || [];
      const allFolders = [...customFolders, ...chromeFolders].filter(Boolean);
      applySettings(settings);
      const viewToggle = document.getElementById('toggleMostVisited');
      if (showBookmarks) {
        viewToggle.checked = true;
        showMostVisitedView();
      } else {
        viewToggle.checked = false;
        renderBookmarks(allBookmarks, allFolders, searchBookmarks.value);
        showBookmarksView();
      }
    });
  });
  // Set initial toggle states
  document.getElementById('toggleMostVisited').checked = false;
}
function processChromeBookmarks(node, path = '', result = { bookmarks: [], folders: [] }) {
  if (!node) return result;
  if (node.children) {
    // This is a folder
    const currentPath = path ? `${path}/${node.title}` : node.title;
    if (node.title) { // Skip root folder
      const folderId = `chrome_folder_${node.id}`;
      const folderBookmarks = [];
      // Process children first to collect folder items
      node.children.forEach(child => {
        if (child && child.url) {
          // This is a bookmark in the folder
          const bookmark = {
            title: child.title || '',
            url: child.url,
            id: child.id,
            isExtensionBookmark: true,
            category: 'chrome' // Add this helper function
          };
          folderBookmarks.push(bookmark);
        } else if (child) {
          // Recurse into subfolders
          processChromeBookmarks(child, currentPath, result);
        }
      });
      // Add folder with its bookmarks if it has any
      if (folderBookmarks.length > 0) {
        result.folders.push({
          id: folderId,
          name: node.title,
          color: getColorForFolder(node.title),
          category: 'chrome',
          items: folderBookmarks,
          isExtensionFolder: true,
          path: currentPath
        });
      }
      // Also add bookmarks to the main bookmarks array
      result.bookmarks.push(...folderBookmarks);
    }
  } else if (node.url) {
    // This is a top-level bookmark
    result.bookmarks.push({
      title: node.title,
      url: node.url,
      id: node.id,
      isExtensionBookmark: true,
      category: 'chrome',
    });
  }
  return result;
}
function getColorForFolder(name) {
  const colors = [
    '#4285f4', '#ea4335', '#fbbc05', '#34a853',
    '#673ab7', '#3f51b5', '#2196f3', '#03a9f4'
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
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
  // get custom background from local storage
  const customBg = localStorage.getItem('customBackground');
  if (settings.background === 'custom' && customBg) {
    document.body.style.backgroundImage = `url('${customBg}')`;
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
  // document.querySelector('.bookmarks-container').style.display = settings.showBookmarks ? 'block' : 'none';
  document.getElementById('devPanel').style.display = settings.showDevPanel ? 'block' : 'none';
  document.getElementById('terminalNotes').style.display = settings.showTerminalNotes ? 'block' : 'none';
  document.getElementById('githubActivitySection').style.display = settings.showGitHubActivity ? 'block' : 'none';
  document.getElementById('apiStatusSection').style.display = settings.showApiStatus ? 'block' : 'none';
  document.getElementById('quickDocsSection').style.display = settings.showQuickDocs ? 'block' : 'none';
  document.getElementById('pomodoroSection').style.display = settings.showPomodoroTimer ? 'block' : 'none';
  // Update toggle states
  document.getElementById('githubActivityToggle').checked = settings.showGitHubActivity;
  document.getElementById('apiStatusToggle').checked = settings.showApiStatus;
  document.getElementById('quickDocsToggle').checked = settings.showQuickDocs;
  document.getElementById('pomodoroToggle').checked = settings.showPomodoroTimer;
  // Safely toggle visibility of dev panel sections
  const toggleSection = (elementId, isVisible) => {
    const element = document.getElementById(elementId);
    if (element) {
      element.style.display = isVisible ? 'block' : 'none';
    }
  };
  // Handle dev panel section visibility
  toggleSection('githubActivitySection', settings.showGitHubActivity);
  toggleSection('apiStatusSection', settings.showApiStatus);
  toggleSection('quickDocsSection', settings.showQuickDocs);
  toggleSection('pomodoroSection', settings.showPomodoroTimer);
  // Update toggle states
  const updateToggle = (elementId, value) => {
    const element = document.getElementById(elementId);
    if (element) {
      element.checked = value;
    }
  };
  updateToggle('githubActivityToggle', settings.showGitHubActivity);
  updateToggle('apiStatusToggle', settings.showApiStatus);
  updateToggle('quickDocsToggle', settings.showQuickDocs);
  updateToggle('pomodoroToggle', settings.showPomodoroTimer);
  // Hide dev panel if all sections are hidden
  const isAnyDevPanelSectionVisible =
    settings.showGitHubActivity ||
    settings.showApiStatus ||
    settings.showQuickDocs ||
    settings.showPomodoroTimer;
  const devPanel = document.getElementById('devPanel');
  if (devPanel) {
    devPanel.style.display = isAnyDevPanelSectionVisible ? 'block' : 'none';
    // Update the main dev panel toggle
    devPanelToggleSwitch.checked = isAnyDevPanelSectionVisible;
  }
}
// Bookmark Functions
function renderBookmarks(bookmarks = [], folders = [], filter = '') {
  bookmarksContainer.innerHTML = '';
  // Ensure we have arrays and filter out any undefined/null values
  bookmarks = (Array.isArray(bookmarks) ? bookmarks : []).filter(Boolean);
  folders = (Array.isArray(folders) ? folders : []).filter(Boolean);
  const activeTab = document.querySelector('.bookmarks-tabs .tab.active');
  const activeTabFromLocalStorage = localStorage.getItem('active_bookmarks_tab');
  const activeCategory = activeTabFromLocalStorage ? activeTabFromLocalStorage : activeTab.dataset.category ?? 'all';
  // set active on selected tab
  bookmarksTabs.forEach(tab => tab.classList.remove('active'));
  bookmarksTabs.forEach(tab => {
    if (tab.dataset.category === activeCategory) {
      tab.classList.add('active');
    }
  });
  // Filter bookmarks with null checks
  let filteredBookmarks = bookmarks;
  if (filter) {
    filteredBookmarks = bookmarks.filter(bookmark =>
      bookmark &&
      ((bookmark.title && bookmark.title.toLowerCase().includes(filter.toLowerCase())) ||
        (bookmark.url && bookmark.url.toLowerCase().includes(filter.toLowerCase())))
    );
  }
  if (activeCategory !== 'all') {
    filteredBookmarks = filteredBookmarks.filter(bookmark =>
      bookmark &&
      (activeCategory === 'imported' ? bookmark.isExtensionBookmark : bookmark.category === activeCategory)
    );
  }
  // Render folders first
  folders.forEach(folder => {
    if (activeCategory !== 'all' && folder.category !== activeCategory) {
      return;
    }
    // check if the folder name contains the filter


    // check if the folder book marks contain the filter
    const folderItems = folder.items.filter(item => item.title.toLowerCase().includes(filter.toLowerCase()));

    if (filter && !folder.name.toLowerCase().includes(filter.toLowerCase()) && folderItems.length === 0) {
      return;
    }

    const folderEl = document.createElement('div');
    folderEl.className = 'bookmark-folder';
    folderEl.dataset.folderId = folder.id;
    const folderHeader = document.createElement('div');
    folderHeader.className = 'folder-header';
    folderHeader.addEventListener('click', () => toggleFolderContent(folder.id));
    const folderIcon = document.createElement('div');
    folderIcon.className = 'folder-icon';
    folderIcon.innerHTML = folder.isExtensionFolder ? '<i class="fab fa-chrome"></i>' : '<i class="fas fa-folder"></i>';
    folderIcon.style.backgroundColor = folder.color;
    const folderTitle = document.createElement('div');
    folderTitle.className = 'folder-title';
    folderTitle.textContent = folder.name;
    if (filter) {
      folderTitle.innerHTML = highlightText(folder.name, filter);
    }
    const folderActions = document.createElement('div');
    folderActions.className = 'folder-actions';
    // Only show edit/delete actions for custom folders
    if (!folder.isExtensionFolder) {
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
    }
    folderHeader.appendChild(folderIcon);
    folderHeader.appendChild(folderTitle);
    folderHeader.appendChild(folderActions);
    const folderContent = document.createElement('div');
    folderContent.className = 'folder-content';
    folderContent.dataset.folderId = folder.id;
    if (localStorage.getItem(`folder_${folder.id}_open`) === 'true') {
      folderContent.classList.add('open');
      folderIcon.innerHTML = folder.isExtensionFolder ? '<i class="fab fa-chrome"></i>' : '<i class="fas fa-folder-open"></i>';
    }
    if (folder.items.length > 0) {
      folder.items.forEach((item, itemIndex) => {
        const bookmarkEl = createBookmarkElement(item, () => {
          if (!folder.isExtensionFolder) {
            deleteBookmarkFromFolder(folder.id, itemIndex);
          }
        });
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
  // Then render bookmarks not in folders
  filteredBookmarks.forEach((bookmark, index) => {
    if (!bookmark.folder) { // Only render bookmarks not in folders
      const bookmarkEl = createBookmarkElement(bookmark, () => {
        if (!bookmark.isExtensionBookmark) {
          deleteBookmark(index);
        }
      });
      if (bookmark.isExtensionBookmark) {
        const chromeIcon = document.createElement('div');
        chromeIcon.className = 'chrome-source';
        chromeIcon.innerHTML = '<i class="fab fa-chrome" title="Chrome Bookmark"></i>';
        bookmarkEl.appendChild(chromeIcon);
        bookmarkEl.querySelector('.bookmark-delete')?.remove();
      }
      const categoryEl = document.createElement('div');
      categoryEl.className = 'bookmark-category';
      categoryEl.textContent = getCategoryLabel(bookmark.category);
      bookmarkEl.appendChild(categoryEl);
      if (filter && bookmark.title.toLowerCase().includes(filter.toLowerCase())) {
        const titleEl = bookmarkEl.querySelector('.bookmark-title');
        titleEl.innerHTML = highlightText(bookmark.title, filter);
      }
      bookmarksContainer.appendChild(bookmarkEl);
    }
  });
  // Show no results message if needed
  const activeCategoryFolder = folders.filter((cat) => cat.category === activeCategory)
  if (filteredBookmarks.length === 0 && activeCategoryFolder.length === 0) {
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
    // Center content in the icon container
    iconEl.style.display = 'flex';
    iconEl.style.alignItems = 'center';
    iconEl.style.justifyContent = 'center';
    if (bookmark.iconIsHtml || (typeof bookmark.icon === 'string' && bookmark.icon.match(/fa[srb]? fa-\w+/))) {
      iconEl.innerHTML = `<i class="${bookmark.icon}"></i>`;
    } else {
      iconEl.textContent = bookmark.icon;
    }
    iconEl.style.backgroundColor = bookmark.color;
  };
  const faviconImg = document.createElement('img');
  faviconImg.alt = 'Favicon';
  faviconImg.classList.add('favicon');
  // Set explicit width and height to ensure consistent sizing
  faviconImg.style.width = '36px';
  faviconImg.style.height = '36px';
  faviconImg.style.objectFit = 'contain';
  // Extract hostname properly
  let hostname;
  try {
    // Handle URLs with or without protocol
    if (!bookmark.url.startsWith('http')) {
      hostname = new URL('https://' + bookmark.url).hostname;
    } else {
      hostname = new URL(bookmark.url).hostname;
    }
  } catch (e) {
    // If URL parsing fails, use the raw URL as hostname
    hostname = bookmark.url.replace(/^https?:\/\//, '').split('/')[0];
  }
  // Create an array of possible favicon sources to try
  const faviconSources = [
    `https://www.google.com/s2/favicons?domain=${encodeURIComponent(bookmark.url)}&sz=32`,
    `https://www.google.com/s2/favicons?domain=${encodeURIComponent(hostname)}&sz=32`,
    // Icon.horse service with size parameter (primary, very reliable)
    `https://icon.horse/icon/${hostname}?size=small`,
    // Direct favicon approach - often works well
    `https://${hostname}/favicon.ico`,
    // DuckDuckGo's favicon service (good alternative)
    `https://icons.duckduckgo.com/ip3/${hostname}.ico`,
    // Google favicon service as backup
    `https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://${hostname}&size=32`,
    // Data URI fallback for a basic placeholder
    'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"%3E%3Crect width="16" height="16" fill="%23ccc"/%3E%3Ctext x="8" y="12" font-size="10" text-anchor="middle" fill="%23333"%3E?%3C/text%3E%3C/svg%3E'
  ];
  // Keep track of which source we're trying
  let currentSourceIndex = 0;
  // Debug information container for logging
  const debugInfo = {
    hostname: hostname,
    attempts: []
  };
  // Try the next favicon source without fetch (to avoid CORS issues)
  const tryNextSource = () => {
    try {
      if (currentSourceIndex < faviconSources.length) {
        const currentUrl = faviconSources[currentSourceIndex];
        currentSourceIndex++;
        // Log the attempt
        // console.log(`Trying favicon source ${currentSourceIndex}/${faviconSources.length}: ${currentUrl}`);
        debugInfo.attempts.push({ url: currentUrl });
        // Set the src directly - we'll rely on onerror/onload instead of fetch
        try {
          faviconImg.src = currentUrl;
        } catch (error) {
          console.log(`Error setting favicon source: ${error}`);
        }
      } else {
        // If all sources fail, use the fallback
        // console.log(`All favicon sources failed for ${hostname}`, debugInfo.attempts);
        setFallbackIcon();
      }
    } catch (error) {
      console.log(`Error trying favicon source: ${error}`);
    }
  };
  try {
    // Set up event handlers for success and error
    faviconImg.onload = () => {
      // Only proceed if the image actually loaded with content
      try {
        if (faviconImg.naturalWidth > 1) {
          const successUrl = faviconImg.src;
          // console.log(`✓ Favicon loaded successfully from: ${successUrl}`);
          // Add success info to the last attempt
          if (debugInfo.attempts.length > 0) {
            debugInfo.attempts[debugInfo.attempts.length - 1].success = true;
          }
          iconEl.innerHTML = '';
          // Handle icon styling and positioning
          iconEl.style.display = 'flex';
          iconEl.style.alignItems = 'center';
          iconEl.style.justifyContent = 'center';
          // Add the favicon image
          iconEl.appendChild(faviconImg);
          // Store the successful source URL as a data attribute
          iconEl.dataset.faviconSource = successUrl;
        } else {
          // Image too small or empty, try next source
          console.log(`✗ Favicon loaded but too small from: ${faviconImg.src}`);
          // Add failure info to the last attempt
          if (debugInfo.attempts.length > 0) {
            debugInfo.attempts[debugInfo.attempts.length - 1].error = 'Too small';
          }
        }
      } catch (error) {
        console.log(`Error loading favicon: ${error}`);
      }
    };
  } catch (error) {
    console.log(`Error loading favicon: ${error}`);
    tryNextSource();
  }
  faviconImg.onerror = () => {
    // Image failed to load, try next source
    console.log(`✗ Favicon failed to load from: ${faviconImg.src}`);
    // Add failure info to the last attempt
    if (debugInfo.attempts.length > 0) {
      debugInfo.attempts[debugInfo.attempts.length - 1].error = 'Failed to load';
    }
    tryNextSource();
  };
  // Start trying sources
  tryNextSource();
  // Set initial fallback icon (will be replaced if a favicon loads successfully)
  setFallbackIcon();
  const titleEl = document.createElement('div');
  titleEl.className = 'bookmark-title';
  titleEl.textContent = shortenTitle(bookmark.title); // Use the helper function to shorten the title
  if (bookmark.isExtensionBookmark) {
    const chromeIcon = document.createElement('div');
    chromeIcon.className = 'chrome-source';
    chromeIcon.innerHTML = '<i class="fab fa-chrome" title="Chrome Bookmark"></i>';
    bookmarkEl.appendChild(chromeIcon);
  }
  // Remove delete button for most visited items
  if (!bookmark.isMostVisited) {
    const deleteBtn = document.createElement('div');
    deleteBtn.className = 'bookmark-delete';
    deleteBtn.innerHTML = '<i class="fas fa-times"></i>';
    deleteBtn.addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();
      deleteBookmark(bookmark);
    });
    bookmarkEl.appendChild(deleteBtn);
  }
  if (bookmark.folder) {
    const folderEl = document.createElement('div');
    folderEl.className = 'bookmark-folder-label';
    folderEl.textContent = `Folder: ${bookmark.folder}`;
    bookmarkEl.appendChild(folderEl);
  }
  bookmarkEl.appendChild(iconEl);
  bookmarkEl.appendChild(titleEl);
  if (bookmark.isMostVisited) {
    getVisitCount(bookmark.url).then(count => {
      const visitCountEl = document.createElement('div');
      visitCountEl.className = 'visit-count';
      visitCountEl.textContent = `${count} visits`;
      bookmarkEl.appendChild(visitCountEl);
    });
  }
  return bookmarkEl;
}
function shortenTitle(title) {
  if (title.length > 20) {
    return title.substring(0, 17) + '...';
  }
  return title;
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
  chrome.storage.sync.get(['folders'], function (data) {
    const folders = data.folders || DEFAULT_FOLDERS;
    const folderIndex = folders.findIndex(f => f.id === folderId);
    if (folderIndex !== -1) {
      folders[folderIndex].items.splice(itemIndex, 1);
      chrome.storage.sync.set({ folders: folders });
      renderBookmarks(data.bookmarks || DEFAULT_BOOKMARKS, folders, searchBookmarks.value);
    }
  });
}
function deleteBookmark(bookmark) {
  if (confirm('Are you sure you want to delete this bookmark?')) {
    if (bookmark.isExtensionBookmark) {
      // Delete from Chrome bookmarks
      chrome.bookmarks.remove(bookmark.id, () => {
        chrome.storage.sync.get(['bookmarks', 'folders'], function (data) {
          // Get Chrome bookmarks
          chrome.bookmarks.getTree((chromeBookmarkTree) => {
            const chromeBookmarks = processBookmarkTree(chromeBookmarkTree[0]);
            const markedChromeBookmarks = chromeBookmarks.map(b => ({
              ...b,
              isExtensionBookmark: true,
              category: 'chrome'
            }));
            const markedExtensionBookmarks = (data.bookmarks || []).map(b => ({
              ...b,
              isExtensionBookmark: false
            }));
            const allBookmarks = [...markedChromeBookmarks, ...markedExtensionBookmarks];
            renderBookmarks(allBookmarks, data.folders || [], searchBookmarks?.value || '');
            showToast('Bookmark deleted successfully');
          });
        });
      });
    } else {
      // Delete custom bookmark
      chrome.storage.sync.get(['bookmarks', 'folders'], function (data) {
        const bookmarks = data.bookmarks || [];
        const updatedBookmarks = bookmarks.filter(b =>
          !(b.url === bookmark.url && b.title === bookmark.title)
        );
        chrome.storage.sync.set({ bookmarks: updatedBookmarks }, () => {
          // Get Chrome bookmarks for complete refresh
          chrome.bookmarks.getTree((chromeBookmarkTree) => {
            const chromeBookmarks = processBookmarkTree(chromeBookmarkTree[0]);
            const markedChromeBookmarks = chromeBookmarks.map(b => ({
              ...b,
              isExtensionBookmark: true,
              category: 'chrome'
            }));
            const markedExtensionBookmarks = updatedBookmarks.map(b => ({
              ...b,
              isExtensionBookmark: false
            }));
            const allBookmarks = [...markedChromeBookmarks, ...markedExtensionBookmarks];
            renderBookmarks(allBookmarks, data.folders || [], searchBookmarks?.value || '');
            showToast('Bookmark deleted successfully');
          });
        });
      });
    }
  }
}
function refreshBookmarks() {
  if (window.bookmarkImporter) {
    window.bookmarkImporter.getAllBookmarks().then(({ bookmarks, folders }) => {
      renderBookmarks(bookmarks, folders, searchBookmarks ? searchBookmarks.value : '');
    });
  }
}
function editFolder(folderId) {
  chrome.storage.sync.get(['folders'], function (data) {
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
    chrome.storage.sync.get(['folders'], function (data) {
      const folders = data.folders || DEFAULT_FOLDERS;
      const updatedFolders = folders.filter(f => f.id !== folderId);
      chrome.storage.sync.set({ folders: updatedFolders });
      chrome.storage.sync.get(['bookmarks'], function (bookmarkData) {
        renderBookmarks(bookmarkData.bookmarks || DEFAULT_BOOKMARKS, updatedFolders, searchBookmarks.value);
      });
    });
  }
}
// Helper function to check for duplicate URLs
function isUrlDuplicate(url, bookmarks = [], folders = []) {
  // Normalize the URL
  const normalizedUrl = url.replace(/^https?:\/\//, '').replace(/\/$/, '');
  // Check in bookmarks
  if (bookmarks.some(bookmark => {
    const bookmarkUrl = bookmark.url.replace(/^https?:\/\//, '').replace(/\/$/, '');
    return bookmarkUrl === normalizedUrl;
  })) {
    return true;
  }
  // Check in folder items
  return folders.some(folder =>
    folder.items && folder.items.some(item => {
      const itemUrl = item.url.replace(/^https?:\/\//, '').replace(/\/$/, '');
      return itemUrl === normalizedUrl;
    })
  );
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
    // alert('Title and URL are required');
    showNotification('Title and URL are required', 'error');
    return;
  }
  let formattedUrl = url;
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    formattedUrl = 'https://' + url;
  }
  // Check for duplicates in both chrome bookmarks and our storage
  chrome.bookmarks.getTree((chromeBookmarkTree) => {
    chrome.storage.sync.get(['bookmarks', 'folders'], function (data) {
      const existingBookmarks = data.bookmarks || DEFAULT_BOOKMARKS;
      const existingFolders = data.folders || DEFAULT_FOLDERS;
      const processedChromeBookmarks = processChromeBookmarks(chromeBookmarkTree[0]);
      const allBookmarks = [...existingBookmarks, ...(processedChromeBookmarks.bookmarks || [])];
      const allFolders = [...existingFolders, ...(processedChromeBookmarks.folders || [])];
      if (isUrlDuplicate(formattedUrl, allBookmarks, allFolders)) {
        showNotification('This URL already exists in your bookmarks', 'info');
        return;
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
        chrome.storage.sync.get(['folders'], function (data) {
          const folders = data.folders || DEFAULT_FOLDERS;
          const folderIndex = folders.findIndex(f => f.id === folderId);
          if (folderIndex !== -1) {
            folders[folderIndex].items.push(newBookmark);
            chrome.storage.sync.set({ folders: folders }, () => {
              closeBookmarkModal();
              refreshBookmarks();
              showNotification('Bookmark added successfully to folder');
            });
          }
        });
      } else {
        chrome.bookmarks.create({
          title: newBookmark.title,
          url: newBookmark.url
        }, () => {
          closeBookmarkModal();
          refreshBookmarks();
          showNotification('Bookmark added successfully');
        });
      }
    });
  });
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
    // alert('Please enter a folder name');
    showNotification('Please enter a folder name', 'error');
    return;
  }
  chrome.storage.sync.get(['folders'], function (data) {
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
    chrome.storage.sync.get(['bookmarks'], function (bookmarkData) {
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
  chrome.storage.sync.get(['folders'], function (data) {
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
  chrome.storage.sync.get('settings', function (data) {
    const settings = data.settings || DEFAULT_SETTINGS;
    settings.darkMode = darkModeToggle.checked;
    saveSettings(settings);
    applySettings(settings);
  });
}
function updateClockFormat() {
  chrome.storage.sync.get('settings', function (data) {
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
  chrome.storage.sync.get('settings', function (data) {
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
    // check the file size if size greater then 2 MB then show error toast
    if (this.files[0].size > 2 * 1024 * 1024) {
      showNotification('File size exceeds 2 MB. Please choose a smaller file.');
      return;
    }
    const reader = new FileReader();
    reader.onload = function (e) {
      chrome.storage.sync.get('settings', function (data) {
        const settings = data.settings || DEFAULT_SETTINGS;
        settings.background = 'custom';
        // settings.customBackground = e.target.result;
        // set the background  result on local storage
        localStorage.setItem('customBackground', e.target.result);
        saveSettings(settings);
        applySettings(settings);
      });
    }
    reader.readAsDataURL(this.files[0]);
  }
}
function updateTimeZone() {
  chrome.storage.sync.get('settings', function (data) {
    const settings = data.settings || DEFAULT_SETTINGS;
    settings.timeZone = timeZoneSelect.value;
    saveSettings(settings);
    updateClock();
  });
}
function toggleShowSeconds() {
  chrome.storage.sync.get('settings', function (data) {
    const settings = data.settings || DEFAULT_SETTINGS;
    settings.showSeconds = showSecondsToggle.checked;
    saveSettings(settings);
    applySettings(settings);
  });
}
function updateTemperatureUnit() {
  chrome.storage.sync.get('settings', function (data) {
    const settings = data.settings || DEFAULT_SETTINGS;
    settings.useFahrenheit = tempUnitToggle.checked;
    saveSettings(settings);
    // Update weather display with new temperature unit
    if (settings.showWeatherWidget) {
      getWeatherData();
    }
  });
}
function updateGitHubUsername() {
  chrome.storage.sync.get('settings', function (data) {
    const settings = data.settings || DEFAULT_SETTINGS;
    settings.githubUsername = githubUsernameInput.value;
    saveSettings(settings);
    fetchGitHubActivity(settings.githubUsername);
  });
}
function refreshGitHubActivity() {
  document.getElementById('refreshGitHub').classList.add('rotating');
  chrome.storage.sync.get('settings', function (data) {
    const settings = data.settings || DEFAULT_SETTINGS;
    fetchGitHubActivity(settings.githubUsername);
    setTimeout(() => {
      document.getElementById('refreshGitHub').classList.remove('rotating');
    }, 1000);
  });
}
function filterBookmarks() {
  const searchTerm = this.value.trim();
  const isMostVisited = document.getElementById('toggleMostVisited').checked;
  if (isMostVisited) {
    // Filter most visited sites
    chrome.topSites.get((sites) => {
      const mostVisitedBookmarks = sites.map(site => ({
        title: site.title || new URL(site.url).hostname,
        url: site.url,
        icon: site.title ? site.title[0].toUpperCase() : new URL(site.url).hostname[0].toUpperCase(),
        color: '#ffffff0f',
        category: 'most-visited',
        isMostVisited: true
      }));
      // Filter most visited sites based on search term
      const filteredSites = mostVisitedBookmarks.filter(site =>
        site.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        site.url.toLowerCase().includes(searchTerm.toLowerCase())
      );
      // Get visit counts and render
      Promise.all(filteredSites.map(async site => {
        const visits = await getVisitCount(site.url);
        const lastVisit = await getLastVisit(site.url);
        return {
          ...site,
          lastVisitDate: lastVisit !== 'Never' ? new Date(lastVisit).getTime() : 0,
          recentVisits: lastVisit
        };
      })).then(sitesWithVisits => {
        // Sort by lastVisitDate - most recent first
        sitesWithVisits.sort((a, b) => b.lastVisitDate - a.lastVisitDate);
        renderBookmarks(sitesWithVisits, []);
      });
    });
  } else {
    chrome.storage.sync.get(['bookmarks', 'folders'], function (data) {
      const extensionBookmarks = data.bookmarks || DEFAULT_BOOKMARKS;
      const folders = data.folders || DEFAULT_FOLDERS;
      // Get Chrome bookmarks
      chrome.bookmarks.getTree((chromeBookmarkTree) => {
        const chromeBookmarks = processBookmarkTree(chromeBookmarkTree[0]);
        // Mark bookmarks by source
        const markedChromeBookmarks = chromeBookmarks.map(b => ({
          ...b,
          isExtensionBookmark: true,
          category: 'chrome' // Add this helper function
        }));
        const markedExtensionBookmarks = extensionBookmarks.map(b => ({
          ...b,
          isExtensionBookmark: false
        }));
        const allBookmarks = [...markedChromeBookmarks, ...markedExtensionBookmarks];
        renderBookmarks(allBookmarks, folders, searchTerm);
      });
    });
  }
}
// Update getLastVisit to return timestamp
async function getLastVisit(url) {
  return new Promise((resolve) => {
    chrome.history.getVisits({ url: url }, (visits) => {
      if (visits && visits.length > 0) {
        // Sort visits by time and get the most recent
        const latestVisit = Math.max(...visits.map(v => v.visitTime));
        resolve(latestVisit);
      } else {
        resolve('Never');
      }
    });
  });
}
function switchBookmarkTab() {
  bookmarksTabs.forEach(tab => tab.classList.remove('active'));
  this.classList.add('active');
  localStorage.setItem('active_bookmarks_tab', this.dataset.category);
  chrome.storage.sync.get(['bookmarks', 'folders'], function (data) {
    const extensionBookmarks = data.bookmarks || DEFAULT_BOOKMARKS;
    const folders = data.folders || DEFAULT_FOLDERS;
    // Get Chrome bookmarks
    chrome.bookmarks.getTree((chromeBookmarkTree) => {
      const chromeBookmarks = processBookmarkTree(chromeBookmarkTree[0]);
      // Mark bookmarks by source
      const markedChromeBookmarks = chromeBookmarks.map(b => ({
        ...b,
        isExtensionBookmark: true,
        category: 'chrome'
      }));
      const markedExtensionBookmarks = extensionBookmarks.map(b => ({
        ...b,
        isExtensionBookmark: false
      }));
      const allBookmarks = [...markedChromeBookmarks, ...markedExtensionBookmarks];
      renderBookmarks(allBookmarks, folders, searchBookmarks.value);
    });
  });
}
// Add these helper functions
function processBookmarkTree(node, result = []) {
  if (node.url) {
    result.push({
      title: node.title,
      url: node.url,
      id: node.id,
      dateAdded: node.dateAdded
    });
  }
  if (node.children) {
    node.children.forEach(child => processBookmarkTree(child, result));
  }
  return result;
}
function guessCategory(url) {
  const lowerUrl = url.toLowerCase();
  // Known developer sites
  if (lowerUrl.includes('github.com') ||
    lowerUrl.includes('stackoverflow.com') ||
    lowerUrl.includes('npmjs.com') ||
    lowerUrl.includes('developer.mozilla.org') ||
    lowerUrl.includes('w3schools.com') ||
    lowerUrl.includes('codepen.io') ||
    lowerUrl.includes('jsfiddle.net')) {
    return 'dev';
  }
  // AI tools
  if (lowerUrl.includes('chat.openai.com') ||
    lowerUrl.includes('claude.ai') ||
    lowerUrl.includes('bard.google.com') ||
    lowerUrl.includes('perplexity.ai') ||
    lowerUrl.includes('phind.com')) {
    return 'ai';
  }
  // Productivity tools
  if (lowerUrl.includes('gmail.com') ||
    lowerUrl.includes('calendar.google.com') ||
    lowerUrl.includes('docs.google.com') ||
    lowerUrl.includes('notion.so') ||
    lowerUrl.includes('trello.com') ||
    lowerUrl.includes('slack.com')) {
    return 'prod';
  }
  // Social media
  if (lowerUrl.includes('twitter.com') ||
    lowerUrl.includes('facebook.com') ||
    lowerUrl.includes('linkedin.com') ||
    lowerUrl.includes('instagram.com') ||
    lowerUrl.includes('reddit.com') ||
    lowerUrl.includes('tiktok.com')) {
    return 'social';
  }
  // Shopping / commerce
  if (lowerUrl.includes('amazon.') ||
    lowerUrl.includes('flipkart.') ||
    lowerUrl.includes('ebay.') ||
    lowerUrl.includes('shopify.') ||
    lowerUrl.includes('etsy.com')) {
    return 'shopping';
  }
  // Entertainment / media
  if (lowerUrl.includes('youtube.com') ||
    lowerUrl.includes('netflix.com') ||
    lowerUrl.includes('spotify.com') ||
    lowerUrl.includes('hotstar.com') ||
    lowerUrl.includes('primevideo.com')) {
    return 'entertainment';
  }
  // Education
  if (lowerUrl.includes('khanacademy.org') ||
    lowerUrl.includes('coursera.org') ||
    lowerUrl.includes('edx.org') ||
    lowerUrl.includes('udemy.com') ||
    lowerUrl.includes('brilliant.org')) {
    return 'education';
  }
  // Finance
  if (lowerUrl.includes('paypal.com') ||
    lowerUrl.includes('paytm.') ||
    lowerUrl.includes('wise.com')) {
    return 'finance';
  }
  // Food
  if (lowerUrl.includes('food') ||
    lowerUrl.includes('restaurant') ||
    lowerUrl.includes('cafe') ||
    lowerUrl.includes('zomato')) {
    return 'food';
  }
  // Travel
  if (lowerUrl.includes('airbnb.com') ||
    lowerUrl.includes('booking.com') ||
    lowerUrl.includes('makemytrip.')) {
    return 'travel';
  }
  // Heuristic keyword matching
  const keywords = {
    dev: ['code', 'dev', 'api', 'git', 'docs'],
    ai: ['ai', 'ml', 'gpt'],
    prod: ['task', 'todo', 'calendar', 'mail', 'project'],
    social: ['profile', 'feed', 'friends', 'status'],
    shopping: ['shop', 'cart', 'product', 'checkout'],
    entertainment: ['video', 'music', 'tv', 'movie'],
    education: ['learn', 'course', 'study', 'class'],
    finance: ['money', 'bank', 'loan', 'fintech'],
    food: ['food', 'restaurant', 'cafe', 'zomato'],
    travel: ['travel', 'flight', 'hotel', 'booking']
  };
  for (const [category, keys] of Object.entries(keywords)) {
    for (const key of keys) {
      if (lowerUrl.includes(key)) {
        return category;
      }
    }
  }
  return 'other';
}
function handleSearch(e) {
  e.preventDefault();
  const query = searchInput.value.trim();
  if (query) {
    // Use Chrome's search API to perform the search
    chrome.search.query({
      text: query,
      disposition: 'NEW_TAB'  // Open in new tab
    });
    searchInput.value = '';
  }
}
function toggleWeatherWidget() {
  chrome.storage.sync.get('settings', function (data) {
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
  chrome.storage.sync.get('settings', function (data) {
    const settings = data.settings || DEFAULT_SETTINGS;
    settings.showBookmarks = bookmarksToggle.checked;
    saveSettings(settings);
    if (bookmarksToggle.checked) {
      // remove active from all tabs
      localStorage.setItem('active_bookmarks_tab', 'all');
      bookmarksTabs.forEach(tab => tab.classList.remove('active'));
      bookmarksTabs[0].classList.add('active');
      showMostVisitedView();
      showNotification('MostVisited bookmark view enabled');
    } else {
      renderBookmarks(data.bookmarks || DEFAULT_BOOKMARKS, data.folders || DEFAULT_FOLDERS, searchBookmarks.value);
      showBookmarksView();
      showNotification('Bookmarks view enabled');
    }
  });
}
function toggleDevPanel() {
  chrome.storage.sync.get('settings', function (data) {
    const settings = data.settings || DEFAULT_SETTINGS;
    const isEnabled = devPanelToggleSwitch.checked;
    // If enabling dev panel, show at least one section
    if (isEnabled && !settings.showGitHubActivity &&
      !settings.showApiStatus && !settings.showQuickDocs &&
      !settings.showPomodoroTimer) {
      settings.showGitHubActivity = true;
    }
    // If disabling, hide all sections
    if (!isEnabled) {
      settings.showGitHubActivity = false;
      settings.showApiStatus = false;
      settings.showQuickDocs = false;
      settings.showPomodoroTimer = false;
    }
    settings.showDevPanel = isEnabled;
    saveSettings(settings);
    applySettings(settings);
  });
}
function toggleTerminalNotes() {
  chrome.storage.sync.get('settings', function (data) {
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
  chrome.storage.sync.get('settings', function (data) {
    const settings = data.settings || DEFAULT_SETTINGS;
    const format = settings.clockFormat;
    const timeZoneSetting = settings.timeZone || 'local';
    let timeToShow = now;
    // Update timezone display
    const timezoneElement = document.querySelector('#timezone span');
    if (timeZoneSetting === 'local') {
      const localTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      timezoneElement.textContent = `${localTz.replace('_', ' ')}`;
    } else {
      timezoneElement.textContent = timeZoneSetting;
    }
    if (timeZoneSetting !== 'local') {
      const timeZoneOffsets = {
        'UTC': 0,
        'EST': -5,
        'PST': -8,
        'CST': -6,
        'MST': -7,
        'AST': -4,
        'IST': 5.5,
        'CET': 1,
        'JST': 9,
        'GMT': 0,
        'GMT+1': 1,
        'GMT+2': 2,
        'GMT+3': 3,
        'GMT+4': 4
      };
      const utcTime = now.getTime() + (now.getTimezoneOffset() * 60000);
      // Handle fractional hours (like IST which is UTC+5:30)
      const offsetHours = Math.floor(timeZoneOffsets[timeZoneSetting]);
      const offsetMinutes = (timeZoneOffsets[timeZoneSetting] % 1) * 60;
      timeToShow = new Date(utcTime + (3600000 * offsetHours) + (60000 * offsetMinutes));
    }
    let hours = timeToShow.getHours();
    let ampm = '';
    if (format === '12') {
      ampm = hours >= 12 ? ' PM' : ' AM';
      hours = hours % 12;
      hours = hours ? hours : 12; // Fixed the bug: hours should be hours, not 12
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
    chrome.storage.sync.get('settings', function (data) {
      const settings = data.settings || DEFAULT_SETTINGS;
      const useFahrenheit = settings.useFahrenheit;
      let unit = '°C';
      if (useFahrenheit) {
        temp = Math.round((temp * 9 / 5) + 32);
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
  chrome.storage.sync.get('settings', function (data) {
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
    document.title = `${minutes}:${seconds} - Developer Home`;
  } else {
    document.title = `Developer Home`;
  }
}
function loadNotes() {
  chrome.storage.sync.get('devNotes', function (data) {
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
      <span class="note-icon"  >
        <i class="note-checkbox ${note.isCompleted ? 'fas fa-check-circle text-success  ' : 'fa-regular fa-circle'}" data-index="${index}"></i>
      </span>
      <span class="note-index">[${index + 1}]</span>
      <span class="note-content">${note.isCompleted ? '<s>' : ''}${formatNoteText(note.content)}${note.isCompleted ? '</s>' : ''}</span>
      <span class="note-time">${formatNoteDate(note.timestamp)}</span>
      <span class="note-delete" data-index="${index}">
        <i class="fas fa-times"></i>
      </span>
    `;
    terminalOutput.appendChild(noteElement);
  });
  document.querySelectorAll('.note-delete').forEach(btn => {
    btn.addEventListener('click', function () {
      const index = parseInt(this.getAttribute('data-index'));
      notes.splice(index, 1);
      showNotification(`Note Deleted Successfully`, 'error');
      saveNotes();
      renderNotes();
    });
  });
  document.querySelectorAll('.note-checkbox').forEach(btn => {
    btn.addEventListener('click', function () {
      const index = parseInt(this.getAttribute('data-index'));
      notes[index].isCompleted = !notes[index].isCompleted;
      showNotification(`Note set as ${notes[index].isCompleted ? 'Completed' : 'Uncompleted'}`, 'success');
      saveNotes();
      renderNotes();
    });
  }
  );
  terminalOutput.scrollTop = terminalOutput.scrollHeight;
  terminalInput.focus();
  terminalInput.textContent = '';
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
    content: content,
    timestamp: Date.now(),
    id: Date.now(),
    isCompleted: false
  };
  notes.push(note);
  saveNotes();
  renderNotes();
  showNotification(`Note Added Successfully`);
  terminalInput.textContent = '';
  terminalInput.focus();
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
    chrome.storage.sync.get('settings', function (data) {
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
// Dev Tools Functions
function initializeDevTools() {
  // Setup collapsible sections
  document.querySelectorAll('.section-header').forEach(header => {
    const targetId = header.dataset.target;
    const content = document.getElementById(targetId);
    // Restore collapsed state from localStorage
    const isCollapsed = localStorage.getItem(`${targetId}-collapsed`) === 'true';
    if (isCollapsed) {
      header.classList.add('collapsed');
      content.classList.add('collapsed');
    }
    // Add click handler
    header.addEventListener('click', () => {
      // Toggle collapsed state
      const isCollapsing = !header.classList.contains('collapsed');
      header.classList.toggle('collapsed');
      content.classList.toggle('collapsed');
      // Save state to localStorage
      localStorage.setItem(`${targetId}-collapsed`, isCollapsing);
      // Optional: Add smooth height transition
      if (!isCollapsing) {
        content.style.maxHeight = content.scrollHeight + 'px';
        setTimeout(() => {
          content.style.maxHeight = null;
        }, 0);
      } else {
        content.style.maxHeight = '0';
      }
    });
  });
  chrome.storage.sync.get('settings', function (data) {
    const settings = data.settings || DEFAULT_SETTINGS;
    const showDevPanel = settings.showDevPanel;
    const showGitHubActivity = settings.showGitHubActivity
    const showPomodoroTimer = settings.showPomodoroTimer
    const showQuickDocs = settings.showQuickDocs
    const showApiStatus = settings.showApiStatus
    if (showDevPanel && showGitHubActivity) {
      fetchGitHubActivity(settings.githubUsername || 'github');
    }
    if (showDevPanel && showPomodoroTimer) {
      updateTimerDisplay();
    }
    if (showDevPanel && showQuickDocs) {
      setupQuickDocs();
    }
    if (showDevPanel && showApiStatus) {
      setupApiStatus();
    }
  });
  // Initialize features
}
// Add a helper function to show/hide sections smoothly
function toggleSection(header, content, isCollapsing) {
  if (isCollapsing) {
    content.style.maxHeight = '0';
    content.addEventListener('transitionend', () => {
      content.classList.add('collapsed');
    }, { once: true });
  } else {
    content.classList.remove('collapsed');
    content.style.maxHeight = content.scrollHeight + 'px';
    content.addEventListener('transitionend', () => {
      content.style.maxHeight = null;
    }, { once: true });
  }
}
// Add this helper function for notifications
function showNotification(message, type) {
  // remove old notification
  const oldNotification = document.querySelector('.toast-message');
  if (oldNotification) {
    oldNotification.remove();
  }
  setTimeout(() => {
    // check type if not show success
    let iconClass = 'fas fa-check-circle';
    if (type !== 'success') {
      iconClass = 'fas fa-check-circle';
    }
    else if (type === 'error') {
      iconClass = 'fas fa-exclamation-triangle';
    }
    else if (type === 'info') {
      iconClass = 'fas fa-info-circle';
    }
    const toast = document.createElement('div');
    toast.className = 'toast-message';
    toast.innerHTML = `<i class="${iconClass}"></i> ${message}`;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.remove();
    }
      , 3000);
  }, 100);
}
function setupApiStatus() {
  const apiList = document.querySelector('.api-list');
  // Check API status every 5 minutes
  checkApiStatus();
  setInterval(checkApiStatus, 5 * 60 * 1000);
}
// Update the checkApiStatus function
async function checkApiStatus() {
  chrome.storage.sync.get('apiList', async function (data) {

    const ApisList = data.apiList || DEFAULT_APIS;
    const apiList = document.querySelector('.api-list');
    apiList.innerHTML = ''; // Clear existing statuses
    for (const api of ApisList) {
      try {
        // Create API item element
        const apiItem = document.createElement('div');
        apiItem.className = 'api-item';
        // Add loading state
        apiItem.innerHTML = `
        <div class="api-name">
          <i class="${api.icon}"></i>
          ${api.name}
        </div>
        <div class="api-status-indicator status-loading"></div>

        <div class="api-status-delete"><i class="fas fa-times delete-api-status"></i></div>
      `;
        apiList.appendChild(apiItem);
        const response = await fetch(api.url, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
          timeout: 5000 // 5 second timeout
        });
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        // Determine status based on indicator field
        let status = 'up';
        if (data.status && data.status.indicator) {
          // Map the indicator values to your status classes
          switch (data.status.indicator) {
            case 'none':
              status = 'up';  // All Systems Operational
              break;
            case 'minor':
              status = 'degraded';  // Minor issues
              break;
            case 'major':
            case 'critical':
              status = 'down';  // Major issues or outage
              break;
            default:
              status = 'unknown';
          }
        } else if (data.page && data.page.status) {
          status = data.page.status;
        }
        // Update status indicator
        const statusIndicator = apiItem.querySelector('.api-status-indicator');
        statusIndicator.className = `api-status-indicator status-${status}`;
        // Add tooltip with status description
        let tooltipText = "Unknown status";
        if (data.status && data.status.description) {
          tooltipText = data.status.description;
        }
        statusIndicator.title = tooltipText;
        // handle the delete button
        const deleteButton = apiItem.querySelector('.delete-api-status');
        deleteButton.addEventListener('click', () => {
          apiList.removeChild(apiItem);
          // Remove the API from the list
          const index = ApisList.findIndex(item => item.name === api.name);
          if (index !== -1) {
            ApisList.splice(index, 1);
            chrome.storage.sync.set({ apiList: ApisList });
          }
          showNotification(`API status for ${api.name} removed`, 'info');
          // render the api status

        }
        );
        // Update details

      } catch (error) {
        console.error(`Error checking ${api.name} status:`, error);
        // Show error state
        const apiItem = document.createElement('div');
        apiItem.className = 'api-item';
        apiItem.innerHTML = `
        <div class="api-name">
          <i class="${api.icon}"></i>
          ${api.name}
        </div>
        <div class="api-status-indicator status-down" title="Unable to fetch status"></div>
      `;
        apiList.appendChild(apiItem);
      }
    }
  });

}
// Helper function to check a single API status
async function checkSingleApiStatus(api, apiItemElement) {
  const statusIndicator = apiItemElement.querySelector('.api-status-indicator');
  const detailsSection = apiItemElement.querySelector('.api-details');
  // Set to loading state
  statusIndicator.className = 'api-status-indicator status-loading';
  detailsSection.innerHTML = '<div class="status-text">Checking...</div>';
  try {
    const response = await fetch(api.url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      timeout: 5000
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    // Determine status
    let status = 'up';
    let statusText = 'Operational';
    let lastUpdated = new Date().toLocaleString();
    if (data.status) {
      status = data.status.indicator ||
        (data.status.description === 'All Systems Operational' ? 'up' : 'degraded');
      statusText = data.status.description || statusText;
      lastUpdated = data.page?.updated_at ? new Date(data.page.updated_at).toLocaleString() : lastUpdated;
    } else if (data.page && data.page.status) {
      status = data.page.status;
      statusText = data.page.status_description || statusText;
      lastUpdated = data.page.updated_at ? new Date(data.page.updated_at).toLocaleString() : lastUpdated;
    }
    // Update status indicator
    statusIndicator.className = `api-status-indicator status-${status}`;
    statusIndicator.title = `Status: ${status.charAt(0).toUpperCase() + status.slice(1)}`;
    // Update details
    detailsSection.innerHTML = `
      <div class="status-text">${statusText}</div>
      <div class="last-updated">Last updated: ${lastUpdated}</div>
      ${api.url ? `<a href="${api.url}" target="_blank" class="view-details">View Details</a>` : ''}
    `;
  } catch (error) {
    console.error(`Error rechecking ${api.name} status:`, error);
    statusIndicator.className = 'api-status-indicator status-down';
    statusIndicator.title = 'Unable to fetch status';
    detailsSection.innerHTML = `
      <div class="status-text">Status Check Failed</div>
      <div class="error-message">${error.message}</div>
      <div class="last-updated">Last attempt: ${new Date().toLocaleString()}</div>
      ${api.url ? `<a href="${api.url}" target="_blank" class="retry-check">Retry</a>` : ''}
    `;
    // Re-add event listener for retry
    const retryButton = detailsSection.querySelector('.retry-check');
    if (retryButton) {
      retryButton.addEventListener('click', (e) => {
        e.preventDefault();
        checkSingleApiStatus(api, apiItemElement);
      });
    }
  }
}
function setupQuickDocs() {
  const docsSearch = document.getElementById('docsSearch');
  const docsLinks = document.querySelector('.docs-links');
  // Render initial documentation links
  renderDocLinks();
  // Setup search functionality
  docsSearch.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filteredLinks = DOCUMENTATION_LINKS.filter(link =>
      link.name.toLowerCase().includes(searchTerm)
    );
    renderDocLinks(filteredLinks);
  });
}
function renderDocLinks(links = DOCUMENTATION_LINKS) {
  const docsLinks = document.querySelector('.docs-links');
  docsLinks.innerHTML = links.map(link => `
    <a href="${link.url}" class="doc-link" target="_blank">
      <i class="${link.icon}"></i>
      ${link.name}
    </a>
  `).join('');
}
// Add new toggle functions
function toggleGitHubActivity() {
  chrome.storage.sync.get('settings', function (data) {
    const settings = data.settings || DEFAULT_SETTINGS;
    settings.showGitHubActivity = document.getElementById('githubActivityToggle').checked;
    saveSettings(settings);
    applySettings(settings);
    if (settings.showGitHubActivity) {
      fetchGitHubActivity(settings.githubUsername || 'github');
    }
  });
}
function toggleApiStatus() {
  chrome.storage.sync.get('settings', function (data) {
    const settings = data.settings || DEFAULT_SETTINGS;
    settings.showApiStatus = document.getElementById('apiStatusToggle').checked;
    saveSettings(settings);
    applySettings(settings);
    if (settings.showApiStatus) {
      checkApiStatus();
    }
  });
}
function toggleQuickDocs() {
  chrome.storage.sync.get('settings', function (data) {
    const settings = data.settings || DEFAULT_SETTINGS;
    settings.showQuickDocs = document.getElementById('quickDocsToggle').checked;
    saveSettings(settings);
    applySettings(settings);
    if (settings.showQuickDocs) {
      setupQuickDocs();
    }
  });
}
function togglePomodoroTimer() {
  chrome.storage.sync.get('settings', function (data) {
    const settings = data.settings || DEFAULT_SETTINGS;
    settings.showPomodoroTimer = document.getElementById('pomodoroToggle').checked;
    saveSettings(settings);
    applySettings(settings);
    if (settings.showPomodoroTimer) {
      updateTimerDisplay();
    }
  });
}
// Add new function to handle reset
function resetToDefault() {
  if (confirm('Are you sure you want to reset all settings and bookmarks to default? This cannot be undone.')) {
    // Show loading state
    resetDefaultBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Resetting...';
    resetDefaultBtn.disabled = true;
    // Reset all storage
    chrome.storage.sync.set({
      settings: DEFAULT_SETTINGS,
      bookmarks: DEFAULT_BOOKMARKS,
      folders: DEFAULT_FOLDERS,
      apiList: DEFAULT_APIS
    }, function () {
      // Apply default settings
      applySettings(DEFAULT_SETTINGS);
      // Refresh bookmarks display
      renderBookmarks(DEFAULT_BOOKMARKS, DEFAULT_FOLDERS, '');
      // Update UI elements
      darkModeToggle.checked = DEFAULT_SETTINGS.darkMode;
      clockFormatSelect.value = DEFAULT_SETTINGS.clockFormat;
      timeZoneSelect.value = DEFAULT_SETTINGS.timeZone;
      showSecondsToggle.checked = DEFAULT_SETTINGS.showSeconds;
      tempUnitToggle.checked = DEFAULT_SETTINGS.useFahrenheit;
      weatherWidgetToggle.checked = DEFAULT_SETTINGS.showWeatherWidget;
      bookmarksToggle.checked = DEFAULT_SETTINGS.showBookmarks;
      devPanelToggleSwitch.checked = DEFAULT_SETTINGS.showDevPanel;
      terminalNotesToggle.checked = DEFAULT_SETTINGS.showTerminalNotes;
      githubUsernameInput.value = DEFAULT_SETTINGS.githubUsername;
      // Reset dev panel toggles
      document.getElementById('githubActivityToggle').checked = DEFAULT_SETTINGS.showGitHubActivity;
      document.getElementById('apiStatusToggle').checked = DEFAULT_SETTINGS.showApiStatus;
      document.getElementById('quickDocsToggle').checked = DEFAULT_SETTINGS.showQuickDocs;
      document.getElementById('pomodoroToggle').checked = DEFAULT_SETTINGS.showPomodoroTimer;
      // Reset button state
      setTimeout(() => {
        resetDefaultBtn.innerHTML = '<i class="fas fa-undo-alt"></i> Reset to Default';
        resetDefaultBtn.disabled = false;
        // Show success message
        const toast = document.createElement('div');
        toast.className = 'toast-message';
        toast.innerHTML = '<i class="fas fa-check-circle"></i> Settings reset successfully';
        document.body.appendChild(toast);
        setTimeout(() => {
          toast.remove();
        }, 3000);
      }, 1000);
    });
  }
}
function processChromeBookmarks(node, path = '', result = { bookmarks: [], folders: [] }) {
  if (!node) return result;
  if (node.children) {
    // This is a folder
    const currentPath = path ? `${path}/${node.title}` : node.title;
    if (node.title) { // Skip root folder
      const folderId = `chrome_folder_${node.id}`;
      const folderBookmarks = [];
      // Process children first to collect folder items
      node.children.forEach(child => {
        if (child && child.url) {
          // This is a bookmark in the folder
          const bookmark = {
            title: child.title || '',
            url: child.url,
            id: child.id,
            isExtensionBookmark: true,
            category: 'chrome',
            isExtensionFolder: true,
            folder: folderId,
            path: currentPath.split('/')
          };
          folderBookmarks.push(bookmark);
        } else if (child) {
          // Recurse into subfolders
          processChromeBookmarks(child, currentPath, result);
        }
      });
      // Add folder with its bookmarks if it has any
      if (folderBookmarks.length > 0) {
        result.folders.push({
          id: folderId,
          name: node.title,
          color: getColorForFolder(node.title),
          category: 'chrome',
          items: folderBookmarks,
          isExtensionFolder: true,
          path: currentPath
        });
      }
      // Also add bookmarks to the main bookmarks array
      result.bookmarks.push(...folderBookmarks);
    }
  } else if (node.url) {
    // This is a top-level bookmark
    result.bookmarks.push({
      title: node.title,
      url: node.url,
      id: node.id,
      isExtensionBookmark: true,
      category: 'chrome',
    });
  }
  return result;
}
function renderChromeBookmarks(bookmarks) {
  const bookmarksContainer = document.getElementById('bookmarks');
  bookmarksContainer.innerHTML = '';
  // Group bookmarks by folder
  const bookmarksByFolder = bookmarks.reduce((acc, bookmark) => {
    const folder = bookmark.folder || 'Uncategorized';
    if (!acc[folder]) {
      acc[folder] = [];
    }
    acc[folder].push(bookmark);
    return acc;
  }, {});
  // Render each folder and its bookmarks
  Object.entries(bookmarksByFolder).forEach(([folderName, folderBookmarks]) => {
    if (folderName !== 'Uncategorized') {
      const folderId = 'folder_' + Date.now() + Math.random().toString(36).substr(2, 9);
      const folderEl = document.createElement('div');
      folderEl.className = 'bookmark-folder';
      folderEl.dataset.folderId = folderId;
      // Create folder header
      const folderHeader = document.createElement('div');
      folderHeader.className = 'folder-header';
      folderHeader.innerHTML = `
        <div class="folder-icon">
          <i class="fas fa-folder"></i>
        </div>
        <div class="folder-title">${folderName}</div>
      `;
      folderHeader.addEventListener('click', () => toggleFolderContent(folderId));
      // Create folder content
      const folderContent = document.createElement('div');
      folderContent.className = 'folder-content';
      folderContent.dataset.folderId = folderId;
      // Add bookmarks to folder
      folderBookmarks.forEach(bookmark => {
        const bookmarkEl = createBookmarkElement(bookmark, () => { });
        folderContent.appendChild(bookmarkEl);
      });
      folderEl.appendChild(folderHeader);
      folderEl.appendChild(folderContent);
      bookmarksContainer.appendChild(folderEl);
    } else {
      // Render uncategorized bookmarks directly
      folderBookmarks.forEach(bookmark => {
        const bookmarkEl = createBookmarkElement(bookmark, () => { });
        bookmarksContainer.appendChild(bookmarkEl);
      });
    }
  });
}
async function showMostVisitedView() {
  // Hide bookmark categories
  const bookmarksTabs = document.querySelector('.bookmarks-tabs');
  if (bookmarksTabs) {
    bookmarksTabs.style.display = 'none';
  }
  const mostVisitedURLs = await chrome.topSites.get();
  chrome.topSites.get((sites) => {
    Promise.all(sites.map(async site => {
      const visitCount = await getVisitCount(site.url);
      const lastVisit = await getLastVisit(site.url);
      return {
        title: site.title || new URL(site.url).hostname,
        url: site.url,
        icon: site.title ? site.title[0].toUpperCase() : new URL(site.url).hostname[0].toUpperCase(),
        color: '#ffffff0f',
        category: 'most-visited',
        isMostVisited: true,
        lastVisitDate: new Date(lastVisit),
        recentVisits: new Date(lastVisit).toLocaleString(),
      };
    })).then(sitesWithVisits => {
      // Sort by last visit date (most recent first)
      sitesWithVisits.sort((a, b) => b.lastVisitDate - a.lastVisitDate);
      renderBookmarks(sitesWithVisits, []);
    });
  });
}
function showBookmarksView() {
  // Show bookmark categories
  const bookmarksTabs = document.querySelector('.bookmarks-tabs');
  if (bookmarksTabs) {
    bookmarksTabs.style.display = 'flex';
  }
  chrome.storage.sync.get(['bookmarks', 'folders'], function (data) {
    const settings = data.settings || DEFAULT_SETTINGS;
    const customBookmarks = data.bookmarks || [];
    const customFolders = data.folders || [];
    const showBookmarks = settings.showBookmarks;
    // Get Chrome bookmarks
    chrome.bookmarks.getTree((chromeBookmarkTree) => {
      const chromeBookmark = processBookmarkTree(chromeBookmarkTree[0]);
      // Mark bookmarks by source
      const markedChromeBookmarks = chromeBookmark.map(b => ({
        ...b,
        isExtensionBookmark: true,
        category: 'chrome' // Add this helper function
      })) ?? [];
      const markedExtensionBookmarks = customBookmarks.map(b => ({
        ...b,
        isExtensionBookmark: false
      })) ?? [];
      const chromeFolders = chromeBookmark.folders || [];
      const allBookmarks = [...markedChromeBookmarks, ...markedExtensionBookmarks];
      const allFolders = [...customFolders, ...chromeFolders].filter(Boolean);
      renderBookmarks(allBookmarks, allFolders, searchBookmarks.value);
    });
  });
}
// Initialize the application
document.addEventListener('DOMContentLoaded', function () {
  setupEventListeners();
  loadSettings();
  initializeClock();
  updateClock();
  setInterval(updateClock, 1000);
  chrome.storage.sync.get('settings', function (data) {
    const settings = data.settings || DEFAULT_SETTINGS;
    if (settings.showWeatherWidget) {
      getWeatherData();
      setInterval(getWeatherData, 30 * 60 * 1000);
    }
    if (settings.autoRotateBackgrounds) {
      startAutoRotate();
    }
  });
  loadNotes();
  initializeDevTools();
});
async function getVisitCount(url) {
  const oneWeekAgo = new Date().getTime() - WEEK_IN_MS;
  return new Promise((resolve) => {
    chrome.history.getVisits({ url: url }, (visits) => {
      const recentVisits = visits.filter(v => v.visitTime > oneWeekAgo).length;
      resolve(recentVisits);
    });
  });
}
// function for get time of last visited date
async function getLastVisit(url) {
  const oneWeekAgo = new Date().getTime() - WEEK_IN_MS;
  return new Promise((resolve) => {
    chrome.history.getVisits({ url: url }, (visits) => {
      if (visits && visits.length > 0) {
        // Sort visits by time and get the most recent
        const latestVisit = Math.max(...visits.map(v => v.visitTime));
        resolve(latestVisit);
      } else {
        resolve('Never');
      }
    });
  });
}
