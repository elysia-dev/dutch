import React from 'react';
import AsyncStorage from "@react-native-community/async-storage";
import CryptoES from 'crypto-es';
import { useState } from "react";
import { ENCRYPTED_VAULT } from "../constants/storage";
import WalletContext, { WalletContextType, walletInitialState, staticWalletInitialState } from "../contexts/WalletContext";
import createNewWallet from '../utiles/createNewWallet';

const WalletProvider: React.FC = (props) => {
  const [state, setState] = useState<WalletContextType>(walletInitialState)

  const setLock = async () => {
    setState({
      ...state,
      ...staticWalletInitialState
    })
  }

  const unlock = async (password: string) => {
    const encryptedVault = await AsyncStorage.getItem(ENCRYPTED_VAULT);

    if (!encryptedVault) {
      throw new Error('No previous vault.')
    }

    const decrypted = await CryptoES.AES.decrypt(encryptedVault, password);
    const data = decrypted.toString(CryptoES.enc.Utf8);

    if (!data) {
      throw new Error('Invalid password')
    }

    const accounts = JSON.parse(data);

    if (accounts.length <= 0) {
      throw new Error('Invalid Vault')
    }

    setState({
      ...state,
      isUnlocked: true,
      accounts: accounts,
    })
  }

  const createNewVaultAndKeychain = async (password: string) => {
    const newWallet = await createNewWallet();

    const newKeychain = [{
      public: newWallet.public,
      private: newWallet.private,
      mnemonic: newWallet.mnemonic,
    }]

    const encryptedVault = await CryptoES.AES.encrypt(JSON.stringify(newKeychain), password);
    await AsyncStorage.setItem(ENCRYPTED_VAULT, encryptedVault.toString());

    setState({
      ...state,
      isUnlocked: true,
      password: password,
    })
  }

  return (
    <WalletContext.Provider
      value={{
        ...state,
        setLock,
        unlock,
        createNewVaultAndKeychain,
      }}
    >
      {props.children}
    </WalletContext.Provider>
  );
}

export default WalletProvider;