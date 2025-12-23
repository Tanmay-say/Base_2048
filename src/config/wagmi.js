import { defaultWagmiConfig } from '@web3modal/wagmi';
import { base } from 'wagmi/chains';

// Get WalletConnect Project ID from environment variable
const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID;

if (!projectId) {
    throw new Error('VITE_WALLETCONNECT_PROJECT_ID is not set');
}

// App URL for WalletConnect metadata
// In dev, this should match your local URL (e.g. http://localhost:5173).
// In production, set VITE_APP_URL to your deployed HTTPS URL.
const appUrl = import.meta.env.VITE_APP_URL || 'http://localhost:5173';

// Metadata for your app
const metadata = {
    name: 'Base 2048',
    description: 'Play 2048 on Base network',
    url: appUrl,
    icons: ['https://avatars.githubusercontent.com/u/37784886']
};

// Create wagmi config with Web3Modal
export const config = defaultWagmiConfig({
    chains: [base],
    projectId,
    metadata,
    enableCoinbase: true, // Enable Coinbase Wallet
    enableInjected: true, // Enable browser extension wallets
    enableWalletConnect: true, // Enable WalletConnect
});
