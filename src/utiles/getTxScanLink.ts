import NetworkType from '../enums/NetworkType';
import getEnvironment from './getEnvironment';

const getTxScanLink = (txHash?: string, networkType?: NetworkType): string => {
  return networkType && networkType === NetworkType.BSC ?
    `https://${getEnvironment().ethNetwork === 'main' ? '' : 'testnet.'}bscscan.com/tx/${txHash}`
    : `https://${getEnvironment().ethNetwork === 'main' ? '' : 'kovan.'}etherscan.io/tx/${txHash}`
}

export default getTxScanLink