import React, { createContext, useContext } from 'react';
import { useAccount, useDisconnect } from 'wagmi';
import { useWeb3Modal } from '@web3modal/wagmi/react';

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
    const { open } = useWeb3Modal(); // Web3Modal hook to open wallet modal

    const [settings, setSettings] = React.useState({
        sound: true,
        music: true,
        haptics: false,
    });

    // Format wallet address for display
    const formatAddress = (addr) => {
        if (!addr) return '';
        return `${addr.slice(0, 4)}...${addr.slice(-4)}`;
    };

    const connectWallet = async () => {
        try {
            await open(); // This opens the Web3Modal
        } catch (error) {
            console.error('Failed to open wallet modal:', error);
            throw error;
        }
    };

    const disconnectWallet = () => {
        disconnect();
    };

    const updateSettings = (newSettings) => {
        setSettings(prev => ({ ...prev, ...newSettings }));
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
    };

    return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};
