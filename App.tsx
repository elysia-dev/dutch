/* eslint-disable no-nested-ternary */
import React, { useEffect, useState } from 'react';

// import { AppLoading } from 'expo';
import * as Sentry from 'sentry-expo';
import * as Updates from 'expo-updates';

import Loading from './src/modules/main/Loading';
import AppMain from './AppMain';

Sentry.init({
  dsn:
    'https://e4dba4697fc743758bd94045d483872b@o449330.ingest.sentry.io/5478998',
  enableInExpoDevelopment: true,
  debug: true,
});

const App = () => {
  const [loading, setLoading] = useState<boolean>(true);

  const checkUpdateAndRefreshApp = async () => {
    try {
      const update = await Updates.checkForUpdateAsync();
      if (update.isAvailable) {
        await Updates.fetchUpdateAsync();
        await Updates.reloadAsync()
      }
    } catch (e) {
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    checkUpdateAndRefreshApp();
  }, [])

  if (loading) {
    return <Loading />
  } else {
    return <AppMain />
  }
};

export default App;
