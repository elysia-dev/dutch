import React from 'react';
import { useState } from "react";
import WalletContext, { WalletContextType, walletInitialState, staticWalletInitialState } from "../contexts/WalletContext";
import Wallet from '../core/Wallet';
import WalletStorage from '../core/WalletStorage';

const WalletProvider: React.FC = (props) => {
  const [state, setState] = useState<WalletContextType>(walletInitialState)

  const setLock = async () => {
    setState({
      ...state,
      ...staticWalletInitialState
    })
  }

  const unlock = async (password: string) => {
    const wallet = await WalletStorage.load(password);

    setState({
      ...state,
      isUnlocked: true,
      wallet,
      password,
    })
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

  return (
    <WalletContext.Provider
      value={{
        ...state,
        setLock,
        unlock,
        createNewWallet,
      }}
    >
      {props.children}
    </WalletContext.Provider>
  );
}

export default WalletProvider;