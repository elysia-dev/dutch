import React, { useContext, useEffect } from 'react';
import { useState } from "react";
import EspressoV2 from '../api/EspressoV2';
import FunctionContext from '../contexts/FunctionContext';
import PreferenceContext from '../contexts/PreferenceContext';
import WalletContext, { staticWalletInitialState, WalletStateType } from "../contexts/WalletContext";
import Wallet from '../core/Wallet';
import WalletStorage from '../core/WalletStorage';
import registerForPushNotificationsAsync from '../utiles/registerForPushNotificationsAsync';

const WalletProvider: React.FC = (props) => {
  const [state, setState] = useState<WalletStateType>(staticWalletInitialState);
  const { setNotification } = useContext(PreferenceContext);
  const { setNotifications } = useContext(FunctionContext);

  const setLock = async () => {
    setState({
      ...staticWalletInitialState
    })
  }

  const loadNotifications = async () => {
    EspressoV2.getNoficiations(state?.wallet?.getFirstAddress() || '').then((res) => {
      setNotifications(res.data);
    }).catch((_e) => {
    });
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

    registerForPushNotificationsAsync().then((token) => {
      if (token) {
        EspressoV2.subscribe(newWallet?.getFirstNode()?.address || '', token)
        setNotification(true);
      }
    })

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

    registerForPushNotificationsAsync().then((token) => {
      if (token) {
        try {
          EspressoV2.subscribe(wallet?.getFirstNode()?.address || '', token)
        } catch {
          EspressoV2.subscribeExisted(wallet?.getFirstNode()?.address || '', token)
        }
        setNotification(true);
      }
    })

    setState({
      ...state,
      isUnlocked: true,
      password: password,
      wallet,
    })
  }

  const clearWallet = async () => {
    await setNotification(false);
    await WalletStorage.clear();
  }

  const validatePassword = (password: string): boolean => {
    return password === state.password;
  }

  useEffect(() => {
    if (state.isUnlocked) {
      loadNotifications()
    }
  }, [state.isUnlocked])

  return (
    <WalletContext.Provider
      value={{
        ...state,
        setLock,
        unlock,
        createNewWallet,
        restoreWallet,
        validatePassword,
        clearWallet,
      }}
    >
      {props.children}
    </WalletContext.Provider>
  );
}

export default WalletProvider;