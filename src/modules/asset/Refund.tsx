import React, {
  FunctionComponent, useContext, useEffect, useState,
} from 'react';
import CryptoType from '../../enums/CryptoType';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { useAssetToken, useAssetTokenBnb } from '../../hooks/useContract';
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
  const [current, setCurrent] = useState<'from' | 'to'>('from');
  const route = useRoute<RouteProp<ParamList, 'Refund'>>();
  const { from, to, contractAddress } = route.params;
  const navigation = useNavigation();
  const assetTokenContract = useAssetToken(contractAddress);
  const assetTokenBnbContract = useAssetTokenBnb(contractAddress);
  const { wallet } = useContext(WalletContext);
  const { isWalletUser, Server } = useContext(UserContext);
  const { elPrice, ethPrice, bnbPrice, gasPrice, bscGasPrice } = useContext(PriceContext);
  const { afterTxFailed, afterTxCreated } = useTxHandler();
  const { t } = useTranslation();

  const estimateGas = async () => {
    let estimateGas: BigNumber | undefined;

    try {
      if (to.type === CryptoType.BNB) {
        estimateGas = await assetTokenBnbContract?.estimateGas.refund(utils.parseEther(values.to), {
          from: wallet?.getFirstAddress(),
        })
      } else {
        estimateGas = await assetTokenContract?.estimateGas.refund(utils.parseEther(values.to), {
          from: wallet?.getFirstAddress(),
        })
      }
    } catch {
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
  }, [values.to])

  const createTx = async () => {
    let txRes: ethers.providers.TransactionResponse | undefined;

    try {
      if (to.type === CryptoType.BNB) {
        const populatedTransaction = await assetTokenBnbContract?.populateTransaction.refund(
          utils.parseEther(values.from)
        )

        if (!populatedTransaction) return;

        txRes = await wallet?.getFirstSigner(NetworkType.BSC).sendTransaction({
          to: populatedTransaction.to,
          data: populatedTransaction.data,
        })
      } else {
        const populatedTransaction = await assetTokenContract?.populateTransaction.refund(
          utils.parseEther(values.from)
        )

        if (!populatedTransaction) return;

        txRes = await wallet?.getFirstSigner().sendTransaction({
          to: populatedTransaction.to,
          data: populatedTransaction.data,
        })
      }
    } catch (e) {
      alert(e)
    } finally {
      if (txRes) {
        afterTxCreated(wallet?.getFirstAddress() || '', contractAddress, txRes.hash, to.type === CryptoType.BNB ? NetworkType.BSC : NetworkType.ETH)
        navigation.goBack();
      } else {
        afterTxFailed();
      }
    }
  }

  useEffect(() => {
    switch (state.step) {
      case TxStep.Creating:
        createTx();
        break;
      default:
    }
  }, [state.step])


  if (state.stage === 0) {
    return (
      <TxInput
        title={t('assets.refund')}
        fromInputTitle={t('assets.refund_stake')}
        toInputTitle={t('assets.refund_value')}
        from={from}
        to={to}
        values={values}
        fromPrice={5} // 5 USD
        toPrice={to.type === CryptoType.ETH ? ethPrice : to.type === CryptoType.BNB ? bnbPrice : elPrice}
        current={current}
        step={state.step}
        disabled={parseInt(values.from || '0') < 0.01}
        setCurrent={setCurrent}
        setValues={setValues}
        estimateGas={state.estimateGas}
        createTx={() => {
          if (isWalletUser) {
            setState({ ...state, step: TxStep.Creating })
          } else {
            Server.requestTransaction(route.params.productId, parseInt(values.from), 'refund')
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
