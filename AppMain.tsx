import React from 'react';
import WalletProvider from './src/providers/WalletProvider';
import AppNavigator from './AppNavigator';
import PreferenceProvider from './src/providers/PreferenceProvider';
import PriceProvider from './src/providers/PriceProvider';
import AssetProvider from './src/providers/AssetProvider';
import UserProvider from './src/providers/UserProvider';
import TransactionProvider from './src/providers/TransactionProvider';
import StakingProvider from './src/providers/StakingProvider';

const AppMain = () => {
  return (
    <PriceProvider>
      <PreferenceProvider>
        <UserProvider>
          <WalletProvider>
            <AssetProvider>
              <TransactionProvider>
                <StakingProvider>
                  <AppNavigator />
                </StakingProvider>
              </TransactionProvider>
            </AssetProvider>
          </WalletProvider>
        </UserProvider>
      </PreferenceProvider>
    </PriceProvider>
  );
};

export default AppMain;
