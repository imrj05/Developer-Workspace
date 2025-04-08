let ports = new Set();

chrome.runtime.onInstalled.addListener(() => {
    console.log('Extension installed');
});

chrome.runtime.onConnect.addListener((port) => {
    if (port.name === 'bookmark-importer') {
        console.log('Connection established with bookmark importer');
        ports.add(port);

        port.onMessage.addListener(async (message) => {
            console.log('Received message:', message);

            if (message.type === 'ping') {
                port.postMessage({ type: 'pong' });
            }

            if (message.action === 'getBookmarks') {
                try {
                    const bookmarks = await chrome.bookmarks.getTree();
                    console.log('Sending bookmarks:', bookmarks);
                    port.postMessage({
                        type: 'bookmarks',
                        data: bookmarks
                    });
                } catch (error) {
                    console.error('Error getting bookmarks:', error);
                    port.postMessage({
                        type: 'error',
                        error: error.message
                    });
                }
            }
        });

        port.onDisconnect.addListener(() => {
            console.log('Port disconnected');
            ports.delete(port);
        });
    }
});
