import React, {
  FunctionComponent, useContext, useEffect, useState,
} from 'react';
import CryptoType from '../../enums/CryptoType';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import WalletContext from '../../contexts/WalletContext';
import TxStep from '../../enums/TxStep';
import { BigNumber, ethers, utils } from 'ethers';
import TxInput from './components/TxInput';
import useTxHandler from '../../hooks/useTxHandler';
import PaymentSelection from './components/PaymentSelection';
import UserContext from '../../contexts/UserContext';
import { useTranslation } from 'react-i18next';
import PriceContext from '../../contexts/PriceContext';
import Asset from '../../types/Asset';
import NetworkType from '../../enums/NetworkType';
import { getAssetTokenFromCryptoType } from '../../utiles/getContract';
import { useWatingTx } from '../../hooks/useWatingTx';
import TxStatus from '../../enums/TxStatus';

type ParamList = {
  Refund: {
    from: Asset,
    to: Asset,
    productId: number,
    contractAddress: string,
  };
};

const Refund: FunctionComponent = () => {
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
  const [current, setCurrent] = useState<'from' | 'to'>('to');
  const route = useRoute<RouteProp<ParamList, 'Refund'>>();
  const { from, to, contractAddress } = route.params;
  const navigation = useNavigation();
  const { wallet } = useContext(WalletContext);
  const { isWalletUser, Server } = useContext(UserContext);
  const { gasPrice, bscGasPrice, getCryptoPrice } = useContext(PriceContext);
  const { afterTxFailed, afterTxHashCreated, afterTxCreated } = useTxHandler();
  const { t } = useTranslation();
  const contract = getAssetTokenFromCryptoType(to.type, contractAddress);
  const txResult = useWatingTx(state.txHash, to.type === CryptoType.BNB ? NetworkType.BSC : NetworkType.ETH);
  const ether = String(parseFloat(values.from) / getCryptoPrice(from.type))

  const estimateGas = async () => {
    let estimateGas: BigNumber | undefined;

    try {
      estimateGas = await contract?.estimateGas.refund(utils.parseEther('0.01'), {
        from: wallet?.getFirstAddress(),
      })
    } catch {
    } finally {
      if (estimateGas) {
        setState({
          ...state,
          estimateGas: utils.formatEther(estimateGas.mul(to.type === CryptoType.ETH ? gasPrice : bscGasPrice)),
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
    let txRes: ethers.providers.TransactionResponse | undefined;

    try {
      const populatedTransaction = await contract?.populateTransaction.refund(
        utils.parseEther(ether)
      )

      if (!populatedTransaction) return;

      txRes = await wallet?.getFirstSigner(to.type).sendTransaction({
        to: populatedTransaction.to,
        data: populatedTransaction.data,
      })

      if (to.type === CryptoType.BNB) {
        setState({
          ...state,
          txHash: txRes?.hash || '',
        })
      }
    } catch (e) {
      afterTxFailed(e);
      navigation.goBack();
    } finally {
      if (to.type !== CryptoType.BNB && txRes) {
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
      case TxStep.Creating:
        createTx();
        break;
      case TxStep.Created:
        afterTxCreated(
          state.txHash,
          to.type === CryptoType.BNB ? NetworkType.BSC : NetworkType.ETH
        )
        navigation.goBack();
        break;
      default:
    }
  }, [state.step])

  useEffect(() => {
    if (![TxStatus.Success, TxStatus.Fail].includes(txResult.status)) return;

    switch (state.step) {
      case TxStep.Creating:
        setState({
          ...state,
          step:
            txResult.status === TxStatus.Success
              ? TxStep.Created
              : TxStep.Failed,
        })
        break;
      default:
    }
  }, [txResult.status]);

  if (state.stage === 0) {
    return (
      <TxInput
        purpose="refund"
        title={t('assets.refund')}
        fromInputTitle={t('assets.refund_value')}
        toInputTitle={t('assets.refund_stake')}
        from={from}
        to={to}
        values={values}
        fromPrice={getCryptoPrice(from.type)}
        toPrice={getCryptoPrice(CryptoType.ELA)}
        current={current}
        step={state.step}
        disabled={parseInt(values.from || '0') < 0.01}
        setCurrent={setCurrent}
        setValues={setValues}
        estimateGas={state.estimateGas}
        isApproved={true}
        createTx={() => {
          if (isWalletUser) {
            setState({ ...state, step: TxStep.Creating })
          } else {
            Server.requestTransaction(route.params.productId, parseInt(ether), 'refund')
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

export default Refund;
