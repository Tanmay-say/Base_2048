// PWA Registration and Update Handler

export const registerServiceWorker = () => {
    console.log('[PWA] Checking for service worker support...');

    if ('serviceWorker' in navigator) {
        console.log('[PWA] Service worker supported!');

        window.addEventListener('load', () => {
            console.log('[PWA] Window loaded, registering service worker...');

            navigator.serviceWorker
                .register('/sw.js')
                .then((registration) => {
                    console.log('[PWA] ✅ Service Worker registered successfully!');
                    console.log('[PWA] Registration scope:', registration.scope);

                    // Check for updates
                    registration.addEventListener('updatefound', () => {
                        const newWorker = registration.installing;
                        console.log('[PWA] New Service Worker installing...');

                        newWorker.addEventListener('statechange', () => {
                            console.log('[PWA] Service Worker state:', newWorker.state);
                            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                // New version available
                                console.log('[PWA] New version available!');
                                showUpdateNotification();
                            }
                        });
                    });
                })
                .catch((error) => {
                    console.error('[PWA] ❌ Service Worker registration failed:', error);
                });
        });
    } else {
        console.warn('[PWA] Service worker not supported in this browser');
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
    console.log('[PWA] Initializing install prompt listener...');

    window.addEventListener('beforeinstallprompt', (e) => {
        console.log('[PWA] 🎉 beforeinstallprompt event fired!');

        // Prevent the mini-infobar from appearing on mobile
        e.preventDefault();

        // Stash the event so it can be triggered later
        deferredPrompt = e;
        window.deferredPrompt = e; // Make it accessible globally

        console.log('[PWA] Install prompt ready and stored');

        // Show your custom install button
        showInstallButton();
    });

    window.addEventListener('appinstalled', () => {
        console.log('[PWA] ✅ App installed successfully');
        deferredPrompt = null;
        window.deferredPrompt = null;
    });

    // Check if already installed
    if (isAppInstalled()) {
        console.log('[PWA] App is already installed');
    } else {
        console.log('[PWA] App not installed yet - waiting for beforeinstallprompt...');
    }
};

const showInstallButton = () => {
    console.log('[PWA] Dispatching pwa-install-available event');
    // Dispatch custom event that components can listen to
    window.dispatchEvent(new CustomEvent('pwa-install-available'));
};

export const promptInstall = async () => {
    console.log('[PWA] promptInstall called');

    if (!deferredPrompt) {
        console.warn('[PWA] ❌ Install prompt not available');
        console.log('[PWA] This could mean:');
        console.log('[PWA]   - App is already installed');
        console.log('[PWA]   - beforeinstallprompt event hasn\'t fired yet');
        console.log('[PWA]   - Browser doesn\'t support PWA installation');
        return false;
    }

    console.log('[PWA] Showing install prompt...');

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`[PWA] User response: ${outcome}`);

    // Clear the deferredPrompt
    deferredPrompt = null;
    window.deferredPrompt = null;

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
