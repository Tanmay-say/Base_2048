import React, { useState, useEffect } from 'react';
import { promptInstall, isAppInstalled } from './register';

export const InstallButton = () => {
    const [showButton, setShowButton] = useState(true);
    const [isInstalled, setIsInstalled] = useState(false);
    const [installAvailable, setInstallAvailable] = useState(false);

    useEffect(() => {
        console.log('[InstallButton] ✅ Component mounted and rendering');

        // Check if already installed
        const installed = isAppInstalled();
        console.log('[InstallButton] Is app installed?', installed);
        setIsInstalled(installed);

        // Listen for install availability
        const handleInstallAvailable = () => {
            console.log('[InstallButton] Install event received');
            setInstallAvailable(true);
            setShowButton(true);
        };

        window.addEventListener('pwa-install-available', handleInstallAvailable);

        // Check if event already fired
        if (window.deferredPrompt) {
            console.log('[InstallButton] Deferred prompt exists');
            setInstallAvailable(true);
        }

        return () => {
            window.removeEventListener('pwa-install-available', handleInstallAvailable);
        };
    }, []);

    const handleInstallClick = async () => {
        console.log('[InstallButton] Button clicked!');

        if (!installAvailable) {
            alert('Install prompt not ready yet.\n\nFor PWA to work:\n1. Use Chrome/Edge browser\n2. Access via HTTPS (or localhost)\n3. Wait a few seconds for browser\n\nCheck console for details.');
            return;
        }

        const accepted = await promptInstall();
        if (accepted) {
            setShowButton(false);
            setIsInstalled(true);
        }
    };

    // ALWAYS render for testing - only hide if actually installed
    if (isInstalled) {
        console.log('[InstallButton] Hidden - app already installed');
        return null;
    }

    console.log('[InstallButton] Rendering button now!');

    return (
        <button
            onClick={handleInstallClick}
            className="flex h-9 items-center justify-center gap-x-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 border border-blue-500/30 px-3 shadow-lg hover:from-blue-500 hover:to-purple-500 transition-all duration-200 active:scale-95"
            title={installAvailable ? "Install App" : "Install (waiting...)"}
        >
            <span className="material-symbols-outlined text-white text-[18px]">download</span>

        </button>
    );
};
