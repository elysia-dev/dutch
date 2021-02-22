import { Contract } from '@ethersproject/contracts';
import { useMemo } from 'react';
import AssetTokenAbi from '../abi/AssetTokenAbi.json';
import ERC20Abi from '../abi/ERC20Abi.json';
import getContract from '../utiles/getContract';
import getEnvironment from '../utiles/getEnvironment';

function useContract(address: string | undefined, ABI: any): Contract | null {
  return useMemo(() => {
    if (!address || !ABI) return null;
    try {
      return getContract(address, ABI);
    } catch (error) {
      return null;
    }
  }, [address, ABI]);
}

export function useAssetToken(address: string): Contract | null {
  return useContract(address, AssetTokenAbi);
}

export function useElysiaToken(): Contract | null {
  return useContract(getEnvironment().elAddress, ERC20Abi);
}
