import { HDNode, entropyToMnemonic, mnemonicToSeed } from "ethers/lib/utils";
import * as Random from 'expo-random';

interface SerializedWallet {
  seed: string;
  mnemonic: string;
}

class Wallet {
  private seed: string;
  private mnemonic: string;
  private root: HDNode;

  constructor(seed: string, mnemonic: string) {
    this.seed = seed;
    this.mnemonic = mnemonic;
    this.root = HDNode.fromSeed(seed);
  }

  serialize(): SerializedWallet {
    return {
      seed: this.seed,
      mnemonic: this.mnemonic,
    }
  }

  getRoot(): HDNode {
    return this.root;
  }

  getMnemonic(): string {
    return this.mnemonic
  }

  static deserialize(data: SerializedWallet): Wallet {
    return new Wallet(data.seed, data.mnemonic);
  }

  static async createNewWallet(): Promise<Wallet> {
    const entropy = await Random.getRandomBytesAsync(16);
    const mnemonic = entropyToMnemonic(entropy);
    const seed = mnemonicToSeed(mnemonic);
    return new Wallet(seed, mnemonic);
  }
}

export default Wallet;