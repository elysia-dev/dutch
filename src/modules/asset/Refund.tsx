import React, {
  FunctionComponent, useContext, useEffect, useState,
} from 'react';
import CryptoType from '../../enums/CryptoType';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { useAssetToken } from '../../hooks/useContract';
import WalletContext from '../../contexts/WalletContext';
import TxStep from '../../enums/TxStep';
import { utils } from 'ethers';
import TxInput from './components/TxInput';
import usePrices from '../../hooks/usePrice';
import useTxHandler from '../../hooks/useTxHandler';
import PaymentSelection from './components/PaymentSelection';
import UserContext from '../../contexts/UserContext';
import FunctionContext from '../../contexts/FunctionContext';
import i18n from '../../i18n/i18n';

type ParamList = {
  Refund: {
    fromCrypto: CryptoType,
    fromTitle: string,
    toTitle: string,
    toCrypto: CryptoType,
  };
};

// EL - EA
//const testContractAddress = '0xb09479b0ad2C939d59cB1Ea1C27C1b25F9B8A46E';
// EL - ETH
const testContractAddress = '0xFFBFF24cA3A03F1039f9AFc222A6F76105564b12'

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
  });
  const [current, setCurrent] = useState<'from' | 'to'>('from');
  const { fromCrypto, fromTitle, toTitle, toCrypto } = useRoute<RouteProp<ParamList, 'Refund'>>()?.params;
  const navigation = useNavigation();
  const assetTokenContract = useAssetToken(testContractAddress);
  const { wallet } = useContext(WalletContext);
  const { isWalletUser } = useContext(UserContext);
  const { Server } = useContext(FunctionContext);
  const { elPrice, ethPrice } = usePrices()
  const { afterTxFailed, afterTxCreated } = useTxHandler();

  useEffect(() => {
    switch (state.step) {
      case TxStep.Creating:
        assetTokenContract?.populateTransaction.refund(
          utils.parseEther(values.from)
        ).then(populatedTransaction => {
          wallet?.getFirstSigner().sendTransaction({
            to: populatedTransaction.to,
            data: populatedTransaction.data,
          }).then((tx) => {
            afterTxCreated(tx.hash)
            navigation.goBack();
          }).catch(() => {
            afterTxFailed();
            navigation.goBack();
          })
        })
        break;
      default:
    }
  }, [state.step])


  if (state.stage === 0) {
    return (
      <TxInput
        title={'환불하기'}
        fromInputTitle={'환불 지분'}
        toInputTitle={'받는 금액'}
        fromCrypto={fromCrypto}
        fromTitle={fromTitle}
        toCrypto={toCrypto}
        toTitle={toTitle}
        values={values}
        fromPrice={5} // 5 USD
        toPrice={toCrypto === CryptoType.ETH ? ethPrice : elPrice}
        current={current}
        step={state.step}
        setCurrent={setCurrent}
        setValues={setValues}
        createTx={() => {
          if (isWalletUser) {
            setState({ ...state, step: TxStep.Creating })
          } else {
            Server.requestTransaction(8, parseInt(values.from), 'refund')
              .then((res) => {
                setState({
                  ...state,
                  stage: 1,
                  espressoTxId: res.data.id,
                })
              })
              .catch((e) => {
                if (e.response.status === 400) {
                  alert(i18n.t('product.transaction_error'));
                } else if (e.response.status === 500) {
                  alert(i18n.t('account_errors.server'));
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
