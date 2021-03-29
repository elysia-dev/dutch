import { Signer } from "@ethersproject/abstract-signer";
import { HDNode, entropyToMnemonic, mnemonicToSeed, defaultPath } from "ethers/lib/utils";
import { bscProvider, provider } from '../utiles/getContract';
import * as Random from 'expo-random';
import * as ethers from 'ethers';
import NetworkType from "../enums/NetworkType";

interface SerializedWallet {
  seed: string;
  mnemonic: string;
}

class Wallet {
  private seed: string;
  private mnemonic: string;
  private root: HDNode;
  private nodes: HDNode[];

  constructor(seed: string, mnemonic: string) {
    this.seed = seed;
    this.mnemonic = mnemonic;
    this.root = HDNode.fromSeed(seed);
    this.nodes = [this.root.derivePath(defaultPath)]
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

  getNodes(): HDNode[] {
    return this.nodes;
  }

  getMnemonic(): string {
    return this.mnemonic
  }

  getFirstNode(): HDNode | undefined {
    return this.nodes[0];
  }

  getFirstAddress(): string {
    return this.nodes[0]?.address || ''
  }

  getFirstSigner(networkType?: NetworkType): Signer {
    return new ethers.Wallet(this.nodes[0].privateKey, networkType === NetworkType.BSC ? bscProvider : provider)
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

  static async restoreWallet(mnemonic: string): Promise<Wallet> {
    const seed = mnemonicToSeed(mnemonic);
    return new Wallet(seed, mnemonic);
  }
}

export default Wallet;