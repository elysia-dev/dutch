import React, {
  FunctionComponent, useContext, useEffect, useState,
} from 'react';
import CryptoType from '../../enums/CryptoType';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { BigNumber } from '@ethersproject/bignumber';
import WalletContext from '../../contexts/WalletContext';
import TxStep from '../../enums/TxStep';
import { useWatingTx } from '../../hooks/useWatingTx';
import TxStatus from '../../enums/TxStatus';
import { ethers, utils } from 'ethers';
import TxInput from './components/TxInput';
import useTxHandler from '../../hooks/useTxHandler';
import UserContext from '../../contexts/UserContext';
import { useTranslation } from 'react-i18next';
import PaymentSelection from './components/PaymentSelection';
import PriceContext from '../../contexts/PriceContext';
import Asset from '../../types/Asset';
import NetworkType from '../../enums/NetworkType';
import { getAssetTokenFromCryptoType, getElysiaContract } from '../../utiles/getContract';

type ParamList = {
  Purchase: {
    from: Asset,
    to: Asset,
    toMax: number,
    contractAddress: string,
    productId: number, // legacy
  };
};

const Purchase: FunctionComponent = () => {
  const [values, setValues] = useState({
    from: '',
    to: ''
  })
  const [state, setState] = useState({
    txHash: '',
    step: TxStep.CheckAllowance,
    espressoTxId: '',
    stage: 0,
    estimateGas: '',
  });
  const [current, setCurrent] = useState<'from' | 'to'>('to');
  const route = useRoute<RouteProp<ParamList, 'Purchase'>>()
  const { from, to, toMax, contractAddress } = route.params;
  const navigation = useNavigation();
  const { isWalletUser, Server } = useContext(UserContext);
  const { wallet } = useContext(WalletContext);
  const txResult = useWatingTx(state.txHash, from.type === CryptoType.BNB ? NetworkType.BSC : NetworkType.ETH);
  const { gasPrice, bscGasPrice, getCryptoPrice } = useContext(PriceContext);
  const { afterTxFailed, afterTxHashCreated, afterTxCreated } = useTxHandler();
  const { t } = useTranslation();
  const contract = getAssetTokenFromCryptoType(from.type, contractAddress);
  const [isApproved, setIsApproved] = useState([CryptoType.ETH, CryptoType.BNB].includes(from.type) ? true : false);

  const estimateGas = async () => {
    let estimateGas: BigNumber | undefined;

    try {
      switch (from.type) {
        case CryptoType.ETH:
        case CryptoType.BNB:
          estimateGas = await contract?.estimateGas.purchase({
            from: wallet?.getFirstAddress(),
            value: utils.parseEther('0.5')
          })
          break;
        default:
          estimateGas = await contract?.estimateGas.purchase(utils.parseEther('100'), {
            from: wallet?.getFirstNode()?.address
          })
      }
    } finally {
      if (estimateGas) {
        setState({
          ...state,
          estimateGas: utils.formatEther(estimateGas.mul(from.type === CryptoType.ETH ? gasPrice : bscGasPrice)),
        })
      }
    }
  }

  useEffect(() => {
    if (isWalletUser) {
      estimateGas();
    }
  }, [])

  const createTx = async () => {
    let populatedTransaction: ethers.PopulatedTransaction | undefined;
    let txRes: ethers.providers.TransactionResponse | undefined;

    try {
      const ether = String(parseFloat(values.from) / getCryptoPrice(from.type)) // dollar to crypto
      switch (from.type) {
        case CryptoType.ETH, CryptoType.BNB:
          populatedTransaction = await contract?.populateTransaction.purchase();

          if (!populatedTransaction) break;

          txRes = await wallet?.getFirstSigner(from.type).sendTransaction({
            to: populatedTransaction.to,
            data: populatedTransaction.data,
            value: utils.parseEther(ether),
          })

          break;
        default:
          populatedTransaction = await contract?.populateTransaction.purchase(
            utils.parseEther(ether)
          )

          if (!populatedTransaction) break;

          txRes = await wallet?.getFirstSigner().sendTransaction({
            to: populatedTransaction.to,
            data: populatedTransaction.data,
          })

          break;
      }

      if (from.type === CryptoType.BNB) {
        setState({
          ...state,
          txHash: txRes?.hash || '',
        })
      }

    } catch (e) {
      afterTxFailed(e.message);
      navigation.goBack();
    } finally {
      if (from.type !== CryptoType.BNB && txRes) {
        afterTxHashCreated(
          wallet?.getFirstAddress() || '',
          contractAddress,
          txRes.hash || '',
          NetworkType.ETH,
        )
        navigation.goBack();
      }
    }
  }

  useEffect(() => {
    switch (state.step) {
      case TxStep.CheckAllowance:
        if ([CryptoType.ETH, CryptoType.BNB].includes(from.type)) {
          setState({ ...state, step: TxStep.None })
          return
        }

        getElysiaContract()?.allowance(
          wallet?.getFirstNode()?.address, contractAddress
        ).then((res: BigNumber) => {
          if (!res.isZero()) { // res가 쓰려는 돈보다 적어야 함 (res.lte())
            setIsApproved(true);
          }
          setState({ ...state, step: TxStep.None })
        }).catch((e: any) => {
          afterTxFailed(e.message);
          navigation.goBack();
        })
        break;

      case TxStep.Approving:
        getElysiaContract()?.populateTransaction
          .approve(contractAddress, '1' + '0'.repeat(30))
          .then(populatedTransaction => {
            wallet?.getFirstSigner().sendTransaction({
              to: populatedTransaction.to,
              data: populatedTransaction.data,
            }).then((tx: any) => {
            setIsApproved(true);
              setState({ ...state, txHash: tx, step: TxStep.None })
            }).catch((e) => {
              afterTxFailed(e.message);
              navigation.goBack();
            })
          })
        break;
      case TxStep.Creating:
        createTx();
        break;
      case TxStep.Created:
        afterTxCreated(
          state.txHash,
          from.type === CryptoType.BNB ? NetworkType.BSC : NetworkType.ETH
        )
        navigation.goBack();
        break;
      default:
    }
  }, [state.step])

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
        })
    }
  }, [txResult.status]);

  if (state.stage === 0) {
    return (
      <TxInput
        purpose="purchase"
        title={t('assets.invest')}
        fromInputTitle={t('assets.invest_value')}
        toInputTitle={t('assets.invest_stake')}
        from={from}
        to={to}
        toMax={toMax}
        values={values}
        fromPrice={getCryptoPrice(from.type)}
        toPrice={getCryptoPrice(CryptoType.ELA)}
        current={current}
        step={state.step}
        setCurrent={setCurrent}
        setValues={setValues}
        disabled={parseInt(values.to || '0') < 1}
        estimateGas={state.estimateGas}
        isApproved={isApproved}
        createTx={() => {
          if (isWalletUser) {
            if (isApproved) {
              setState({ ...state, step: TxStep.Creating })
            } else {
              setState({ ...state, step: TxStep.Approving })
            }
          } else {
            Server.requestTransaction(route.params.productId, parseInt(values.to), 'buying')
              .then((res) => {
                setState({
                  ...state,
                  stage: 1,
                  espressoTxId: res.data.id,
                })
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
    <PaymentSelection espressTxId={state.espressoTxId} />
  )
};

export default Purchase;
