// ! important
// https://github.com/ethers-io/ethers.js/issues/993
// arrayBuffer not work on all platform. react-native has not implemented this method yet:
// So always provicer fetch return missing response!
// ethersproject/shims is requires!
import '@ethersproject/shims';
import { Contract } from '@ethersproject/contracts';
import { AddressZero } from '@ethersproject/constants';
import { getAddress } from '@ethersproject/address';
import { InfuraProvider, JsonRpcProvider } from '@ethersproject/providers';
import {
  ETH_NETWORK,
  INFURA_PROJECT_ID,
  BSC_RPC_ENDPOINT,
  EL_ADDRESS,
} from 'react-native-dotenv';
import AssetTokenBnbAbi from '../abi/AssetTokenBnb.json';
import ERC20Abi from '../abi/ERC20Abi.json';
import AssetTokenEthAbi from '../abi/AssetTokenEthAbi.json';
import AssetTokenAbi from '../abi/AssetTokenAbi.json';
import CryptoType from '../enums/CryptoType';

export function isAddress(value: any): string | false {
  try {
    return getAddress(value);
  } catch {
    return false;
  }
}

export const provider = new InfuraProvider(ETH_NETWORK, INFURA_PROJECT_ID);

export const bscProvider = new JsonRpcProvider(BSC_RPC_ENDPOINT);

export function getBscContract(address: string, ABI: any): Contract {
  if (!isAddress(address) || address === AddressZero) {
    throw Error(`Invalid 'address' parameter '${address}'.`);
  }
  return new Contract(address, ABI, bscProvider);
}

// account is optional
function getContract(address: string, ABI: any): Contract {
  if (!isAddress(address) || address === AddressZero) {
    throw Error(`Invalid 'address' parameter '${address}'.`);
  }

  return new Contract(address, ABI, provider);
}

export function getElysiaContract(): Contract | null {
  return getContract(EL_ADDRESS, ERC20Abi);
}

export function getAssetTokenContract(address: string): Contract | null {
  return getContract(address, AssetTokenAbi);
}

export function getAssetTokenEthContract(address: string): Contract | null {
  return getContract(address, AssetTokenEthAbi);
}

export function getBscAssetTokenContract(address: string): Contract | null {
  return getBscContract(address, AssetTokenBnbAbi);
}

export function getAssetTokenFromCryptoType(
  cryptoType: CryptoType,
  address: string,
): Contract | null {
  switch (cryptoType) {
    case CryptoType.ETH:
      return getAssetTokenEthContract(address);
    case CryptoType.BNB:
      return getBscAssetTokenContract(address);
    default:
      return getAssetTokenContract(address);
  }
}

export default getContract;
