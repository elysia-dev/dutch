import Constants from 'expo-constants';
import { useElysiaToken } from '../hooks/useContract';
const { manifest } = Constants;

type Environment = {
  envName: 'DEVELOPMENT' | 'STAGING' | 'PRODUCTION';
  apiUrl: string;
  dappUrl: string;
  version: string;
  infuraProjectId: string;
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
      version: '1.2.4',
      infuraProjectId: 'dd59c338cf774f818bbbe221d7fc872a',
      ethNetwork: 'mainnet',
      elAddress: '0x2781246fe707bb15cee3e5ea354e2154a2877b16'
    };
  }

  if (releaseChannel && releaseChannel.indexOf('staging') !== -1) {
    // matches staging-v1, staging-v2
    return {
      envName: 'STAGING',
      apiUrl: 'https://staging-api.elysia.land',
      dappUrl: 'staging-dapp.elysia.land',
      version: '1.2.4',
      infuraProjectId: 'dd59c338cf774f818bbbe221d7fc872a',
      ethNetwork: 'ropsten',
      elAddress: '0x5735af25c6be1b5822ccd03cdad3c84eb1e0e9c8'
    };
  }

  return {
    envName: 'DEVELOPMENT',
    // apiUrl: 'https://api.elysia.land',
    apiUrl: 'https://staging-api.elysia.land',
    // apiUrl: `http://${(manifest.debuggerHost || 'localhost')
    //   .split(':')
    //   .shift()}:3000`,
    // dappUrl: 'localhost:3001',
    dappUrl: 'staging-dapp.elysia.land',
    version: '1.2.3',
    infuraProjectId: 'dd59c338cf774f818bbbe221d7fc872a',
    ethNetwork: 'ropsten',
    elAddress: '0x5735af25c6be1b5822ccd03cdad3c84eb1e0e9c8'
  };
}

export default getEnvironment;
