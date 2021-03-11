import { createContext } from 'react';
import Wallet from '../core/Wallet';

export type WalletContextType = {
  isUnlocked: boolean;
  password: string | undefined;
  wallet: Wallet | undefined;
  setLock: () => void;
  unlock: (password: string) => Promise<void>;
  createNewWallet: (password: string) => Promise<void>;
  restoreWallet: (password: string, seed: string) => Promise<void>;
};

export const staticWalletInitialState = {
  isUnlocked: false,
  password: undefined,
  wallet: undefined,
}

export const walletInitialState = {
  ...staticWalletInitialState,
  setLock: () => { },
  unlock: async (_password: string) => { },
  createNewWallet: async (_password: string) => { },
  restoreWallet: async (_password: string, _seed: string) => { },
}

const WalletContext = createContext<WalletContextType>(walletInitialState);

export default WalletContext;