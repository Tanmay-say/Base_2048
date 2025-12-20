import React, { createContext, useContext, useState } from 'react';

const GameContext = createContext();

export const useGameContext = () => {
    const context = useContext(GameContext);
    if (!context) {
        throw new Error('useGameContext must be used within GameProvider');
    }
    return context;
};

export const GameProvider = ({ children }) => {
    const [walletConnected, setWalletConnected] = useState(false);
    const [walletAddress, setWalletAddress] = useState('0x12...4F');
    const [settings, setSettings] = useState({
        sound: true,
        music: true,
        haptics: false,
    });

    const connectWallet = () => {
        // Mock wallet connection
        setWalletConnected(true);
        setWalletAddress('0x12...4F');
    };

    const updateSettings = (newSettings) => {
        setSettings(prev => ({ ...prev, ...newSettings }));
    };

    const value = {
        walletConnected,
        walletAddress,
        settings,
        connectWallet,
        updateSettings,
    };

    return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};
