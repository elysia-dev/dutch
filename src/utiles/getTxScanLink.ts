import NetworkType from '../enums/NetworkType';
import { ETH_NETWORK } from 'react-native-dotenv';

const getTxScanLink = (txHash?: string, networkType?: NetworkType): string => {
  return networkType && networkType === NetworkType.BSC
    ? `https://${
        ETH_NETWORK === 'mainnet' ? '' : 'testnet.'
      }bscscan.com/tx/${txHash}`
    : `https://${
        ETH_NETWORK === 'mainnet' ? '' : 'kovan.'
      }etherscan.io/tx/${txHash}`;
};

export default getTxScanLink;
