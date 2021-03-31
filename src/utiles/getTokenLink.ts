import NetworkType from '../enums/NetworkType';
import getEnvironment from './getEnvironment';

const getTokenLink = (address?: string, networkType?: NetworkType): string => {
  return networkType && networkType === NetworkType.BSC ?
    `https://${getEnvironment().ethNetwork === 'main' ? '' : 'testnet.'}bscscan.com/token/${address}`
    : `https://${getEnvironment().ethNetwork === 'main' ? '' : 'kovan.'}etherscan.io/token/${address}`
}

export default getTokenLink