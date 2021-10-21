/* eslint-disable no-nested-ternary */
import React, { useContext, useState, useEffect, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AppState } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { More } from './src/modules/more/More';
import Products from './src/modules/products';
import { Account } from './src/modules/account/Account';
import { Dashboard } from './src/modules/dashboard/Dashboard';
import Main from './src/modules/main/Main';
import Wallet from './src/modules/wallet/WalletMain';
import SignInStatus from './src/enums/SignInStatus';
import BlockScreen from './src/modules/main/BlockScreen';
import Loading from './src/modules/main/Loading';
import { AccountPage, Page } from './src/enums/pageEnum';
import UserContext from './src/contexts/UserContext';
import WalletContext from './src/contexts/WalletContext';
import WalletLogin from './src/modules/account/WalletLogin';
import WalletRecover from './src/modules/account/WalletRecover';
import Asset from './src/modules/asset';
import Crypto from './src/modules/crypto';
import Staking from './src/modules/staking';
import TransactionContext from './src/contexts/TransactionContext';
import { EXTERNAL_WALLET_UUID } from './src/constants/storage';
import ExternalWalletTxData from './src/api/ExternalWalletTxData';
import TransferType from './src/enums/TransferType';
import addMigrationInternalInfo from './src/utiles/addMigrationInternalInfo';
import { WaitingTransaction } from './src/types/WaitingTransaction';
import CryptoType from './src/enums/CryptoType';

const RootStack = createStackNavigator();

const AppNavigator: React.FC = () => {
  const { signedIn, isWalletUser } = useContext(UserContext);
  const { isUnlocked } = useContext(WalletContext);
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);
  const { verifyTx, waitingTxs, findSucceedTx } =
    useContext(TransactionContext);

  useEffect(() => {
    AppState.addEventListener('change', (state) => {
      appState.current = state;
      setAppStateVisible(appState.current);
    });

    return () =>
      AppState.removeEventListener('change', (state) => {
        appState.current = state;
        setAppStateVisible(appState.current);
      });
  }, []);

  useEffect(() => {
    if (appStateVisible === 'active') {
      if (waitingTxs.length) {
        waitingTxs.map(async (tx) => {
          findSucceedTx(tx);
        });
      }
      if (isWalletUser) return;
      (async () => {
        const uuid = await AsyncStorage.getItem(EXTERNAL_WALLET_UUID);
        if (uuid) {
          const res = await ExternalWalletTxData.getTxData(uuid);
          const txInfo: WaitingTransaction = JSON.parse(String(res.data));
          if (txInfo) {
            let internalInfo;
            if (txInfo.transferType === TransferType.Migration) {
              internalInfo = addMigrationInternalInfo(
                txInfo.migrationUnstakingAmount,
                txInfo.migrationRewardAmount,
                txInfo.cryptoType,
                txInfo.cryptoType === CryptoType.EL
                  ? CryptoType.ELFI
                  : CryptoType.DAI,
              );
            }
            verifyTx(
              {
                ...txInfo,
              },
              internalInfo,
            );
          }
        }
      })();
    }
  }, [appStateVisible]);

  return (
    <NavigationContainer>
      <RootStack.Navigator headerMode="none">
        {signedIn === SignInStatus.PENDING ? (
          <RootStack.Screen
            name={Page.LoadingScreen}
            component={Loading}
            options={{ animationEnabled: false }}
          />
        ) : isWalletUser && !isUnlocked ? (
          <>
            <RootStack.Screen
              name={AccountPage.WalletLogin}
              component={WalletLogin}
            />
            <RootStack.Screen
              name={AccountPage.WalletRecover}
              component={WalletRecover}
            />
          </>
        ) : signedIn === SignInStatus.SIGNIN ? (
          <>
            <RootStack.Screen name={Page.Main} component={Main} />
            <RootStack.Screen name={Page.Dashboard} component={Dashboard} />
            <RootStack.Screen name={Page.More} component={More} />
            <RootStack.Screen name={Page.Product} component={Products} />
            <RootStack.Screen name={Page.Wallet} component={Wallet} />
            <RootStack.Screen name={Page.Asset} component={Asset} />
            <RootStack.Screen name={Page.Crypto} component={Crypto} />
            <RootStack.Screen name={Page.Staking} component={Staking} />
          </>
        ) : (
          <>
            <RootStack.Screen name={Page.Account} component={Account} />
          </>
        )}
        <RootStack.Screen
          name={Page.BlockScreen}
          component={BlockScreen}
          options={{ animationEnabled: false }}
        />
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
