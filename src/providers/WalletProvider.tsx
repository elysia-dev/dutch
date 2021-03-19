import React from 'react';
import { useState } from "react";
import WalletContext, { staticWalletInitialState, WalletStateType } from "../contexts/WalletContext";
import Wallet from '../core/Wallet';
import WalletStorage from '../core/WalletStorage';

const WalletProvider: React.FC = (props) => {
  const [state, setState] = useState<WalletStateType>(staticWalletInitialState)

  const setLock = async () => {
    setState({
      ...staticWalletInitialState
    })
  }

  const unlock = async (password: string): Promise<void> => {
    try {
      const wallet = await WalletStorage.load(password);
      setState({
        ...state,
        isUnlocked: true,
        wallet,
        password,
      })
    } catch (e) {
      return Promise.reject(e);
    }
  }

  const createNewWallet = async (password: string) => {
    const newWallet = await Wallet.createNewWallet();
    WalletStorage.save(newWallet, password);

    setState({
      ...state,
      isUnlocked: true,
      password: password,
      wallet: newWallet,
    })
  }

  const restoreWallet = async (mnemonic: string, password: string) => {
    const wallet = await Wallet.restoreWallet(mnemonic);
    WalletStorage.save(wallet, password);

    setState({
      ...state,
      isUnlocked: true,
      password: password,
      wallet,
    })
  }

  const validatePassword = (password: string): boolean => {
    return password === state.password;
  }

  return (
    <WalletContext.Provider
      value={{
        ...state,
        setLock,
        unlock,
        createNewWallet,
        restoreWallet,
        validatePassword,
      }}
    >
      {props.children}
    </WalletContext.Provider>
  );
}

export default WalletProvider;