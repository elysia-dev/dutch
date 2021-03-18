import React, {
  FunctionComponent, useContext, useState,
} from 'react';
import { Text, View } from 'react-native';
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

// TODO
// 1. Check Maximu value
// 2. Modifiable toPrice
const Purchase: FunctionComponent<Props> = () => {
  const [values, setValues] = useState({
    from: '',
    to: ''
  })
  const [current, setCurrent] = useState<'from' | 'to'>('from');
  const { currencyUnit, currencyRatio } = useContext(CurrencyContext);
  const { fromCrypto, fromTitle, toTitle, toCrypto } = useRoute<RouteProp<ParamList, 'Purchase'>>()?.params;
  const navigation = useNavigation();
  const toPrice = 5 // usd
  const { elPrice } = usePrices();

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
          title={'투자금액'}
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
          handler={() => { navigation.goBack() }}
        />
      </View>
    </>
  );
};

export default Purchase;
