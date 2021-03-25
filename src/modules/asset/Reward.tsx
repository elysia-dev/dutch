import React, {
  FunctionComponent, useContext, useEffect, useState,
} from 'react';
import CryptoType from '../../enums/CryptoType';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { useAssetToken } from '../../hooks/useContract';
import WalletContext from '../../contexts/WalletContext';
import TxStep from '../../enums/TxStep';
import useTxHandler from '../../hooks/useTxHandler';
import { View } from 'react-native';
import CryptoInput from './components/CryptoInput';
import NextButton from '../../shared/components/NextButton';
import { BigNumber } from '@ethersproject/bignumber';
import { utils } from 'ethers';
import OverlayLoading from '../../shared/components/OverlayLoading';
import PaymentSelection from './components/PaymentSelection';
import UserContext from '../../contexts/UserContext';
import { useTranslation } from 'react-i18next';
import PreferenceContext from '../../contexts/PreferenceContext';
import SheetHeader from '../../shared/components/SheetHeader';
import PriceContext from '../../contexts/PriceContext';
import { P3Text } from '../../shared/components/Texts';

type ParamList = {
  Reward: {
    toCrypto: CryptoType,
    toTitle: string,
    productId: number,
    contractAddress: string,
  };
};

const Reward: FunctionComponent = () => {
  const [step, setStep] = useState(TxStep.None);
  const [interest, setInterest] = useState(0);
  const route = useRoute<RouteProp<ParamList, 'Reward'>>()
  const { toCrypto, toTitle, contractAddress } = route.params;
  const navigation = useNavigation();
  const assetTokenContract = useAssetToken(contractAddress);
  const { wallet } = useContext(WalletContext);
  const { currencyFormatter } = useContext(PreferenceContext)
  const { isWalletUser, user, Server } = useContext(UserContext);
  const { elPrice, ethPrice, gasPrice } = useContext(PriceContext);
  const [state, setState] = useState({
    espressoTxId: '',
    stage: 0,
    estimateGas: '',
  });
  const { t } = useTranslation()

  const { afterTxFailed, afterTxCreated } = useTxHandler();

  useEffect(() => {
    if (isWalletUser) {
      assetTokenContract?.estimateGas.claimReward({
        from: wallet?.getFirstNode()?.address
      }).then((res) => {
        setState({
          ...state,
          estimateGas: utils.formatEther(res.mul(gasPrice)),
        })
      }).catch(() => {
      })
    }
  }, [])

  useEffect(() => {
    const address = isWalletUser ? wallet?.getFirstNode()?.address : user.ethAddresses[0]
    assetTokenContract?.getReward(address).then((res: BigNumber) => {
      setInterest(parseFloat(utils.formatEther(res)));
    });
  }, [])

  useEffect(() => {
    switch (step) {
      case TxStep.Creating:
        assetTokenContract?.populateTransaction.claimReward(
        ).then(populatedTransaction => {
          wallet?.getFirstSigner().sendTransaction({
            to: populatedTransaction.to,
            data: populatedTransaction.data,
          }).then((tx) => {
            afterTxCreated(wallet.getFirstAddress() || '', contractAddress, tx.hash)
            navigation.goBack();
          }).catch(() => {
            afterTxFailed();
            navigation.goBack();
          })
        })
        break;
      default:
    }
  }, [step])


  if (state.stage === 0) {
    return (
      <View style={{}}>
        <SheetHeader title={t('assets.yield_reward')} />
        <View
          style={{
            paddingLeft: 20,
            paddingRight: 20,
            backgroundColor: '#fff',
            height: '100%',
          }}>
          <CryptoInput
            title={t('assets.yield')}
            cryptoTitle={toTitle}
            cryptoType={toCrypto}
            style={{ marginTop: 20 }}
            value={(interest / (toCrypto === CryptoType.ETH ? ethPrice : elPrice)).toFixed(4)}
            subValue={currencyFormatter(
              interest,
              4
            )}
            active={true}
            onPress={() => { }}
          />
          {!!state.estimateGas && <P3Text
            label={`Transaction Fee: ${state.estimateGas} ETH (${currencyFormatter(parseFloat(state.estimateGas) * ethPrice)})`}
            style={{ textAlign: 'center', marginTop: 10 }}
          />}
          <View style={{ position: 'absolute', width: '100%', bottom: 150, marginLeft: '6%' }}>
            <NextButton
              disabled={!(interest > 0)}
              title={t('assets.yield_reward')}
              handler={() => {
                if (isWalletUser) {
                  setStep(TxStep.Creating)
                } else {
                  Server.requestTransaction(8, 1, 'interest')
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
          </View>
          <OverlayLoading visible={step === TxStep.Creating} />
        </View>
      </View>
    );
  }

  return (
    <PaymentSelection espressTxId={state.espressoTxId} />
  )
};

export default Reward;
