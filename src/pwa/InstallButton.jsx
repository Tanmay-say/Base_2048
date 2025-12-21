import React, { useState, useEffect } from 'react';
import { promptInstall, isAppInstalled } from './register';

export const InstallButton = () => {
    const [showButton, setShowButton] = useState(false);
    const [isInstalled, setIsInstalled] = useState(false);

    useEffect(() => {
        // Check if already installed
        setIsInstalled(isAppInstalled());

        // Listen for install availability
        const handleInstallAvailable = () => {
            if (!isAppInstalled()) {
                setShowButton(true);
            }
        };

        window.addEventListener('pwa-install-available', handleInstallAvailable);

        return () => {
            window.removeEventListener('pwa-install-available', handleInstallAvailable);
        };
    }, []);

    const handleInstallClick = async () => {
        const accepted = await promptInstall();
        if (accepted) {
            setShowButton(false);
            setIsInstalled(true);
        }
    };

    // Don't show if already installed
    if (isInstalled || !showButton) {
        return null;
    }

    return (
        <button
            onClick={handleInstallClick}
            className="flex h-9 items-center justify-center gap-x-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 border border-blue-500/30 px-3 shadow-lg hover:from-blue-500 hover:to-purple-500 transition-all duration-200 active:scale-95"
            title="Install App"
        >
            <span className="material-symbols-outlined text-white text-[18px]">download</span>
            <p className="text-white text-xs font-bold tracking-wide">Install</p>
        </button>
    );
};
