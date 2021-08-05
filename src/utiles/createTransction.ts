import { BigNumber, constants, ethers, utils } from 'ethers';
import Wallet from '../core/Wallet';
import Accelerate from '../enums/Accelerate';
import CryptoType from '../enums/CryptoType';
import { getElysiaContract } from './getContract';

export const purchaseProduct = async (
  gasPrice: string,
  bscGasPrice: string,
  fromType: CryptoType,
  contract: ethers.Contract | null,
  valuesFrom: string,
  wallet: Wallet | undefined,
  getCryptoPrice: (cryptoType: CryptoType | 'NONE') => number,
  updateGasPrice?: string,
  accelerate?: Accelerate,
) => {
  let populatedTransaction: ethers.PopulatedTransaction | undefined;
  const valueInDollar = String(getCryptoPrice(fromType));
  const isAccelerate = accelerate === Accelerate.Accelerate;
  console.log(bscGasPrice);
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
          ? utils.parseUnits(updateGasPrice || '', 'gwei')
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
          ? utils.parseUnits(updateGasPrice || '', 'gwei')
          : BigNumber.from('100'),
      });
    }
  } catch (e) {
    console.log(e);
  }
};

export const sendCryptoAsset = async (
  gasPrice: string,
  bscGasPrice: string,
  assetType?: CryptoType,
  address?: string,
  value?: string,
  wallet?: Wallet,
  updateGasPrice?: string,
  accelerate?: Accelerate,
) => {
  const isAccelerate = accelerate === Accelerate.Accelerate;

  if (assetType === CryptoType.EL) {
    const elContract = getElysiaContract();
    const populatedTransaction = await elContract?.populateTransaction.transfer(
      address,
      utils.parseEther(value || ''),
    );

    if (!populatedTransaction) return;
    return await wallet?.getFirstSigner().sendTransaction({
      to: populatedTransaction.to,
      data: populatedTransaction.data,
      gasPrice: isAccelerate
        ? utils.parseUnits(updateGasPrice || '', 'gwei')
        : BigNumber.from('100'),
    });
  } else {
    return await wallet?.getFirstSigner(assetType).sendTransaction({
      to: address,
      value: utils.parseEther(value || '').toHexString(),
      gasPrice: isAccelerate
        ? utils.parseUnits(updateGasPrice || '', 'gwei')
        : assetType === CryptoType.BNB
        ? BigNumber.from(bscGasPrice)
        : BigNumber.from('100'),
    });
  }
};
