import './i18n';
/* eslint-disable no-nested-ternary */
import React, { useEffect, useState } from 'react';

import * as Sentry from 'sentry-expo';
import * as Updates from 'expo-updates';

import { useFonts } from 'expo-font';

import { SENTRY_DSN } from 'react-native-dotenv';
import { LogBox } from 'react-native';
import Loading from './src/modules/main/Loading';
import AppMain from './AppMain';

if (SENTRY_DSN) {
  Sentry.init({
    dsn: SENTRY_DSN,
    enableInExpoDevelopment: true,
    debug: true,
  });
}

LogBox.ignoreLogs(["exported from 'deprecated-react-native-prop-types'."]);

const App = () => {
  /* eslint-disable @typescript-eslint/camelcase */
  const [fontsLoaded] = useFonts({
    SpoqaHanSansNeoThin: require('./src/shared/assets/fonts/SpoqaHanSansNeoThin.otf'),
    SpoqaHanSansNeoLight: require('./src/shared/assets/fonts/SpoqaHanSansNeoLight.otf'),
    SpoqaHanSansNeoRegular: require('./src/shared/assets/fonts/SpoqaHanSansNeoRegular.otf'),
    SpoqaHanSansNeoMedium: require('./src/shared/assets/fonts/SpoqaHanSansNeoMedium.otf'),
    SpoqaHanSansNeoBold: require('./src/shared/assets/fonts/SpoqaHanSansNeoBold.otf'),
    NanumSquareEB: require('./src/shared/assets/fonts/NanumSquareEB.otf'),
  });

  const [loading, setLoading] = useState<boolean>(true);

  const checkUpdateAndRefreshApp = async () => {
    try {
      try {
        const update = await Updates.checkForUpdateAsync();
        if (update.isAvailable) {
          await Updates.fetchUpdateAsync();
          await Updates.reloadAsync();
        }
      } catch (error) {
        console.error(error);
      }
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
