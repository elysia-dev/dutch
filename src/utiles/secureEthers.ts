// There is secureity issue when use ether js in react native
// https://docs.ethers.io/v5/cookbook/react-native/#cookbook-reactnative-security
// Import the crypto getRandomValues shim (**BEFORE** the shims)
import "react-native-get-random-values"

// Import the the ethers shims (**BEFORE** ethers)
import "@ethersproject/shims"

// Import the ethers library
import { ethers } from "ethers";

const secureEthers = ethers;

export default secureEthers;