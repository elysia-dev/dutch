import { ENCRYPTED_WALLET, IS_WALLET_USER } from "../constants/storage";
import AsyncStorage from "@react-native-community/async-storage";
import CryptoES from 'crypto-es';
import Wallet from "./Wallet";

class WalletStorage {
  static async save(wallet: Wallet, password: string): Promise<void> {
    const encrypted = await CryptoES.AES.encrypt(JSON.stringify(wallet.serialize()), password);
    await AsyncStorage.setItem(ENCRYPTED_WALLET, encrypted.toString());
    await AsyncStorage.setItem(IS_WALLET_USER, 'true');
  }

  static async load(password: string): Promise<Wallet> {
    const encrypted = await AsyncStorage.getItem(ENCRYPTED_WALLET);

    if (!encrypted) {
      throw new Error('No previous wallet.')
    }

    const decrypted = await CryptoES.AES.decrypt(encrypted, password);
    const data = decrypted.toString(CryptoES.enc.Utf8);

    if (!data) {
      throw new Error('Invalid password')
    }

    return Wallet.deserialize(JSON.parse(data));
  }

  static async clear(): Promise<void> {
    await AsyncStorage.removeItem(ENCRYPTED_WALLET);
    await AsyncStorage.removeItem(IS_WALLET_USER);
  }
}

export default WalletStorage;