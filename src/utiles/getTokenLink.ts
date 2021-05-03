import NetworkType from '../enums/NetworkType';
import {
  ETH_NETWORK
} from 'react-native-dotenv';

const getTokenLink = (address?: string, networkType?: NetworkType): string => {
  return networkType && networkType === NetworkType.BSC ?
    `https://${ETH_NETWORK === 'mainnet' ? '' : 'testnet.'}bscscan.com/token/${address}`
    : `https://${ETH_NETWORK === 'mainnet' ? '' : 'kovan.'}etherscan.io/token/${address}`
}

export default getTokenLink