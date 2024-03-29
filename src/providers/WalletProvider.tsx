import React, { useContext, useState } from 'react';

import EspressoV2 from '../api/EspressoV2';
import PreferenceContext from '../contexts/PreferenceContext';
import WalletContext, {
  staticWalletInitialState,
  WalletStateType,
} from '../contexts/WalletContext';
import Wallet from '../core/Wallet';
import WalletStorage from '../core/WalletStorage';
import registerForPushNotificationsAsync from '../utiles/registerForPushNotificationsAsync';

const WalletProvider: React.FC = (props) => {
  const [state, setState] = useState<WalletStateType>(staticWalletInitialState);
  const { setNotification } = useContext(PreferenceContext);

  const setLock = async () => {
    setState({
      ...staticWalletInitialState,
    });
  };

  const unlock = async (password: string): Promise<void> => {
    try {
      const wallet = await WalletStorage.load(password);
      setState({
        ...state,
        isUnlocked: true,
        wallet,
        password,
      });
    } catch (e) {
      return Promise.reject(e);
    }
  };

  const createNewWallet = async (password: string) => {
    const newWallet = await Wallet.createNewWallet();
    await WalletStorage.save(newWallet, password);

    registerForPushNotificationsAsync().then((token) => {
      if (token) {
        EspressoV2.subscribe(newWallet?.getFirstNode()?.address || '', token);
        setNotification(true);
      }
    });

    setState({
      ...state,
      isUnlocked: true,
      password,
      wallet: newWallet,
    });
  };

  const restoreWallet = async (mnemonic: string, password: string) => {
    const wallet = await Wallet.restoreWallet(mnemonic);
    await WalletStorage.save(wallet, password);
    await WalletStorage.completeBackup();

    registerForPushNotificationsAsync().then((token) => {
      if (token) {
        try {
          EspressoV2.subscribe(wallet?.getFirstNode()?.address || '', token);
        } catch {
          EspressoV2.subscribeExisted(
            wallet?.getFirstNode()?.address || '',
            token,
          );
        }
        setNotification(true);
      }
    });

    setState({
      ...state,
      isUnlocked: true,
      password,
      wallet,
    });
  };

  const clearWallet = async () => {
    await setNotification(false);
    await WalletStorage.clear();
  };

  const validatePassword = (password: string): boolean => {
    return password === state.password;
  };

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
      }}>
      {props.children}
    </WalletContext.Provider>
  );
};

export default WalletProvider;
