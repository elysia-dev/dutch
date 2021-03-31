import Constants from 'expo-constants';
const { manifest } = Constants;

type Environment = {
  envName: 'DEVELOPMENT' | 'STAGING' | 'PRODUCTION';
  apiUrl: string;
  dappUrl: string;
  version: string;
  infuraProjectId: string;
  bscRPCEndpoint: string;
  elAddress: string;
  ethNetwork: string;
};

function getEnvironment(): Environment {
  const releaseChannel = manifest && manifest.releaseChannel;

  if (releaseChannel && releaseChannel.indexOf('prod') !== -1) {
    // matches prod-v1, prod-v2, prod-v3
    return {
      envName: 'PRODUCTION',
      apiUrl: 'https://api.elysia.land',
      dappUrl: 'dapp.elysia.land',
      version: '1.4.3',
      infuraProjectId: 'dd59c338cf774f818bbbe221d7fc872a',
      bscRPCEndpoint: 'https://bsc-dataseed.binance.org/',
      ethNetwork: 'mainnet',
      elAddress: '0x2781246fe707bb15cee3e5ea354e2154a2877b16',
    };
  }

  if (releaseChannel && releaseChannel.indexOf('staging') !== -1) {
    // matches staging-v1, staging-v2
    return {
      envName: 'STAGING',
      apiUrl: 'https://staging-api.elysia.land',
      dappUrl: 'staging-dapp.elysia.land',
      version: '1.4.3',
      infuraProjectId: '4f4e9528f1fb446abeb64e05ff08fdbe',
      bscRPCEndpoint: 'https://data-seed-prebsc-1-s1.binance.org:8545/',
      ethNetwork: 'kovan',
      elAddress: '0xea26b65ed9571832a7f056ab7e6b7e755bb1d7be',
    };
  }

  return {
    envName: 'DEVELOPMENT',
    apiUrl: 'https://api.elysia.land',
    //apiUrl: 'https://staging-api.elysia.land',
    //apiUrl: `http://${(manifest.debuggerHost || 'localhost')
    //.split(':')
    //.shift()}:3000`,
    // dappUrl: 'localhost:3001',
    dappUrl: 'staging-dapp.elysia.land',
    version: '1.4.3',
    infuraProjectId: '4f4e9528f1fb446abeb64e05ff08fdbe',
    //bscRPCEndpoint: 'https://data-seed-prebsc-1-s1.binance.org:8545/',
    bscRPCEndpoint: 'https://bsc-dataseed.binance.org/',
    ethNetwork: 'mainnet',
    elAddress: '0xea26b65ed9571832a7f056ab7e6b7e755bb1d7be',
  };
}

export default getEnvironment;
