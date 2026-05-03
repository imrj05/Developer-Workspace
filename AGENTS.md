# Developer Workspace - Chrome Extension

## Project Type
Chrome Extension (Manifest V3) - replaces new tab page with a productivity dashboard.

## Key Entry Points
- `index.html` - Main new tab page (loads `script.js`, `styles.css`)
- `background.js` - Service worker for Chrome APIs
- `init.js` - Extension initialization
- `dist/` - Built output (ready to load in Chrome)

## Build & Load
- **Build**: Vite is used. The `.vite/deps/package.json` sets `"type": "module"`.
- **Load in Chrome**: Go to `chrome://extensions/`, enable Developer mode, click "Load unpacked", select `dist/`.
- **Source** is plain JavaScript/HTML/CSS (no TypeScript config, no tsconfig.json).

## Commands
No `package.json` at root. Scripts are inferred from `.vite/deps/` (Vite dependency cache) and node_modules.
- Dependencies: react, react-dom, vite, @vitejs/plugin-react, @babel/core
- No lint/typecheck/test scripts defined.

## Architecture
- **Large monolithic `script.js`** (2719 lines) - contains all UI logic
- **State**: Chrome Storage Sync API (`chrome.storage.sync`)
- **Permissions**: storage, bookmarks, geolocation, notifications, search, history, topSites
- **Host permissions**: api.github.com, api.openweathermap.org
- **Dark mode**: CSS variable toggle via `html.dark` class

## Testing
No automated test suite. Manual testing via Chrome extension loading.
