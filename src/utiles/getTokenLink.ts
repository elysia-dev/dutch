import NetworkType from '../enums/NetworkType';
import Constants from 'expo-constants';

const getTokenLink = (address?: string, networkType?: NetworkType): string => {
  return networkType && networkType === NetworkType.BSC ?
    `https://${Constants.manifest?.extra?.ethNetwork === 'mainnet' ? '' : 'testnet.'}bscscan.com/token/${address}`
    : `https://${Constants.manifest?.extra?.ethNetwork === 'mainnet' ? '' : 'kovan.'}etherscan.io/token/${address}`
}

export default getTokenLink