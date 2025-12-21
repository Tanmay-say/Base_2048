// PWA Registration and Update Handler

export const registerServiceWorker = () => {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker
                .register('/sw.js')
                .then((registration) => {
                    console.log('[PWA] Service Worker registered:', registration.scope);

                    // Check for updates
                    registration.addEventListener('updatefound', () => {
                        const newWorker = registration.installing;
                        console.log('[PWA] New Service Worker installing...');

                        newWorker.addEventListener('statechange', () => {
                            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                // New version available
                                console.log('[PWA] New version available!');
                                showUpdateNotification();
                            }
                        });
                    });
                })
                .catch((error) => {
                    console.error('[PWA] Service Worker registration failed:', error);
                });
        });
    }
};

export const unregisterServiceWorker = () => {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready
            .then((registration) => {
                registration.unregister();
                console.log('[PWA] Service Worker unregistered');
            })
            .catch((error) => {
                console.error('[PWA] Service Worker unregister failed:', error);
            });
    }
};

const showUpdateNotification = () => {
    // You can show a custom UI notification here
    if (confirm('New version available! Reload to update?')) {
        window.location.reload();
    }
};

// Install prompt handling
let deferredPrompt = null;

export const initInstallPrompt = () => {
    window.addEventListener('beforeinstallprompt', (e) => {
        // Prevent the mini-infobar from appearing on mobile
        e.preventDefault();
        // Stash the event so it can be triggered later
        deferredPrompt = e;
        console.log('[PWA] Install prompt ready');

        // Show your custom install button
        showInstallButton();
    });

    window.addEventListener('appinstalled', () => {
        console.log('[PWA] App installed successfully');
        deferredPrompt = null;
    });
};

const showInstallButton = () => {
    // Dispatch custom event that components can listen to
    window.dispatchEvent(new CustomEvent('pwa-install-available'));
};

export const promptInstall = async () => {
    if (!deferredPrompt) {
        console.log('[PWA] Install prompt not available');
        return false;
    }

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`[PWA] User response: ${outcome}`);

    // Clear the deferredPrompt
    deferredPrompt = null;

    return outcome === 'accepted';
};

// Check if app is installed
export const isAppInstalled = () => {
    // Check if running as PWA
    if (window.matchMedia('(display-mode: standalone)').matches) {
        return true;
    }
    // Check for iOS
    if (window.navigator.standalone === true) {
        return true;
    }
    return false;
};

// Request persistent storage
export const requestPersistentStorage = async () => {
    if (navigator.storage && navigator.storage.persist) {
        const isPersisted = await navigator.storage.persist();
        console.log(`[PWA] Persistent storage: ${isPersisted ? 'granted' : 'denied'}`);
        return isPersisted;
    }
    return false;
};
