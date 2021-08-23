import { ERC20__factory } from '@elysia-dev/contract-typechain';
import { useContext } from 'react';
import { ELFI_ADDRESS, EL_ADDRESS } from 'react-native-dotenv';
import WalletContext from '../contexts/WalletContext';
import CryptoType from '../enums/CryptoType';
import { provider } from '../utiles/getContract';

const useErcContract = (crytoType: CryptoType) => {
  const { wallet } = useContext(WalletContext);
  const contract = ERC20__factory.connect(
    crytoType === CryptoType.EL ? EL_ADDRESS : ELFI_ADDRESS,
    wallet?.getFirstSigner() || provider,
  );
  return contract;
};

export default useErcContract;
