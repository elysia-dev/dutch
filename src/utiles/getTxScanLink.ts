import NetworkType from '../enums/NetworkType';
import Constants from 'expo-constants';

const getTxScanLink = (txHash?: string, networkType?: NetworkType): string => {
  return networkType && networkType === NetworkType.BSC ?
    `https://${Constants.manifest?.extra?.ethNetwork === 'mainnet' ? '' : 'testnet.'}bscscan.com/tx/${txHash}`
    : `https://${Constants.manifest?.extra?.ethNetwork === 'mainnet' ? '' : 'kovan.'}etherscan.io/tx/${txHash}`
}

export default getTxScanLink