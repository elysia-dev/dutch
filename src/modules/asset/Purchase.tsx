import React, {
  FunctionComponent,
  useContext,
  useEffect,
  useState,
} from 'react';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { BigNumber } from '@ethersproject/bignumber';
import { ethers, utils, constants } from 'ethers';
import { useTranslation } from 'react-i18next';
import CryptoType from '../../enums/CryptoType';
import WalletContext from '../../contexts/WalletContext';
import TxStep from '../../enums/TxStep';
import { useWatingTx } from '../../hooks/useWatingTx';
import TxStatus from '../../enums/TxStatus';
import TxInput from './components/TxInput';
import useTxHandler from '../../hooks/useTxHandler';
import UserContext from '../../contexts/UserContext';
import PaymentSelection from '../../shared/components/PaymentSelection';
import PriceContext from '../../contexts/PriceContext';
import Asset from '../../types/Asset';
import NetworkType from '../../enums/NetworkType';
import {
  getAssetTokenFromCryptoType,
  getElysiaContract,
} from '../../utiles/getContract';
import PurposeType from '../../enums/PurposeType';
import AssetContext from '../../contexts/AssetContext';

type ParamList = {
  Purchase: {
    assetInCrypto: Asset;
    assetInToken: Asset;
    remainingSupplyInToken: number;
    contractAddress: string;
    productId: number; // legacy
  };
};

const Purchase: FunctionComponent = () => {
  const route = useRoute<RouteProp<ParamList, 'Purchase'>>();
  const {
    assetInCrypto,
    assetInToken,
    remainingSupplyInToken,
    contractAddress,
    productId,
  } = route.params;
  const [values, setValues] = useState({
    inFiat: '',
    inToken: '',
  });
  const [state, setState] = useState({
    txHash: '',
    step: TxStep.CheckAllowance,
    espressoTxId: '',
    stage: 0,
    estimateGas: '',
    isApproved: !![CryptoType.ETH, CryptoType.BNB].includes(assetInCrypto.type),
  });
  const [current, setCurrent] = useState<'token' | 'fiat'>('token');
  const navigation = useNavigation();
  const { isWalletUser, Server, user } = useContext(UserContext);
  const { wallet } = useContext(WalletContext);
  const txResult = useWatingTx(
    state.txHash,
    assetInCrypto.type === CryptoType.BNB ? NetworkType.BSC : NetworkType.ETH,
  );
  const { gasPrice, bscGasPrice, getCryptoPrice } = useContext(PriceContext);
  const { afterTxFailed, afterTxHashCreated, afterTxCreated } = useTxHandler();
  const { t } = useTranslation();
  const contract = getAssetTokenFromCryptoType(
    assetInCrypto.type,
    contractAddress,
  );
  const { getBalance } = useContext(AssetContext);

  const remainingSupplyInCrypto =
    ((remainingSupplyInToken || 0) * 5) / getCryptoPrice(assetInCrypto.type);
  const cryptoPrice = getCryptoPrice(assetInCrypto.type);
  const tokenPrice = getCryptoPrice(CryptoType.ELA);
  const balanceInCrypto = getBalance(assetInCrypto.type);
  const balanceInToken = (balanceInCrypto * cryptoPrice) / tokenPrice;

  const estimateGas = async (address: string) => {
    let estimateGas: BigNumber | undefined;

    try {
      switch (assetInCrypto.type) {
        case CryptoType.ETH:
        case CryptoType.BNB:
          estimateGas = await contract?.estimateGas.purchase({
            from: address,
            value: utils.parseEther('0.5'),
          });
          break;
        default:
          estimateGas = await contract?.estimateGas.purchase(
            utils.parseEther('100'),
            {
              from: address,
            },
          );
      }

      if (estimateGas) {
        setState({
          ...state,
          estimateGas: utils.formatEther(
            estimateGas.mul(
              assetInCrypto.type === CryptoType.ETH ? gasPrice : bscGasPrice,
            ),
          ),
        });
      }
    } catch (e) {
      setState({
        ...state,
        estimateGas: '',
      });
    }
  };

  useEffect(() => {
    const address = isWalletUser
      ? wallet?.getFirstAddress()
      : user.ethAddresses[0];

    if (address) {
      estimateGas(address);
    }
  }, []);

  const createTx = async () => {
    let populatedTransaction: ethers.PopulatedTransaction | undefined;
    let txRes: ethers.providers.TransactionResponse | undefined;
    const valueInDollar = String(getCryptoPrice(assetInCrypto.type));

    try {
      switch (assetInCrypto.type) {
        case (CryptoType.ETH, CryptoType.BNB):
          populatedTransaction = await contract?.populateTransaction.purchase();

          if (!populatedTransaction) break;

          txRes = await wallet
            ?.getFirstSigner(assetInCrypto.type)
            .sendTransaction({
              to: populatedTransaction.to,
              data: populatedTransaction.data,
              value: utils
                .parseEther(values.inFiat)
                .mul(constants.WeiPerEther)
                .div(utils.parseEther(valueInDollar)), // dollar to crypto
            });

          break;
        default:
          populatedTransaction = await contract?.populateTransaction.purchase(
            utils
              .parseEther(values.inFiat)
              .mul(constants.WeiPerEther)
              .div(utils.parseEther(valueInDollar)),
          );

          if (!populatedTransaction) break;

          txRes = await wallet?.getFirstSigner().sendTransaction({
            to: populatedTransaction.to,
            data: populatedTransaction.data,
          });

          break;
      }

      if (assetInCrypto.type === CryptoType.BNB) {
        setState({
          ...state,
          txHash: txRes?.hash || '',
        });
      }
    } catch (e) {
      afterTxFailed(e.message);
      navigation.goBack();
    } finally {
      if (assetInCrypto.type !== CryptoType.BNB && txRes) {
        afterTxHashCreated(
          wallet?.getFirstAddress() || '',
          contractAddress,
          txRes.hash || '',
          NetworkType.ETH,
        );
        navigation.goBack();
      }
    }
  };

  useEffect(() => {
    switch (state.step) {
      case TxStep.CheckAllowance:
        if ([CryptoType.ETH, CryptoType.BNB].includes(assetInCrypto.type)) {
          setState({ ...state, step: TxStep.None });
          return;
        } else if (!isWalletUser) {
          setState({ ...state, step: TxStep.None });
          return;
        }

        if (isWalletUser) {
          getElysiaContract()
            ?.allowance(wallet?.getFirstNode()?.address, contractAddress)
            .then((res: BigNumber) => {
              if (!res.isZero()) {
                setState({
                  ...state,
                  isApproved: true,
                  step: TxStep.None,
                });
              } else {
                setState({
                  ...state,
                  isApproved: false,
                  step: TxStep.None,
                });
              }
            })
            .catch((e: any) => {
              afterTxFailed(e.message);
              navigation.goBack();
            });
        }
        break;

      case TxStep.Approving:
        getElysiaContract()
          ?.populateTransaction.approve(contractAddress, '1' + '0'.repeat(30))
          .then((populatedTransaction) => {
            wallet
              ?.getFirstSigner()
              .sendTransaction({
                to: populatedTransaction.to,
                data: populatedTransaction.data,
              })
              .then((tx: any) => {
                setState({
                  ...state,
                  isApproved: true,
                  txHash: tx,
                  step: TxStep.None,
                });
              })
              .catch((e) => {
                afterTxFailed(e.message);
                navigation.goBack();
              });
          });
        break;
      case TxStep.Creating:
        createTx();
        break;
      case TxStep.Created:
        afterTxCreated(
          state.txHash,
          assetInCrypto.type === CryptoType.BNB
            ? NetworkType.BSC
            : NetworkType.ETH,
        );
        navigation.goBack();
        break;
      default:
        break;
    }
  }, [state.step]);

  useEffect(() => {
    if (![TxStatus.Success, TxStatus.Fail].includes(txResult.status)) return;

    switch (state.step) {
      case TxStep.Approving:
        setState({
          ...state,
          step:
            txResult.status === TxStatus.Success
              ? TxStep.Creating
              : TxStep.Failed,
        });
        break;
      case TxStep.Creating:
        setState({
          ...state,
          step:
            txResult.status === TxStatus.Success
              ? TxStep.Created
              : TxStep.Failed,
        });
        break;
      default:
        break;
    }
  }, [txResult.status]);

  if (state.stage === 0) {
    return (
      <TxInput
        purpose={PurposeType.Purchase}
        title={t('assets.purchase')}
        fiatInputTitle={t('assets.purchase_value')}
        tokenInputTitle={t('assets.purchase_stake')}
        assetInCrypto={assetInCrypto}
        assetInToken={assetInToken}
        remainingSupplyInToken={remainingSupplyInToken}
        remainingSupplyInCrypto={remainingSupplyInCrypto}
        balanceInToken={balanceInToken}
        balanceInCrypto={balanceInCrypto}
        values={values}
        cryptoPrice={cryptoPrice}
        tokenPrice={tokenPrice}
        current={current}
        step={state.step}
        setCurrent={setCurrent}
        setValues={setValues}
        disabled={parseInt(values.inToken || '0', 10) < 1}
        estimateGas={state.estimateGas}
        isApproved={state.isApproved}
        createTx={() => {
          if (isWalletUser) {
            if (state.isApproved) {
              setState({ ...state, step: TxStep.Creating });
            } else {
              setState({ ...state, step: TxStep.Approving });
            }
          } else {
            Server.requestTransaction(
              productId,
              parseFloat(values.inToken),
              'buying',
            )
              .then((res) => {
                setState({
                  ...state,
                  stage: 1,
                  espressoTxId: res.data.id,
                });
              })
              .catch((e) => {
                if (e.response.status === 400) {
                  alert(t('product.transaction_error'));
                } else if (e.response.status === 500) {
                  alert(t('account_errors.server'));
                }
              });
          }
        }}
      />
    );
  }

  return (
    <PaymentSelection
      value={parseFloat(values.inToken)}
      page="asset"
      assetTxData={{
        productId,
        type: 'buying',
      }}
      contractAddress={contractAddress}
      espressoTxId={state.espressoTxId}
    />
  );
};

export default Purchase;
