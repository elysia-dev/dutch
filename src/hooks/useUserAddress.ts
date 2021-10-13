import { useContext } from 'react';
import UserContext from '../contexts/UserContext';
import WalletContext from '../contexts/WalletContext';

const useUserAddress = () => {
  const { user, isWalletUser } = useContext(UserContext);
  const { wallet } = useContext(WalletContext);

  const userAddress = isWalletUser
    ? wallet?.getFirstAddress()
    : user.ethAddresses
    ? user.ethAddresses[0]
    : '';

  return userAddress;
};

export default useUserAddress;
