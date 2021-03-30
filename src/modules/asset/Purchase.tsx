import React, {
  FunctionComponent, useContext, useEffect, useState,
} from 'react';
import CryptoType from '../../enums/CryptoType';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { useAssetToken, useAssetTokenEth, useElysiaToken, useAssetTokenBnb } from '../../hooks/useContract';
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
  const assetTokenBnbContract = useAssetTokenBnb(contractAddress);
  const elContract = useElysiaToken();
  const { isWalletUser, Server } = useContext(UserContext);
  const { wallet } = useContext(WalletContext);
  const txResult = useWatingTx(state.txHash);
  const { elPrice, ethPrice, bnbPrice, gasPrice, bscGasPrice } = useContext(PriceContext);
  const { afterTxFailed, afterTxCreated } = useTxHandler();
  const { t } = useTranslation();

  const estimateGas = async () => {
    let estimateGas: BigNumber | undefined;

    try {
      switch (from.type) {
        case CryptoType.ETH:
          estimateGas = await assetTokenEthContract?.estimateGas.purchase({
            from: wallet?.getFirstAddress(),
            value: utils.parseEther('0.5').toHexString()
          })
          break;
        case CryptoType.BNB:
          estimateGas = await assetTokenBnbContract?.estimateGas.purchase({
            from: wallet?.getFirstAddress(),
            value: utils.parseEther('0.5').toHexString()
          })
          break;
        default:
          estimateGas = await assetTokenContract?.estimateGas.purchase(utils.parseEther('100'), {
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
      switch (from.type) {
        case CryptoType.ETH:
          populatedTransaction = await assetTokenEthContract?.populateTransaction.purchase();

          if (!populatedTransaction) break;

          txRes = await wallet?.getFirstSigner().sendTransaction({
            to: populatedTransaction.to,
            data: populatedTransaction.data,
            value: utils.parseEther(values.from).toHexString(),
          })
          break;
        case CryptoType.BNB:
          populatedTransaction = await assetTokenBnbContract?.populateTransaction.purchase();

          if (!populatedTransaction) break;

          txRes = await wallet?.getFirstSigner(NetworkType.BSC).sendTransaction({
            to: populatedTransaction.to,
            data: populatedTransaction.data,
            value: utils.parseEther(values.from).toHexString(),
          })

          break;
        default:
          populatedTransaction = await assetTokenContract?.populateTransaction.purchase(
            utils.parseEther(values.from)
          )

          if (!populatedTransaction) break;

          txRes = await wallet?.getFirstSigner().sendTransaction({
            to: populatedTransaction.to,
            data: populatedTransaction.data,
          })

          break;
      }

      afterTxCreated(
        wallet?.getFirstAddress() || '',
        contractAddress, txRes?.hash || '',
        from.type === CryptoType.BNB ? NetworkType.BSC : NetworkType.ETH
      )
    } catch (e) {
      afterTxFailed();
    } finally {
      navigation.goBack();
    }
  }

  useEffect(() => {
    switch (state.step) {
      case TxStep.CheckAllowance:
        if ([CryptoType.ETH, CryptoType.BNB].includes(from.type)) {
          setState({ ...state, step: TxStep.Creating })
          return
        }

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
        createTx();
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
        fromPrice={from.type === CryptoType.ETH ? ethPrice : from.type === CryptoType.BNB ? bnbPrice : elPrice}
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
