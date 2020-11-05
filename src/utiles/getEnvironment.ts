import Constants from 'expo-constants';
const { manifest } = Constants;

type Environment = {
  envName: 'DEVELOPMENT' | 'STAGING' | 'PRODUCTION';
  apiUrl: string;
  dappUrl: string;
  version: string;
}

function getEnvironment(): Environment {
  const releaseChannel = manifest && manifest.releaseChannel;

  if (releaseChannel && releaseChannel.indexOf('prod') !== -1) { // matches prod-v1, prod-v2, prod-v3
    return {
      envName: "PRODUCTION",
      apiUrl: "https://api.elysia.land",
      dappUrl: "dapp.elysia.land",
      version: "1.1.0",
    };
  }

  if (releaseChannel && releaseChannel.indexOf('staging') !== -1) { // matches staging-v1, staging-v2
    return {
      envName: "STAGING",
      apiUrl: "https://staging-api.elysia.land",
      dappUrl: "staging-dapp.elysia.land",
      version: "1.1.0",
    };
  }

  return {
    envName: "DEVELOPMENT",
    apiUrl: `http://${(manifest.debuggerHost || 'localhost').split(':').shift()}:3000`,
    // dappUrl: "localhost:5000",
    dappUrl: "staging-dapp.elysia.land",
    version: "1.1.0",
  };
}

export default getEnvironment;
