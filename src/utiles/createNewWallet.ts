import { entropyToMnemonic } from "ethers/lib/utils";
import * as Random from 'expo-random';
import { Account } from "../contexts/WalletContext";

const createNewWallet = async (): Promise<Account> => {
  const entropy = await Random.getRandomBytesAsync(16);
  const mnemonic = entropyToMnemonic(entropy);

  // Generate keyring...
  return {
    public: '',
    private: '',
    mnemonic: mnemonic,
  }
}

export default createNewWallet