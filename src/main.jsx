import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createWeb3Modal } from '@web3modal/wagmi/react';
import { sdk } from '@farcaster/miniapp-sdk';
import { config } from './config/wagmi';
import './index.css';
import App from './App.jsx';
import { registerSW } from 'virtual:pwa-register';

// Register PWA Service Worker
if ('serviceWorker' in navigator) {
  registerSW({
    immediate: true,
    onNeedRefresh() {
      console.log('[PWA] New version available');
    },
    onOfflineReady() {
      console.log('[PWA] App ready to work offline');
    },
    onRegistered(registration) {
      console.log('[PWA] Service Worker registered', registration);
    },
    onRegisterError(error) {
      console.error('[PWA] Service Worker registration failed', error);
    }
  });
}

// Create a client for React Query
const queryClient = new QueryClient();

// Get project ID from environment
const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID;

// Create Web3Modal
if (projectId) {
  createWeb3Modal({
    wagmiConfig: config,
    projectId,
    enableAnalytics: false,
    enableOnramp: false
  });
}

const RootWithMiniAppReady = () => {
  useEffect(() => {
    // Signal to Base / Farcaster clients that the mini app is ready to display.
    // This is safe to call in a normal browser as well.
    try {
      sdk.actions.ready();
    } catch (err) {
      console.warn('[MiniApp] sdk.actions.ready() failed or is unavailable:', err);
    }
  }, []);

  return (
    <StrictMode>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </WagmiProvider>
    </StrictMode>
  );
};

createRoot(document.getElementById('root')).render(<RootWithMiniAppReady />);

