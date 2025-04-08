class BookmarkImporter {
    constructor() {
        this.progressElement = document.querySelector('.import-progress');
        this.progressFill = document.querySelector('.progress-fill');
        this.statusText = document.querySelector('.import-status');
        this.progressText = document.querySelector('.progress-text');
        this.duplicateCount = 0;
        this.importedCount = 0;
        this.connectionAttempts = 0;
        this.maxAttempts = 3;  // Reduced from 5 to 3
        this.retryInterval = 1000;  // Reduced from 2000 to 1000
        this.initDelay = 500;  // Reduced from 1000 to 500
        this.port = null;
        this.isConnecting = false;
        this.connectionQueue = Promise.resolve();
        this.initializeWhenReady();
    }

    async initializeWhenReady() {
        await new Promise(resolve => setTimeout(resolve, this.initDelay));

        if (!chrome?.runtime?.id) {
            console.log('Extension context not ready, retrying...');
            this.connectionAttempts++;
            if (this.connectionAttempts < this.maxAttempts) {
                setTimeout(() => this.initializeWhenReady(), this.retryInterval);
            } else {
                console.error('Failed to initialize after maximum attempts');
            }
            return;
        }

        try {
            await this.setupConnection();
            this.init();
        } catch (error) {
            console.error('Initialization failed:', error);
            this.connectionAttempts++;
            if (this.connectionAttempts < this.maxAttempts) {
                console.log(`Retrying connection (attempt ${this.connectionAttempts + 1}/${this.maxAttempts})...`);
                setTimeout(() => this.initializeWhenReady(), this.retryInterval);
            } else {
                console.error('Max connection attempts reached');
                this.handleError(new Error('Could not establish connection after multiple attempts'));
            }
        }
    }

    setupConnection() {
        if (this.isConnecting) {
            return this.connectionQueue;
        }

        this.isConnecting = true;
        this.connectionQueue = new Promise((resolve, reject) => {
            try {
                if (this.port) {
                    this.port.disconnect();
                    this.port = null;
                }

                console.log('Attempting to connect...');
                this.port = chrome.runtime.connect({ name: 'bookmark-importer' });

                const messageHandler = (response) => {
                    console.log('Received response:', response);
                    if (response.type === 'pong') {
                        this.port.onMessage.removeListener(messageHandler);
                        resolve(this.port);
                    }
                };

                this.port.onMessage.addListener(messageHandler);

                this.port.onMessage.addListener((message) => {
                    console.log('Received message in content script:', message);
                    if (message.type === 'bookmarks') {
                        this.handleBookmarks(message.data);
                    }
                    if (message.type === 'error') {
                        this.handleError(new Error(message.error));
                    }
                });

                this.port.onDisconnect.addListener(() => {
                    const error = chrome.runtime.lastError;
                    console.log('Port disconnected:', error?.message);
                    if (error) {
                        reject(new Error(error.message));
                    }
                });

                console.log('Sending ping...');
                this.port.postMessage({ type: 'ping' });

                setTimeout(() => {
                    if (this.isConnecting) {
                        reject(new Error('Connection timeout'));
                    }
                }, 3000);

            } catch (error) {
                console.error('Connection error:', error);
                reject(error);
            } finally {
                this.isConnecting = false;
            }
        });

        return this.connectionQueue;
    }

    async init() {
        document.querySelector('.import-btn').addEventListener('click', () => this.importChromeBookmarks());
    }

    async importChromeBookmarks() {
        try {
            if (!this.port || this.connectionAttempts >= this.maxAttempts) {
                await this.setupConnection();
            }
            this.showProgress();
            this.updateStatus('Reading Chrome bookmarks...');
            console.log('Requesting bookmarks...');
            this.port.postMessage({
                action: "getBookmarks",
                type: "request"
            });
        } catch (error) {
            console.error('Import failed:', error);
            this.handleError(error);
        }
    }

    async handleBookmarks(bookmarks) {
        try {
            if (!bookmarks || !bookmarks[0]) {
                throw new Error('No bookmarks data received');
            }

            // Get existing data first
            const { bookmarks: existingBookmarks = [], folders: existingFolders = [] } =
                await chrome.storage.sync.get(['bookmarks', 'folders']);

            const processedBookmarks = this.processBookmarkTree(bookmarks[0]);
            let importedCount = 0;
            const total = processedBookmarks.length;

            // Show progress UI
            this.showProgress();
            this.updateStatus('Importing bookmarks...');

            // Process and save bookmarks
            for (const bookmark of processedBookmarks) {
                try {
                    // Check for duplicates in both bookmarks and folder items
                    const isDuplicateInBookmarks = existingBookmarks.some(existing =>
                        existing.url === bookmark.url
                    );

                    const isDuplicateInFolders = existingFolders.some(folder =>
                        folder.items && folder.items.some(item => item.url === bookmark.url)
                    );

                    if (!isDuplicateInBookmarks && !isDuplicateInFolders) {
                        // Add bookmark logic here
                        if (bookmark.folder) {
                            // Handle folders
                            let currentFolder = existingFolders.find(f => f.name === bookmark.folder);

                            if (!currentFolder) {
                                currentFolder = {
                                    id: 'folder_' + Date.now() + Math.random().toString(36).substr(2, 9),
                                    name: bookmark.folder,
                                    color: '#4285f4',
                                    category: 'imported',
                                    items: []
                                };
                                existingFolders.push(currentFolder);
                            }

                            // Double-check for duplicates within the specific folder
                            const isDuplicateInCurrentFolder = currentFolder.items.some(item =>
                                item.url === bookmark.url
                            );

                            if (!isDuplicateInCurrentFolder) {
                                currentFolder.items.push({
                                    title: this.shortenTitle(bookmark.title),
                                    url: bookmark.url,
                                    icon: bookmark.icon || bookmark.title.charAt(0).toUpperCase(),
                                    color: '#4285f4'
                                });
                                importedCount++;
                            } else {
                                this.duplicateCount++;
                            }
                        } else {
                            existingBookmarks.push({
                                id: Date.now() + Math.random().toString(36).substr(2, 9),
                                title: this.shortenTitle(bookmark.title),
                                url: bookmark.url,
                                category: 'imported',
                                icon: bookmark.icon || bookmark.title.charAt(0).toUpperCase(),
                                color: '#4285f4'
                            });
                            importedCount++;
                        }
                    } else {
                        this.duplicateCount++;
                    }

                    this.updateProgress(importedCount, total);
                } catch (error) {
                    console.error('Error importing bookmark:', error);
                    this.duplicateCount++;
                }
            }

            // Save updated data
            await chrome.storage.sync.set({
                bookmarks: existingBookmarks,
                folders: existingFolders
            });

            // Hide progress UI and show toast
            const importProgress = document.querySelector('.import-progress');
            if (importProgress) {
                importProgress.classList.remove('active');
                setTimeout(() => {
                    importProgress.style.display = 'none';
                }, 300);
            }

            // Show toast message
            const toast = document.createElement('div');
            toast.className = 'toast-message';
            toast.innerHTML = `
                <i class="fas fa-check-circle"></i>
                Import complete: ${importedCount} bookmarks imported, ${this.duplicateCount} duplicates skipped
            `;
            document.body.appendChild(toast);

            // Remove toast after 3 seconds
            setTimeout(() => {
                toast.style.opacity = '0';
                setTimeout(() => toast.remove(), 300);
            }, 3000);

            // Refresh the display
            chrome.storage.sync.get(['bookmarks', 'folders'], function(data) {
                if (typeof renderBookmarks === 'function') {
                    renderBookmarks(data.bookmarks || [], data.folders || [], '');
                }
            });

        } catch (error) {
            console.error('Error handling bookmarks:', error);
            this.handleError(error);

            // Hide progress UI on error
            const importProgress = document.querySelector('.import-progress');
            if (importProgress) {
                importProgress.classList.remove('active');
                setTimeout(() => {
                    importProgress.style.display = 'none';
                }, 300);
            }
        }
    }

    async refreshBookmarks() {
        try {
            const bookmarks = await chrome.bookmarks.getTree();
            const bookmarksContainer = document.querySelector('.bookmarks-grid');
            if (!bookmarksContainer) return;

            // Clear existing bookmarks
            bookmarksContainer.innerHTML = '';

            // Process and display bookmarks
            const processedBookmarks = this.processBookmarkTree(bookmarks[0]);
            processedBookmarks.forEach(bookmark => {
                const bookmarkElement = this.createBookmarkElement(bookmark);
                bookmarksContainer.appendChild(bookmarkElement);
            });
        } catch (error) {
            console.error('Error refreshing bookmarks:', error);
        }
    }

    createBookmarkElement(bookmark) {
        const div = document.createElement('div');
        div.className = 'bookmark-item';

        const icon = document.createElement('div');
        icon.className = 'bookmark-icon';
        icon.textContent = bookmark.title.charAt(0).toUpperCase();

        const title = document.createElement('div');
        title.className = 'bookmark-title';
        title.textContent = bookmark.title;

        const link = document.createElement('a');
        link.href = bookmark.url;
        link.target = '_blank';
        link.appendChild(icon);
        link.appendChild(title);

        div.appendChild(link);
        return div;
    }

    shortenTitle(title) {
        // Remove common prefixes and suffixes
        title = title.replace(/^(www\.|https?:\/\/|)/, '')
                     .replace(/\.(com|org|net|io|gov|edu).*$/, '')
                     .replace(/\s*[-|]\s*.+$/, '');

        // Capitalize first letter of each word
        title = title.split(' ')
                     .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                     .join(' ');

        // Limit to 30 characters, don't break words
        if (title.length > 30) {
            title = title.substr(0, 27) + '...';
        }

        return title;
    }

    processBookmarkTree(node, folder = '') {
        let bookmarks = [];

        if (node.children) {
            // It's a folder
            for (const child of node.children) {
                if (child.children) {
                    // It's a subfolder
                    const newFolder = child.title;
                    bookmarks = bookmarks.concat(this.processBookmarkTree(child, newFolder));
                } else if (child.url) {
                    // It's a bookmark in the folder
                    bookmarks.push({
                        title: child.title,
                        url: child.url,
                        folder: folder
                    });
                }
            }
        } else if (node.url) {
            // It's a bookmark
            bookmarks.push({
                title: node.title,
                url: node.url,
                folder: folder
            });
        }

        return bookmarks;
    }

    async checkDuplicate(bookmark) {
        const bookmarks = await this.getExistingBookmarks();
        return bookmarks.some(existing => existing.url === bookmark.url);
    }

    async getExistingBookmarks() {
        const data = await chrome.storage.sync.get(['bookmarks']);
        return data.bookmarks || [];
    }

    async getExistingFolders() {
        const data = await chrome.storage.sync.get(['folders']);
        return data.folders || [];
    }

    async saveBookmark(bookmark) {
        const bookmarkData = {
            title: bookmark.title,
            url: bookmark.url,
            folder: bookmark.folder,
            category: bookmark.category,
            icon: await this.getFavicon(bookmark.url)
        };

        const existingBookmarks = await this.getExistingBookmarks();
        existingBookmarks.push(bookmarkData);
        await chrome.storage.sync.set({ bookmarks: existingBookmarks });
    }

    guessCategory(url, title) {
        const lowerUrl = url.toLowerCase();
        const lowerTitle = title.toLowerCase();

        if (lowerUrl.includes('github') || lowerUrl.includes('stackoverflow') ||
            lowerUrl.includes('dev.to') || lowerUrl.includes('medium.com')) {
            return 'dev';
        }
        if (lowerUrl.includes('mail') || lowerUrl.includes('calendar') ||
            lowerUrl.includes('docs') || lowerUrl.includes('drive')) {
            return 'prod';
        }
        if (lowerUrl.includes('twitter') || lowerUrl.includes('facebook') ||
            lowerUrl.includes('linkedin') || lowerUrl.includes('instagram')) {
            return 'social';
        }
        if (lowerUrl.includes('chat.openai') || lowerUrl.includes('bard') ||
            lowerUrl.includes('claude') || lowerTitle.includes('ai')) {
            return 'ai';
        }
        return 'other';
    }

    async getFavicon(url) {
        try {
            const domain = new URL(url).hostname;
            return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
        } catch {
            return '';
        }
    }

    showProgress() {
        this.progressElement.classList.add('active');
    }

    updateProgress(importedCount, total) {
        const percentage = (importedCount / total) * 100;
        this.progressFill.style.width = `${percentage}%`;
    }

    updateStatus(message) {
        this.statusText.textContent = message;
    }

    completeImport(count) {
        this.updateStatus(`Successfully imported ${count} bookmarks (${this.duplicateCount} duplicates found)`);
        setTimeout(() => {
            this.progressElement.classList.remove('active');
            window.location.reload(); // Refresh to show new bookmarks
        }, 2000);
    }

    handleError(error) {
        this.updateStatus(`Import failed: ${error.message}`);
        setTimeout(() => {
            this.progressElement.classList.remove('active');
        }, 3000);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.bookmarkImporter = new BookmarkImporter();
});
