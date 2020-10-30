import Constants from 'expo-constants';
const { manifest } = Constants;

type Environment = {
  envName: 'DEVELOPMENT' | 'STAGING' | 'PRODUCTION';
  apiUrl: string;
  pusherAppKey: string;
  dappUrl: string;
  pusherBeamInstanceId: string;
}

function getEnvironment(): Environment {
  const releaseChannel = manifest && manifest.releaseChannel;

  if (releaseChannel && releaseChannel.indexOf('prod') !== -1) { // matches prod-v1, prod-v2, prod-v3
    return {
      envName: "PRODUCTION",
      apiUrl: "https://api.elysia.land",
      pusherAppKey: '36d90ee1d112e5e237b5',
      dappUrl: "dapp.elysia.land",
      pusherBeamInstanceId: "0815f35a-ae7d-44d6-b36a-90d1a53a9298",
    };
  }

  if (releaseChannel && releaseChannel.indexOf('staging') !== -1) { // matches staging-v1, staging-v2
    return {
      envName: "STAGING",
      apiUrl: "https://staging-api.elysia.land",
      pusherAppKey: '520f79c3f3a81f484834',
      dappUrl: "staging-dapp.elysia.land",
      pusherBeamInstanceId: "8149421b-da1c-44e3-9ebd-798d9f47ee2c",
    };
  }

  return {
    envName: "DEVELOPMENT",
    apiUrl: `http://${(manifest.debuggerHost || 'localhost').split(':').shift()}:3000`,
    // apiUrl: "https://staging-api.elysia.land",
    pusherAppKey: 'f8163691d5d47ddcfed7',
    // dappUrl: "localhost:5000",
    dappUrl: "staging-dapp.elysia.land",
    pusherBeamInstanceId: "8149421b-da1c-44e3-9ebd-798d9f47ee2c",
  };
}

export default getEnvironment;
