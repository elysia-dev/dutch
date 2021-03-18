import React, {
  FunctionComponent, useContext, useEffect, useState,
} from 'react';
import { Linking, Text, View } from 'react-native';
import NumberPad from '../../shared/components/NumberPad';
import NextButton from '../../shared/components/NextButton';
import CryptoType from '../../enums/CryptoType';
import CryptoInput from './components/CryptoInput';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { H4Text, H3Text } from '../../shared/components/Texts';
import AppColors from '../../enums/AppColors';
import { TouchableOpacity } from 'react-native-gesture-handler';
import usePrices from '../../hooks/usePrice';
import CurrencyContext from '../../contexts/CurrencyContext';
import currencyFormatter from '../../utiles/currencyFormatter';
import { useAssetToken, useElysiaToken } from '../../hooks/useContract';
import { BigNumber } from '@ethersproject/bignumber';
import WalletContext from '../../contexts/WalletContext';
import TxStep from '../../enums/TxStep';
import { useWatingTx } from '../../hooks/useWatingTx';
import TxStatus from '../../enums/TxStatus';
import { utils } from 'ethers';
import { showMessage } from "react-native-flash-message";
import getEnvironment from '../../utiles/getEnvironment';
import OverlayLoading from '../../shared/components/OverlayLoading';

type ParamList = {
  Purchase: {
    fromCrypto: CryptoType,
    fromTitle: string,
    toTitle: string,
    toCrypto: CryptoType,
  };
};

interface Props {
  fromCrypto: CryptoType,
  fromTitle: string,
  toTitle: string,
  toCrypto: CryptoType,
}

const testContractAddress = '0xb09479b0ad2C939d59cB1Ea1C27C1b25F9B8A46E';
// TODO
// 1. when payment method is ETH
// 1. Check Maximu value
// 2. Modifiable toPrice
// 3. Gas price exceiptions
const Purchase: FunctionComponent<Props> = () => {
  const [values, setValues] = useState({
    from: '',
    to: ''
  })
  const [state, setState] = useState({
    txHash: '',
    step: TxStep.None,
  });
  const [current, setCurrent] = useState<'from' | 'to'>('from');
  const { currencyUnit, currencyRatio } = useContext(CurrencyContext);
  const { fromCrypto, fromTitle, toTitle, toCrypto } = useRoute<RouteProp<ParamList, 'Purchase'>>()?.params;
  const navigation = useNavigation();
  const toPrice = 5 // usd
  const { elPrice } = usePrices();
  const assetTokenContract = useAssetToken(testContractAddress);
  const elContract = useElysiaToken();
  const { wallet } = useContext(WalletContext);
  const txResult = useWatingTx(state.txHash);

  useEffect(() => {
    switch (state.step) {
      case TxStep.CheckAllowance:
        elContract?.allowance(
          wallet?.getFirstNode()?.address, testContractAddress
        ).then((res: BigNumber) => {
          if (res.isZero()) {
            setState({ ...state, step: TxStep.Approving })
          } else {
            setState({ ...state, step: TxStep.Creating })
          }
        }).catch((e: any) => {
          setState({ ...state, step: TxStep.Failed })
        })
        break;

      case TxStep.Approving:
        elContract?.populateTransaction
          .approve(testContractAddress, '1' + '0'.repeat(25))
          .then(populatedTransaction => {
            wallet?.getFirstSigner().sendTransaction({
              to: populatedTransaction.to,
              data: populatedTransaction.data,
            }).then((tx: any) => {
              alert(tx)
              setState({ txHash: tx, step: TxStep.Creating })
            }).catch((e) => {
              alert(e)
              setState({ ...state, step: TxStep.Failed })
            })
          })
        break;

      case TxStep.Creating:
        assetTokenContract?.populateTransaction.purchase(
          utils.parseEther(values.from)
        ).then(populatedTransaction => {
          wallet?.getFirstSigner().sendTransaction({
            to: populatedTransaction.to,
            data: populatedTransaction.data,
          }).then((tx) => {
            showMessage({
              message: `트랜잭션 생성 요청을 완료했습니다.`,
              description: tx.hash,
              type: 'info',
              onPress: () => {
                Linking.openURL(
                  getEnvironment().ethNetwork === 'main'
                    ? `https://etherscan.io/tx/${tx.hash}`
                    : `https://kovan.etherscan.io/tx/${tx.hash}`,
                )
              },
              duration: 3000
            });
            navigation.goBack();
          }).catch((e) => {
            alert(e)
            setState({ ...state, step: TxStep.Failed })
          })
        })
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

  return (
    <>
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
        <H3Text label={'구매하기'} style={{}} />
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
          title={'투자 금액'}
          cryptoTitle={fromTitle}
          cryptoType={fromCrypto}
          style={{ marginTop: 20 }}
          value={values.from || '0'}
          subValue={
            currencyFormatter(
              currencyUnit,
              currencyRatio,
              parseFloat(values.from || '0') * elPrice,
              2,
            )}
          active={current === 'from'}
          onPress={() => setCurrent('from')}
        />
        <Text style={{ textAlign: 'center', fontSize: 20, color: AppColors.MAIN, marginTop: 5, marginBottom: 5 }}>↓</Text>
        <CryptoInput
          title={'받는 지분'}
          cryptoTitle={toTitle}
          cryptoType={toCrypto}
          style={{ marginBottom: 30 }}
          value={values.to || '0'}
          active={current === 'to'}
          onPress={() => setCurrent('to')}
        />
        <View style={{ width: '100%', height: 1, marginTop: 0, marginBottom: 20, backgroundColor: AppColors.GREY }} />
        <NumberPad
          addValue={(text) => {
            const before = current === 'from' ? values.from : values.to
            if (text === '.' && before.includes('.') || before.length > 18) {
              return
            }

            const next = before + text

            if (current === 'from') {
              setValues({
                from: parseFloat(next).toString(),
                to: (parseFloat(next || '0') * elPrice / toPrice).toFixed(2),
              })
            } else {
              setValues({
                from: (parseFloat(next || '0') * toPrice / elPrice).toFixed(2),
                to: parseFloat(next).toString(),
              })
            }
          }}
          removeValue={() => {
            const before = current === 'from' ? values.from : values.to

            const next = before.slice(0, -1)

            if (current === 'from') {
              setValues({
                from: next,
                to: (parseFloat(next || '0') * elPrice / toPrice).toFixed(2),
              })
            } else {
              setValues({
                from: (parseFloat(next || '0') * toPrice / elPrice).toFixed(2),
                to: next,
              })
            }
          }}
        />
        <NextButton
          disabled={!(parseFloat(values.from) > 0)}
          title={'다음'}
          handler={() => {
            setState({
              txHash: '',
              step: TxStep.CheckAllowance,
            })
          }}
        />
      </View>
      <OverlayLoading visible={[TxStep.Approving, TxStep.CheckAllowance, TxStep.Creating].includes(state.step)} />
    </>
  );
};

export default Purchase;
