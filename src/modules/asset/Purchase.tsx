import React, {
  FunctionComponent, useContext, useEffect, useState,
} from 'react';
import CryptoType from '../../enums/CryptoType';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { useAssetToken, useAssetTokenEth, useElysiaToken } from '../../hooks/useContract';
import { BigNumber } from '@ethersproject/bignumber';
import WalletContext from '../../contexts/WalletContext';
import TxStep from '../../enums/TxStep';
import { useWatingTx } from '../../hooks/useWatingTx';
import TxStatus from '../../enums/TxStatus';
import { utils } from 'ethers';
import TxInput from './components/TxInput';
import useTxHandler from '../../hooks/useTxHandler';
import UserContext from '../../contexts/UserContext';
import FunctionContext from '../../contexts/FunctionContext';
import { useTranslation } from 'react-i18next';
import PaymentSelection from './components/PaymentSelection';
import PriceContext from '../../contexts/PriceContext';
import Asset from '../../types/Asset';

type ParamList = {
  Purchase: {
    from: Asset,
    to: Asset,
    toMax: number,
    contractAddress: string,
    productId: number, // legacy
  };
};

// TODO
// 1. Check Maximu value gasFee & Price...
// 2. toPrice는 5달러 고정이 아닐 수 도 있다.
// 4. Tx 생성 에러 더 상세하게 적기
const Purchase: FunctionComponent = () => {
  const [values, setValues] = useState({
    from: '',
    to: ''
  })
  const [state, setState] = useState({
    txHash: '',
    step: TxStep.None,
    espressoTxId: '',
    stage: 0,
    estimateGas: '',
  });
  const [current, setCurrent] = useState<'from' | 'to'>('from');
  const route = useRoute<RouteProp<ParamList, 'Purchase'>>()
  const { from, to, toMax, contractAddress } = route.params;
  const navigation = useNavigation();
  const assetTokenContract = useAssetToken(contractAddress);
  const assetTokenEthContract = useAssetTokenEth(contractAddress);
  const elContract = useElysiaToken();
  const { isWalletUser } = useContext(UserContext);
  const { Server } = useContext(FunctionContext);
  const { wallet } = useContext(WalletContext);
  const txResult = useWatingTx(state.txHash);
  const { elPrice, ethPrice, gasPrice } = useContext(PriceContext);
  const { afterTxFailed, afterTxCreated } = useTxHandler();
  const { t } = useTranslation();

  useEffect(() => {
    if (isWalletUser) {
      if (from.type === CryptoType.ETH) {
        assetTokenEthContract?.estimateGas.purchase({
          from: wallet?.getFirstAddress(),
          value: utils.parseEther('0.5').toHexString()
        }).then((res) => {
          setState({
            ...state,
            estimateGas: utils.formatEther(res.mul(gasPrice)),
          })
        }).catch((e) => { })
      } else {
        assetTokenContract?.estimateGas.purchase(utils.parseEther('100'), {
          from: wallet?.getFirstNode()?.address
        }).then((res) => {
          setState({
            ...state,
            estimateGas: utils.formatEther(res.mul(gasPrice)),
          })
        }).catch((e) => {
        })
      }
    }
  }, [])

  useEffect(() => {
    switch (state.step) {
      case TxStep.CheckAllowance:
        elContract?.allowance(
          wallet?.getFirstNode()?.address, contractAddress
        ).then((res: BigNumber) => {
          if (res.isZero()) {
            setState({ ...state, step: TxStep.Approving })
          } else {
            setState({ ...state, step: TxStep.Creating })
          }
        }).catch(() => {
          afterTxFailed();
          navigation.goBack();
        })
        break;

      case TxStep.Approving:
        if (from.type === CryptoType.ETH) {
          setState({ ...state, step: TxStep.Creating })
          return
        }

        elContract?.populateTransaction
          .approve(contractAddress, '1' + '0'.repeat(30))
          .then(populatedTransaction => {
            wallet?.getFirstSigner().sendTransaction({
              to: populatedTransaction.to,
              data: populatedTransaction.data,
            }).then((tx: any) => {
              setState({ ...state, txHash: tx, step: TxStep.Creating })
            }).catch(() => {
              afterTxFailed();
              navigation.goBack();
            })
          })
        break;

      case TxStep.Creating:
        if (from.type === CryptoType.ETH) {
          assetTokenEthContract?.populateTransaction.purchase(
          ).then(populatedTransaction => {
            wallet?.getFirstSigner().sendTransaction({
              to: populatedTransaction.to,
              data: populatedTransaction.data,
              value: utils.parseEther(values.from).toHexString(),
            }).then((tx) => {
              afterTxCreated(wallet.getFirstAddress() || '', contractAddress, tx.hash)
              navigation.goBack();
            }).catch((e) => {
              afterTxFailed();
              navigation.goBack();
            })
          })
        } else {
          assetTokenContract?.populateTransaction.purchase(
            utils.parseEther(values.from)
          ).then(populatedTransaction => {
            wallet?.getFirstSigner().sendTransaction({
              to: populatedTransaction.to,
              data: populatedTransaction.data,
            }).then((tx) => {
              afterTxCreated(wallet.getFirstAddress() || '', contractAddress, tx.hash)
              navigation.goBack();
            }).catch((e) => {
              alert(e)
              afterTxFailed();
              navigation.goBack();
            })
          })
        }
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
    }
  }, [txResult.status]);

  if (state.stage === 0) {
    return (
      <TxInput
        title={t('assets.invest')}
        fromInputTitle={t('assets.invest_value')}
        toInputTitle={t('assets.invest_stake')}
        from={from}
        to={to}
        toMax={toMax}
        values={values}
        fromPrice={from.type === CryptoType.ETH ? ethPrice : elPrice}
        toPrice={5} // 5 USD
        current={current}
        step={state.step}
        setCurrent={setCurrent}
        setValues={setValues}
        disabled={parseInt(values.to || '0') < 1}
        estimateGas={state.estimateGas}
        createTx={() => {
          if (isWalletUser) {
            setState({ ...state, step: TxStep.CheckAllowance })
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
