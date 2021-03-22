import React, {
  FunctionComponent, useContext, useEffect, useState,
} from 'react';
import CryptoType from '../../enums/CryptoType';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { useAssetToken } from '../../hooks/useContract';
import WalletContext from '../../contexts/WalletContext';
import TxStep from '../../enums/TxStep';
import usePrices from '../../hooks/usePrice';
import useTxHandler from '../../hooks/useTxHandler';
import { View } from 'react-native';
import AppColors from '../../enums/AppColors';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { H3Text, H4Text } from '../../shared/components/Texts';
import CryptoInput from './components/CryptoInput';
import NextButton from '../../shared/components/NextButton';
import { BigNumber } from '@ethersproject/bignumber';
import { utils } from 'ethers';
import currencyFormatter from '../../utiles/currencyFormatter';
import CurrencyContext from '../../contexts/CurrencyContext';
import OverlayLoading from '../../shared/components/OverlayLoading';
import PaymentSelection from './components/PaymentSelection';
import UserContext from '../../contexts/UserContext';
import FunctionContext from '../../contexts/FunctionContext';
import { useTranslation } from 'react-i18next';

type ParamList = {
  Reward: {
    toCrypto: CryptoType,
    toTitle: string,
    productId: number,
    contractAaddress: string,
  };
};

const Reward: FunctionComponent = () => {
  const [step, setStep] = useState(TxStep.None);
  const [interest, setInterest] = useState(0);
  const route = useRoute<RouteProp<ParamList, 'Reward'>>()
  const { toCrypto, toTitle, contractAaddress } = route.params;
  const navigation = useNavigation();
  const assetTokenContract = useAssetToken(contractAaddress);
  const { wallet } = useContext(WalletContext);
  const { currencyUnit, currencyRatio } = useContext(CurrencyContext);
  const { isWalletUser, user } = useContext(UserContext);
  const { Server } = useContext(FunctionContext);
  const { elPrice, ethPrice } = usePrices()
  const [state, setState] = useState({
    espressoTxId: '',
    stage: 0,
  });
  const { t } = useTranslation()

  const { afterTxFailed, afterTxCreated } = useTxHandler();

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
  }, [step])


  if (state.stage === 0) {
    return (
      <View style={{}}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            backgroundColor: AppColors.BACKGROUND_GREY,
            padding: 20,
          }}
        >
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <H4Text label={'취소'} style={{ color: AppColors.MAIN }} />
          </TouchableOpacity>
          <H3Text label={'이자 분배'} style={{}} />
          <View style={{ width: 20 }} />
        </View>
        <View
          style={{
            paddingLeft: 20,
            paddingRight: 20,
            backgroundColor: '#fff',
            height: '100%',
          }}>
          <CryptoInput
            title={'이자'}
            cryptoTitle={toTitle}
            cryptoType={toCrypto}
            style={{ marginTop: 20 }}
            value={(interest / (toCrypto === CryptoType.ETH ? ethPrice : elPrice)).toFixed(4)}
            subValue={currencyFormatter(
              currencyUnit,
              currencyRatio,
              interest,
              4
            )}
            active={true}
            onPress={() => { }}
          />
          <View style={{ position: 'absolute', width: '100%', bottom: 150, marginLeft: '6%' }}>
            <NextButton
              disabled={!(interest > 0)}
              title={'이자 분배'}
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
