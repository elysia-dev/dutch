import './i18n';
/* eslint-disable no-nested-ternary */
import React, { useEffect, useState } from 'react';

import * as Sentry from 'sentry-expo';
import * as Updates from 'expo-updates';

import { useFonts } from 'expo-font';

import Loading from './src/modules/main/Loading';
import AppMain from './AppMain';
import { SENTRY_DSN } from 'react-native-dotenv';

if (SENTRY_DSN) {
  Sentry.init({
    dsn: SENTRY_DSN,
    enableInExpoDevelopment: true,
    debug: true,
  });
}

const App = () => {
  /* eslint-disable @typescript-eslint/camelcase */
  const [fontsLoaded] = useFonts({
    SpoqaHanSansNeoThin: require('./src/shared/assets/fonts/SpoqaHanSansNeoThin.otf'),
    SpoqaHanSansNeoLight: require('./src/shared/assets/fonts/SpoqaHanSansNeoLight.otf'),
    SpoqaHanSansNeoRegular: require('./src/shared/assets/fonts/SpoqaHanSansNeoRegular.otf'),
    SpoqaHanSansNeoMedium: require('./src/shared/assets/fonts/SpoqaHanSansNeoMedium.otf'),
    SpoqaHanSansNeoBold: require('./src/shared/assets/fonts/SpoqaHanSansNeoBold.otf'),
  });

  const [loading, setLoading] = useState<boolean>(true);

  const checkUpdateAndRefreshApp = async () => {
    try {
      const update = await Updates.checkForUpdateAsync();
      if (update.isAvailable) {
        await Updates.fetchUpdateAsync();
        await Updates.reloadAsync();
      }
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkUpdateAndRefreshApp();
  }, []);

  if (loading || !fontsLoaded) {
    return <Loading />;
  } else {
    return <AppMain />;
  }
};

export default App;
