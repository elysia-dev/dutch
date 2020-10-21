import Constants from 'expo-constants';
const { manifest } = Constants;

type Environment = {
  envName: 'DEVELOPMENT' | 'STAGING' | 'PRODUCTION';
  apiUrl: string;
  pusherAppKey: string;
  dappUrl: string;
}

function getEnvironment(): Environment {
  const releaseChannel = Constants.manifest.releaseChannel;

  if (releaseChannel && releaseChannel.indexOf('prod') !== -1) { // matches prod-v1, prod-v2, prod-v3
    return {
      envName: "PRODUCTION",
      apiUrl: "https://api.elysia.land",
      pusherAppKey: '36d90ee1d112e5e237b5',
      dappUrl: "dapp.elysia.land",
    };
  }

  if (releaseChannel && releaseChannel.indexOf('staging') !== -1) { // matches staging-v1, staging-v2
    return {
      envName: "STAGING",
      apiUrl: "https://staging-api.elysia.land",
      pusherAppKey: '520f79c3f3a81f484834',
      dappUrl: "staging-dapp.elysia.land",
    };
  }

  return {
    envName: "DEVELOPMENT",
    apiUrl: `http://${(manifest.debuggerHost || 'localhost').split(':').shift()}:3000`,
    pusherAppKey: 'f8163691d5d47ddcfed7',
    dappUrl: "localhost:5000",
  };
}

export default getEnvironment;
