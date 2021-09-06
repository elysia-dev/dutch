import { Contract } from '@ethersproject/contracts';
import { BigNumber, utils } from 'ethers';
import { useContext, useEffect, useState } from 'react';
import PriceContext from '../contexts/PriceContext';
import UserContext from '../contexts/UserContext';
import WalletContext from '../contexts/WalletContext';
import CryptoType from '../enums/CryptoType';

type info = {
  estimagedGasPrice: string;
  setEstimateGas: () => Promise<void>;
};

const usePurchaseGas = (
  contract: Contract | null,
  assetInCrypto: CryptoType,
): info => {
  const [estimagedGasPrice, setEstimatedGasPrice] = useState<string>('');
  const { gasPrice, bscGasPrice } = useContext(PriceContext);
  const { isWalletUser, user } = useContext(UserContext);
  const { wallet } = useContext(WalletContext);
  const address = isWalletUser
    ? wallet?.getFirstAddress()
    : user.ethAddresses[0];

  const setEstimateGas = async () => {
    setEstimatedGasPrice((await estimateGasByType()) || '');
  };

  const estimateGasByType = async () => {
    let estimateGas: BigNumber | undefined;
    try {
      switch (assetInCrypto) {
        case CryptoType.ETH:
        case CryptoType.BNB:
          estimateGas = await contract?.estimateGas.purchase({
            from: address,
            value: utils.parseEther('0.1'),
          });
          break;
        default:
          estimateGas = await contract?.estimateGas.purchase(
            utils.parseEther('100'),
            {
              from: address,
            },
          );
      }

      if (estimateGas) {
        return utils.formatEther(
          estimateGas.mul(
            assetInCrypto !== CryptoType.BNB ? gasPrice : bscGasPrice,
          ),
        );
      }
    } catch (error) {
      throw Error;
    }
  };

  useEffect(() => {
    setEstimateGas();
  }, []);

  return { estimagedGasPrice, setEstimateGas };
};

export default usePurchaseGas;
