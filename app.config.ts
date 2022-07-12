import { ExpoConfig, ConfigContext } from '@expo/config';

let name = 'ElysiaStaging';
let slug = 'ElysiaAppStaging';
let packageName = 'land.elysia.staging';
let googleServicesFile = './google-services.stag.json';

if (process.env.APP_ENV === 'production') {
  name = 'Elysia';
  slug = 'ElysiaApp';
  packageName = 'land.elysia';
  googleServicesFile = './google-services.json';
}

export default ({ config }: ConfigContext): ExpoConfig => ({
  owner: 'devmodori',
  privacy: 'hidden',
  name,
  slug,
  version: '1.6.0',
  orientation: 'portrait',
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
    icon: 'https://elysia-public.s3.ap-northeast-2.amazonaws.com/pushicon.png',
    iosDisplayInForeground: false,
    androidMode: 'collapse',
    androidCollapsedTitle: '#{unread_notifications} new interactions',
  },
  ios: {
    icon: './assets/icon.png',
    supportsTablet: false,
    bundleIdentifier: packageName,
    config: {
      googleMapsApiKey: process.env.APP_GOOGLE_MAP_API_IOS,
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
    buildNumber: '1.6.0',
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/android-icon.png',
    },
    package: packageName,
    config: {
      googleMaps: {
        apiKey: process.env.APP_GOOGLE_MAP_API_ANDROID,
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
    versionCode: 15,
    useNextNotificationsApi: true,
    googleServicesFile,
  },
  entryPoint: 'node_modules/expo/AppEntry.js',
  scheme: 'elysia-app',
});
