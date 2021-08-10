import React, {
  FunctionComponent,
  useContext,
  useEffect,
  useState,
} from 'react';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { BigNumber } from '@ethersproject/bignumber';
import { ethers, utils } from 'ethers';
import { useTranslation } from 'react-i18next';
import CryptoType from '../../enums/CryptoType';
import WalletContext from '../../contexts/WalletContext';
import TxStep from '../../enums/TxStep';
import { useWatingTx } from '../../hooks/useWatingTx';
import TxStatus from '../../enums/TxStatus';
import TxInput from './components/TxInput';
import useTxHandler from '../../hooks/useTxHandler';
import UserContext from '../../contexts/UserContext';
import PaymentSelection from './components/PaymentSelection';
import PriceContext from '../../contexts/PriceContext';
import Asset from '../../types/Asset';
import NetworkType from '../../enums/NetworkType';
import {
  getAssetTokenFromCryptoType,
  getElysiaContract,
  provider,
} from '../../utiles/getContract';
import PurposeType from '../../enums/PurposeType';
import AssetContext from '../../contexts/AssetContext';
import TransactionContext from '../../contexts/TransactionContext';
import moment from 'moment';
import { purchaseProduct } from '../../utiles/createTransction';
import { Platform } from 'react-native';
import { useTransferTx } from '../../hooks/useTransferTx copy';
import TransferType from '../../enums/TransferType';
import AssetProvider from '../../providers/AssetProvider';

type ParamList = {
  Purchase: {
    from: Asset;
    to: Asset;
    toMax: number;
    contractAddress: string;
    productId: number; // legacy
  };
};

const Purchase: FunctionComponent = () => {
  const route = useRoute<RouteProp<ParamList, 'Purchase'>>();
  const { from, to, toMax, contractAddress, productId } = route.params;
  const [values, setValues] = useState({
    from: '',
    to: '',
  });
  const [state, setState] = useState({
    txHash: '',
    step: TxStep.CheckAllowance,
    espressoTxId: '',
    stage: 0,
    estimateGas: '',
    isApproved: !![CryptoType.ETH, CryptoType.BNB].includes(from.type),
  });
  const [current, setCurrent] = useState<'from' | 'to'>('to');
  const navigation = useNavigation();
  const { isWalletUser, Server, user } = useContext(UserContext);
  const { wallet } = useContext(WalletContext);
  const txResult = useWatingTx(
    state.txHash,
    from.type === CryptoType.BNB ? NetworkType.BSC : NetworkType.ETH,
  );

  const { gasPrice, bscGasPrice, getCryptoPrice } = useContext(PriceContext);
  const { afterTxFailed, afterTxCreated } = useTxHandler();
  const { t } = useTranslation();
  const contract = getAssetTokenFromCryptoType(from.type, contractAddress);
  const { getBalance, assets } = useContext(AssetContext);
  const changeSetTransfer = useTransferTx(from.type, productId);
  const fromMax = ((toMax || 0) * 5) / getCryptoPrice(from.type);
  const fromPrice = getCryptoPrice(from.type);
  const toPrice = getCryptoPrice(CryptoType.ELA);
  const fromBalance = getBalance(from.type);
  const toBalance = (fromBalance * fromPrice) / toPrice;

  const estimateGas = async (address: string) => {
    let estimateGas: BigNumber | undefined;
    try {
      switch (from.type) {
        case CryptoType.ETH:
        case CryptoType.BNB:
          estimateGas = await contract?.estimateGas.purchase({
            from: address,
            value: utils.parseEther('0.1'),
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
              from.type !== CryptoType.BNB ? gasPrice : bscGasPrice,
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

  const createTx = () => {
    changeSetTransfer(TransferType.PurChase, contract, values.from, values.to);
  };

  useEffect(() => {
    switch (state.step) {
      case TxStep.CheckAllowance:
        if ([CryptoType.ETH, CryptoType.BNB].includes(from.type)) {
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
        } else {
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
          from.type === CryptoType.BNB ? NetworkType.BSC : NetworkType.ETH,
        );
        navigation.goBack();
        break;
      default:
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
    }
  }, [txResult.status]);

  if (state.stage === 0) {
    return (
      <TxInput
        purpose={PurposeType.Purchase}
        title={t('assets.invest')}
        fromInputTitle={t('assets.invest_value')}
        toInputTitle={t('assets.invest_stake')}
        from={from}
        to={to}
        toMax={toMax}
        fromMax={fromMax}
        toBalance={toBalance}
        fromBalance={fromBalance}
        values={values}
        fromPrice={fromPrice}
        toPrice={toPrice}
        current={current}
        step={state.step}
        setCurrent={setCurrent}
        setValues={setValues}
        disabled={parseInt(values.to || '0') < 1}
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
              parseFloat(values.to),
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
      valueTo={parseFloat(values.to)}
      productId={productId}
      type={'buying'}
      contractAddress={contractAddress}
      espressTxId={state.espressoTxId}
    />
  );
};

export default Purchase;
