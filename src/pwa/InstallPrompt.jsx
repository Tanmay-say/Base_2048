import React, { useState, useEffect } from 'react';
import { promptInstall, isAppInstalled } from './register';

export const InstallPrompt = () => {
    const [showInstallPrompt, setShowInstallPrompt] = useState(false);
    const [isInstalled, setIsInstalled] = useState(false);

    useEffect(() => {
        // Check if already installed
        setIsInstalled(isAppInstalled());

        // Listen for install availability
        const handleInstallAvailable = () => {
            if (!isAppInstalled()) {
                setShowInstallPrompt(true);
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
            setShowInstallPrompt(false);
            setIsInstalled(true);
        }
    };

    if (isInstalled || !showInstallPrompt) {
        return null;
    }

    return (
        <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-2xl p-4 z-50 animate-slide-up">
            <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-12 h-12 bg-white rounded-lg flex items-center justify-center">
                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                </div>
                <div className="flex-1">
                    <h3 className="text-white font-bold text-lg mb-1">Install Base 2048</h3>
                    <p className="text-white/90 text-sm mb-3">
                        Install the app for quick access, offline play, and better performance!
                    </p>
                    <div className="flex gap-2">
                        <button
                            onClick={handleInstallClick}
                            className="px-4 py-2 bg-white text-blue-600 font-bold rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            Install
                        </button>
                        <button
                            onClick={() => setShowInstallPrompt(false)}
                            className="px-4 py-2 bg-white/20 text-white font-medium rounded-lg hover:bg-white/30 transition-colors"
                        >
                            Later
                        </button>
                    </div>
                </div>
                <button
                    onClick={() => setShowInstallPrompt(false)}
                    className="flex-shrink-0 text-white/80 hover:text-white"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </div>
    );
};
