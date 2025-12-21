import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAccount, useDisconnect } from 'wagmi';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { storage } from '../utils/localStorage';
import soundManager from '../utils/soundManager';

const GameContext = createContext();

export const useGameContext = () => {
    const context = useContext(GameContext);
    if (!context) {
        throw new Error('useGameContext must be used within GameProvider');
    }
    return context;
};

export const GameProvider = ({ children }) => {
    // Wagmi hooks for wallet connection
    const { address, isConnected } = useAccount();
    const { disconnect } = useDisconnect();
    const { open } = useWeb3Modal();

    // Load settings from localStorage
    const [gridSize, setGridSizeState] = useState(storage.getGridSize());
    const [settings, setSettings] = useState({
        sound: storage.getSoundEnabled(),
        music: storage.getMusicEnabled(),
        haptics: storage.getHapticsEnabled(),
    });

    // Initialize sound manager
    useEffect(() => {
        soundManager.setEnabled(settings.sound);
    }, [settings.sound]);

    // Format wallet address for display
    const formatAddress = (addr) => {
        if (!addr) return '';
        return `${addr.slice(0, 4)}...${addr.slice(-4)}`;
    };

    const connectWallet = async () => {
        try {
            await open();
        } catch (error) {
            console.error('Failed to open wallet modal:', error);
            throw error;
        }
    };

    const disconnectWallet = () => {
        disconnect();
    };

    const updateSettings = (newSettings) => {
        setSettings(prev => {
            const updated = { ...prev, ...newSettings };
            
            // Persist to localStorage
            if ('sound' in newSettings) {
                storage.setSoundEnabled(newSettings.sound);
                soundManager.setEnabled(newSettings.sound);
            }
            if ('music' in newSettings) {
                storage.setMusicEnabled(newSettings.music);
            }
            if ('haptics' in newSettings) {
                storage.setHapticsEnabled(newSettings.haptics);
            }
            
            return updated;
        });
    };

    const setGridSize = (size) => {
        storage.setGridSize(size);
        setGridSizeState(size);
    };

    const value = {
        // Wallet state
        walletConnected: isConnected,
        walletAddress: address,
        walletAddressShort: formatAddress(address),

        // Wallet actions
        connectWallet,
        disconnectWallet,

        // Settings
        settings,
        updateSettings,

        // Grid size
        gridSize,
        setGridSize,
    };

    return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};
