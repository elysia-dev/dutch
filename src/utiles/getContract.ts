// ! important
// https://github.com/ethers-io/ethers.js/issues/993
// arrayBuffer not work on all platform. react-native has not implemented this method yet:
// So always provicer fetch return missing response!
// ethersproject/shims is requires!
import "@ethersproject/shims";
import { Contract } from '@ethersproject/contracts';
import { AddressZero } from '@ethersproject/constants';
import { getAddress } from '@ethersproject/address';
import { InfuraProvider } from '@ethersproject/providers';
import getEnvironment from './getEnvironment';

function isAddress(value: any): string | false {
  try {
    return getAddress(value);
  } catch {
    return false;
  }
}

export const provider = new InfuraProvider(
  getEnvironment().ethNetwork,
  getEnvironment().infuraProjectId,
);

// account is optional
function getContract(address: string, ABI: any): Contract {
  if (!isAddress(address) || address === AddressZero) {
    throw Error(`Invalid 'address' parameter '${address}'.`);
  }

  return new Contract(address, ABI, provider);
}

export default getContract;
