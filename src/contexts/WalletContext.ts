import { createContext } from 'react';
import Wallet from '../core/Wallet';

export type WalletContextType = {
  isUnlocked: boolean;
  isCreated: boolean;
  password: string | undefined;
  wallet: Wallet | undefined;
  setLock: () => void;
  unlock: (password: string) => Promise<void>;
  createNewWallet: (password: string) => Promise<void>;
  restoreWallet: (password: string, seed: string) => Promise<void>;
  validatePassword: (password: string) => boolean;
  clearWallet: () => Promise<void>;
};

export type WalletStateType = {
  isUnlocked: boolean;
  isCreated: boolean;
  password: string | undefined;
  wallet: Wallet | undefined;
};

export const staticWalletInitialState = {
  isUnlocked: false,
  isCreated: false,
  password: undefined,
  wallet: undefined,
};

export const walletInitialState = {
  ...staticWalletInitialState,
  setLock: () => {},
  unlock: async (_password: string) => {},
  createNewWallet: async (_password: string) => {},
  restoreWallet: async (_password: string, _seed: string) => {},
  validatePassword: (_password: string) => {
    return false;
  },
  clearWallet: async () => {},
};

const WalletContext = createContext<WalletContextType>(walletInitialState);

export default WalletContext;
