import { BACKUP_COMPLETE, ENCRYPTED_WALLET, IS_MIGRATED_TO_SECURE, IS_WALLET_USER } from "../constants/storage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from 'expo-secure-store';
import CryptoES from 'crypto-es';
import Wallet from "./Wallet";
import { SECURE_ENCRYPTED_WALLET } from "../constants/securestorage";

class WalletStorage {
  static async save(wallet: Wallet, password: string): Promise<void> {
    const encrypted = await CryptoES.AES.encrypt(JSON.stringify(wallet.serialize()), password);
    await SecureStore.setItemAsync(SECURE_ENCRYPTED_WALLET, encrypted.toString());
    await AsyncStorage.setItem(IS_MIGRATED_TO_SECURE, 'true');
    await AsyncStorage.setItem(IS_WALLET_USER, 'true');
  }

  static async load(password: string): Promise<Wallet> {
    const migrated = await AsyncStorage.getItem(IS_MIGRATED_TO_SECURE);
    let encrypted = await AsyncStorage.getItem(ENCRYPTED_WALLET);

    if (migrated === 'true') {
      encrypted = await SecureStore.getItemAsync(SECURE_ENCRYPTED_WALLET);
    } else {
      if (encrypted) {
        await SecureStore.setItemAsync(SECURE_ENCRYPTED_WALLET, encrypted);
        await AsyncStorage.removeItem(ENCRYPTED_WALLET);
        await AsyncStorage.setItem(IS_MIGRATED_TO_SECURE, 'true');
      }
    }

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
    await SecureStore.deleteItemAsync(SECURE_ENCRYPTED_WALLET);
    await AsyncStorage.removeItem(BACKUP_COMPLETE);
    await AsyncStorage.removeItem(IS_WALLET_USER);
  }

  static async completeBackup(): Promise<void> {
    await AsyncStorage.setItem(BACKUP_COMPLETE, 'true');
  }

  static async isBackupComplete(): Promise<boolean> {
    return (await AsyncStorage.getItem(BACKUP_COMPLETE)) === 'true';
  }
}

export default WalletStorage;