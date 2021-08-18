// ! important
// https://github.com/ethers-io/ethers.js/issues/993
// arrayBuffer not work on all platform. react-native has not implemented this method yet:
// So always provicer fetch return missing response!
// ethersproject/shims is requires!
import '@ethersproject/shims';
import { Contract } from '@ethersproject/contracts';
import { AddressZero } from '@ethersproject/constants';
import { getAddress } from '@ethersproject/address';
import {
  InfuraProvider,
  JsonRpcProvider,
  Provider,
} from '@ethersproject/providers';
import {
  ETH_NETWORK,
  INFURA_PROJECT_ID,
  BSC_RPC_ENDPOINT,
  EL_ADDRESS,
  EL_STAKING_POOL_ADDRESS,
  ELFI_STAKING_POOL_ADDRESS,
} from 'react-native-dotenv';
import AssetTokenBnbAbi from '../abi/AssetTokenBnb.json';
import ERC20Abi from '../abi/ERC20Abi.json';
import AssetTokenEthAbi from '../abi/AssetTokenEthAbi.json';
import AssetTokenAbi from '../abi/AssetTokenAbi.json';
import StakingPoolAbi from '../abi/StakingPoolAbi.json';
import CryptoType from '../enums/CryptoType';
import { Signer } from '@ethersproject/abstract-signer';
import {
  ERC20,
  ERC20__factory,
  StakingPool,
  StakingPool__factory,
} from '@elysia-dev/contract-typechain';

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

export function getElStakingPoolContract(): Contract | null {
  return getContract(EL_STAKING_POOL_ADDRESS, StakingPoolAbi);
}

export function getElfiStakingPoolContract(): Contract | null {
  return getContract(ELFI_STAKING_POOL_ADDRESS, StakingPoolAbi);
}

export function getErc20Contract(
  address: string,
  signer: Provider | Signer,
): ERC20 {
  return ERC20__factory.connect(address, signer);
}
export function getStakingPoolContract(
  stakingPooladdress: string,
  signer: Provider | Signer,
): StakingPool {
  return StakingPool__factory.connect(stakingPooladdress, signer);
}

export default getContract;
