import { ERC20, ERC20__factory } from '@elysia-dev/contract-typechain';
import { useContext, useEffect, useState } from 'react';
import { DAI_ADDRESS, ELFI_ADDRESS, EL_ADDRESS } from 'react-native-dotenv';
import WalletContext from '../contexts/WalletContext';
import CryptoType from '../enums/CryptoType';
import { provider } from '../utiles/getContract';
const useErcContract = () => {
  const { wallet } = useContext(WalletContext);

  const getContract = (ercAddress: string) => {
    return ERC20__factory.connect(
      ercAddress,
      wallet?.getFirstSigner() || provider,
    );
  };
  const [ercAddressInfo, setErcAddressInfo] = useState<{
    elContract: ERC20;
    elfiContract: ERC20;
    daiContract: ERC20;
  }>({
    elContract: getContract(EL_ADDRESS),
    elfiContract: getContract(ELFI_ADDRESS),
    daiContract: getContract(DAI_ADDRESS),
  });

  return ercAddressInfo;
};

export default useErcContract;
