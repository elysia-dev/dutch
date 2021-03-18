import React, {
  FunctionComponent, useState,
} from 'react';
import { View } from 'react-native';
import NumberPad from '../../shared/components/NumberPad';
import NextButton from '../../shared/components/NextButton';
import CryptoType from '../../enums/CryptoType';
import CryptoInput from './components/CryptoInput';

interface Props {
  fromCrypto: CryptoType,
  fromTitle: string,
  toTitle: string,
  toCrypto: CryptoType,
  nextHandler: (value: string) => void,
}

const Purchase: FunctionComponent<Props> = ({
  fromCrypto = CryptoType.EL,
  fromTitle = 'EL',
  toCrypto = CryptoType.ELA,
  toTitle = 'EA',
  nextHandler = () => { },
}) => {
  const ratio = 0.007;
  const [value, setValue] = useState('');
  const [current, setCurrent] = useState(0);

  return (
    <View
      style={{
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        paddingLeft: 20,
        paddingRight: 20,
        backgroundColor: '#fff',
        height: "100%",
      }}>
      <CryptoInput
        title={'투자금액'}
        cryptoTitle={fromTitle}
        cryptoType={fromCrypto}
        style={{ marginTop: 20 }}
        value={value}
        active={current === 0}
        onPress={() => setCurrent(0)}
      />
      <CryptoInput
        title={'받는 지분'}
        cryptoTitle={toTitle}
        cryptoType={toCrypto}
        style={{ marginTop: 20, marginBottom: 30 }}
        value={value}
        active={current === 1}
        onPress={() => setCurrent(1)}
      />
      <NumberPad
        addValue={(text) => {
          if (text === '.' && value.includes('.')) {
            return
          }
          setValue(value + text)
        }}
        removeValue={() => setValue(value.slice(0, -1))}
      />
      <NextButton title={'다음'} handler={() => { nextHandler(value) }} />
    </View>
  );
};

export default Purchase;
