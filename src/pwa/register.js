// PWA Installation Handler
// Note: Service Worker is now managed by vite-plugin-pwa

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
        window.deferredPrompt = e;

        console.log('[PWA] Install prompt ready and stored');

        // Dispatch custom event that components can listen to
        window.dispatchEvent(new CustomEvent('pwa-install-available'));
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

export const promptInstall = async () => {
    console.log('[PWA] promptInstall called');

    if (!deferredPrompt) {
        console.warn('[PWA] ❌ Install prompt not available');
        return false;
    }

    console.log('[PWA] Showing install prompt...');

    try {
        // Show the install prompt
        await deferredPrompt.prompt();

        // Wait for the user to respond to the prompt
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`[PWA] User response: ${outcome}`);

        // Clear the deferredPrompt
        deferredPrompt = null;
        window.deferredPrompt = null;

        return outcome === 'accepted';
    } catch (error) {
        console.error('[PWA] Error showing install prompt:', error);
        return false;
    }
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

// Initialize on load
if (typeof window !== 'undefined') {
    initInstallPrompt();
}

