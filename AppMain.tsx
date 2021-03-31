import React from 'react';
import WalletProvider from './src/providers/WalletProvider';
import AppNavigator from './AppNavigator';
import PreferenceProvider from './src/providers/PreferenceProvider';
import PriceProvider from './src/providers/PriceProvider';
import AssetProvider from './src/providers/AssetProvider';
import UserProvider from './src/providers/UserProvider';

const AppMain = () => {
  return (
    <PriceProvider>
      <PreferenceProvider>
        <UserProvider>
          <WalletProvider>
            <AssetProvider>
              <AppNavigator />
            </AssetProvider>
          </WalletProvider>
        </UserProvider>
      </PreferenceProvider>
    </PriceProvider>
  );
};

export default AppMain;
