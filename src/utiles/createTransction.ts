import { ERC20 } from '@elysia-dev/contract-typechain';
import { Contract } from '@ethersproject/contracts';
import { BigNumber, constants, ethers, utils } from 'ethers';
import Wallet from '../core/Wallet';
import Accelerate from '../enums/Accelerate';
import CryptoType from '../enums/CryptoType';
import { getElysiaContract } from './getContract';

export const purchaseProduct = async (
  gasPrice: string,
  bscGasPrice: string,
  fromType: CryptoType,
  contract: Contract | null,
  valuesFrom: string,
  wallet: Wallet | undefined,
  getCryptoPrice: (cryptoType: CryptoType) => number,
  changedGasPrice?: string,
  accelerate?: Accelerate,
) => {
  let populatedTransaction: ethers.PopulatedTransaction | undefined;
  const valueInDollar = String(getCryptoPrice(fromType));
  const isAccelerate = accelerate === Accelerate.Accelerate;
  try {
    if (fromType !== CryptoType.EL) {
      populatedTransaction = await contract?.populateTransaction.purchase();

      if (!populatedTransaction) return;

      return await wallet?.getFirstSigner(fromType).sendTransaction({
        to: populatedTransaction.to,
        data: populatedTransaction.data,
        value: utils
          .parseEther(valuesFrom)
          .mul(constants.WeiPerEther)
          .div(utils.parseEther(valueInDollar)), // dollar to crypto
        gasPrice: isAccelerate
          ? utils.parseUnits(changedGasPrice || '', 'gwei')
          : fromType === CryptoType.BNB
          ? BigNumber.from(bscGasPrice)
          : BigNumber.from(gasPrice),
      });
    } else {
      populatedTransaction = await contract?.populateTransaction.purchase(
        utils
          .parseEther(valuesFrom)
          .mul(constants.WeiPerEther)
          .div(utils.parseEther(valueInDollar)),
      );
      if (!populatedTransaction) return;
      return await wallet?.getFirstSigner().sendTransaction({
        to: populatedTransaction.to,
        data: populatedTransaction.data,
        gasPrice: isAccelerate
          ? utils.parseUnits(changedGasPrice || '', 'gwei')
          : BigNumber.from(gasPrice),
      });
    }
  } catch (e) {
    console.log(e);
  }
};

export const sendCryptoAsset = async (
  gasPrice: string,
  bscGasPrice: string,
  assetType: CryptoType,
  address?: string,
  value?: string,
  wallet?: Wallet,
  contract?: ERC20,
  changedGasPrice?: string,
  accelerate?: Accelerate,
) => {
  const isAccelerate = accelerate === Accelerate.Accelerate;
  try {
    if ([CryptoType.EL, CryptoType.ELFI, CryptoType.DAI].includes(assetType)) {
      return await contract?.transfer(
        address || '',
        utils.parseEther(value || ''),
      );
    } else {
      return await wallet?.getFirstSigner(assetType).sendTransaction({
        to: address,
        value: utils.parseEther(value || '').toHexString(),
        gasPrice: isAccelerate
          ? utils.parseUnits(changedGasPrice || '', 'gwei')
          : assetType === CryptoType.BNB
          ? BigNumber.from(bscGasPrice)
          : BigNumber.from(gasPrice),
      });
    }
  } catch (error) {
    console.log(error);
  }
};
