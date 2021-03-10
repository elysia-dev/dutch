import { createContext } from 'react';

export type Account = {
  public: string,
  private: string,
  mnemonic: string,
}

export type WalletContextType = {
  isUnlocked: boolean;
  password: string | null;
  accounts: Account[];
  setLock: () => void;
  unlock: (password: string) => Promise<void>;
  createNewVaultAndKeychain: (password: string) => Promise<void>;
  createNewVaultAndRestore: (password: string, seed: string) => Promise<void>;
};

export const staticWalletInitialState = {
  isUnlocked: false,
  password: null,
  accounts: [],
}

export const walletInitialState = {
  ...staticWalletInitialState,
  setLock: () => { },
  unlock: async (_password: string) => { },
  createNewVaultAndKeychain: async (_password: string) => { },
  createNewVaultAndRestore: async (_password: string, _seed: string) => { },
}

const WalletContext = createContext<WalletContextType>(walletInitialState);

export default WalletContext;