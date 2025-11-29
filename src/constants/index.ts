// Application Constants

// Backend Configuration
export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:8000';
export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

// Workflow Canvas
export const NODE_SPACING_Y = 180;
export const NODE_CENTER_X = 250;
export const NODE_DEFAULT_POSITION = { x: 100, y: 100 };

// Wallet Providers
export const WALLET_PROVIDERS = [
  { value: 'nami', label: 'Nami' },
  { value: 'eternl', label: 'Eternl' },
  { value: 'lace', label: 'Lace' },
  { value: 'gerowallet', label: 'GeroWallet' },
] as const;

// DEX Protocols
export const DEX_PROTOCOLS = [
  { value: 'minswap', label: 'Minswap' },
  { value: 'sundaeswap', label: 'SundaeSwap' },
  { value: 'genius', label: 'Genius Yield' },
  { value: 'wingriders', label: 'WingRiders' },
] as const;

// Smart Contract Functions
export const CONTRACT_FUNCTIONS = [
  { value: 'vesting', label: 'Release Vesting' },
  { value: 'marketplace', label: 'Buy Listing' },
  { value: 'dao', label: 'Cast Vote' },
  { value: 'custom', label: 'Custom Call' },
] as const;

// UI Constants
export const TOAST_DURATION = 5000;
export const ANIMATION_DURATION = 300;
export const DEBOUNCE_DELAY = 500;

// API Settings
export const DEFAULT_CARDANO_RPC_URL = 'https://cardano-mainnet.blockfrost.io/api/v0';
export const DEFAULT_SLIPPAGE = '1.0';
export const DEFAULT_APY = '3.2';

// Feature Flags
export const ENABLE_ANALYTICS = import.meta.env.VITE_ENABLE_ANALYTICS === 'true';
export const ENABLE_DEBUG = import.meta.env.VITE_ENABLE_DEBUG === 'true';
