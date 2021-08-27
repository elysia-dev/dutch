# Dutch ☕

Dutch is a mobile interface that provides a decentralized marketplace connecting real estate.

For up to the minute news, follow our [Twitter](https://twitter.com/Elysia_HQ), [Medium pages](https://medium.com/@ELYSIA_HQ) or [Release Notes](https://www.notion.so/modoripage/Release-Notes-cb3dabaf23a345af81e96696b1a47602)

- Can create or recover ethereum wallet.
- Can purchase and refund asset token.
- Can claim rewards.
- Can get latest asset token detail info.
- Support Metamask or ImToken Mobile wallet.

## Requirements

In `./.env.development`, below environment variables shoud be declared.

| Variable Name              | Description                            | Example                                         |
| -------------------------- | -------------------------------------- | ----------------------------------------------- |
| API_URL                    | API server url                         | https://staging-api.elysia.land                 |
| DAPP_URL                   | Deployed hazelnut url                  | staging-dapp.elysia.land                        |
| BSC_RPC_ENDPOINT           | Binance Smarc Chain RPC endpoint       | https://data-seed-prebsc-1-s1.binance.org:8545/ |
| ETH_NETWORK                | Ethereum network (mainnet, kovan, etc) | kovan                                           |
| EL_ADDRESS                 | Deployed EL token contract address     | 0xea26b65ed9571832a7f056ab7e6b7e755bb1d7be      |
| ELFI_ADDRESS               | Deployed ELFI token contract address   | 0x90104f13a17694cda413220ec09220eca8f8efac      |
| DAI_ADDRESS                | Deployed DAI token contract address    | 0xc4375b7de8af5a38a93548eb8453a498222c4ff2      |
| EL_STAKING_POOL_ADDRESS    | Deployed EL token staking address      | 0x045E0Dc1d47F57418bd7c99c7ba1D01D49d03198      |
| ELFI_STAKING_POOL_ADDRESS  | Deployed ELFI token staking address    | \*\*\*                                          |
| INFURA_PROJECT_ID          | Infura project id                      | \*\*\*                                          |
| APP_GOOGLE_MAP_API_IOS     | Google map API key for ios             | \*\*\*                                          |
| APP_GOOGLE_MAP_API_ANDROID | Google map API key for android         | \*\*\*                                          |
| ETHERSCAN_API              | Etherscan API key                      | \*\*\*                                          |
| BSCSCAN_API                | Bscscan API key                        | \*\*\*                                          |
| ETHERSCAN_API_URL          | Etherscan testnet api url              | https://api-kovan.etherscan.io/api              |
| BSCSCAN_API_URL            | Bscscan testnet api url                | https://api-testnet.bscscan.com/api             |
| APP_ENV                    | APP Env                                | development                                     |

Example

```
API_URL=https://staging-api.elysia.land
DAPP_URL=staging-dapp.elysia.land
BSC_RPC_ENDPOINT=https://data-seed-prebsc-1-s1.binance.org:8545/
ETH_NETWORK=kovan
EL_ADDRESS=0xea26b65ed9571832a7f056ab7e6b7e755bb1d7be
INFURA_PROJECT_ID=***
APP_GOOGLE_MAP_API_IOS=***
APP_GOOGLE_MAP_API_ANDROID=***
ETHERSCAN_API=***
BSCSCAN_API=***
ETHERSCAN_API_URL=https://api-kovan.etherscan.io/api
BSCSCAN_API_URL=https://api-testnet.bscscan.com/api
APP_ENV=development
```

## Getting started

```
yarn
yarn start
```
