# Base 2048 - Wallet Setup

## Environment Variables

Create a `.env` file in the root directory with:

```
VITE_WALLETCONNECT_PROJECT_ID=your_project_id_here
```

Get your Project ID from: https://cloud.walletconnect.com/

## Running the App

```bash
npm run dev
```

The app will be available at `http://localhost:5173/`

## Wallet Integration

- **Network**: Base (Chain ID: 8453)
- **Wallets**: Coinbase Wallet (primary), WalletConnect (fallback)
- **Features**: Connect/disconnect, display address, works on mobile & desktop