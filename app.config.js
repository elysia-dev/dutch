module.exports = () => {
  let bundleIdentifier = 'land.elysia';
  let scheme = 'elysia-app';

  if (process.env.APP_ENV === 'staging') {
    bundleIdentifier = 'land.elysia.staging';
    scheme = 'elysia-staging-app';
  }

  return {
    owner: 'devmodori',
    privacy: 'hidden',
    name: 'Elysia',
    slug: 'ElysiaApp',
    version: '1.4.1',
    orientation: 'portrait',
    icon: './assets/icon.png',
    updates: {
      fallbackToCacheTimeout: 0,
      enabled: true,
    },
    splash: {
      image: './assets/splash.png',
      backgroundColor: '#3679B5',
    },
    assetBundlePatterns: ['**/*'],
    notification: {
      icon:
        'https://elysia-public.s3.ap-northeast-2.amazonaws.com/pushicon.png',
      iosDisplayInForeground: false,
      androidMode: 'collapse',
      androidCollapsedTitle: '#{unread_notifications} new interactions',
    },
    ios: {
      supportsTablet: false,
      bundleIdentifier: bundleIdentifier,
      config: {
        googleMapsApiKey: process.IOS_GOOGLE_MAPS_API_KEY,
        usesNonExemptEncryption: false,
      },
      infoPlist: {
        NSCameraUsageDescription:
          'Elysia needs camera permisions to allow you to read qr code.',
        NSPhotoLibraryUsageDescription: 'Give permission to select photos.',
        NSPhotoLibraryAddUsageDescription: 'Give permission to save photos.',
        NSAppTransportSecurity: {
          NSAllowsArbitraryLoads: true,
        },
      },
      buildNumber: '1.4.1',
    },
    android: {
      package: bundleIdentifier,
      config: {
        googleMaps: {
          apiKey: process.env.ANDROID_GOOGLE_MAPS_API_KEY,
        },
      },
      permissions: [
        'CAMERA',
        'USE_FINGERPRINT',
        'USE_BIOMETRIC',
        'WRITE_SETTINGS',
        'VIBRATE',
        'READ_PHONE_STATE',
        'com.anddoes.launcher.permission.UPDATE_COUNT',
        'com.android.launcher.permission.INSTALL_SHORTCUT',
        'com.google.android.c2dm.permission.RECEIVE',
        'com.google.android.gms.permission.ACTIVITY_RECOGNITION',
        'com.google.android.providers.gsf.permission.READ_GSERVICES',
        'com.htc.launcher.permission.READ_SETTINGS',
        'com.htc.launcher.permission.UPDATE_SHORTCUT',
        'com.majeur.launcher.permission.UPDATE_BADGE',
        'com.sec.android.provider.badge.permission.READ',
        'com.sec.android.provider.badge.permission.WRITE',
        'com.sonyericsson.home.permission.BROADCAST_BADGE',
      ],
      versionCode: 13,
      useNextNotificationsApi: true,
      googleServicesFile: './google-services.json',
    },
    entryPoint: 'node_modules/expo/AppEntry.js',
    hooks: {
      postPublish: [
        {
          file: 'sentry-expo/upload-sourcemaps',
          config: {
            organization: 'modori',
            project: 'elysia-rn',
            authToken: process.env.SENTRY_AUTH_TOKEN || '',
          },
        },
      ],
    },
    scheme,
    extra: {
      apiUrl: process.env.API_URL || 'https://staging-api.elysia.land',
      dappUrl: process.env.DAPP_URL || 'staging-dapp.elysia.land',
      version: process.env.version || 'local',
      bscRpcEndpoint:
        process.env.BSC_RPC_ENDPOINT ||
        'https://data-seed-prebsc-1-s1.binance.org:8545/',
      ethNetwork: process.env.ETH_NETWORK || 'kovan',
      elAddress:
        process.env.EL_ADDRESS || '0xea26b65ed9571832a7f056ab7e6b7e755bb1d7be',
      infuraProjectId:
        process.env.INFURA_PROJECT_ID || '4f4e9528f1fb446abeb64e05ff08fdbe',
    },
  };
};
