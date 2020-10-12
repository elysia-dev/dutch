/* eslint-disable radix */
import React, {
  Component,
  useState,
  useContext,
  FunctionComponent,
  useEffect,
} from 'react';
import { View, Image, Text } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import i18n from '../../i18n/i18n';
import { Calculator } from '../products/components/Calculator';
import { SubmitButton } from '../../shared/components/SubmitButton';
import ExchangedValue from '../products/components/ExchangedValue';

interface Props {
  return: string;
  modalHandler: () => void;
}


const OwnershipRefund: FunctionComponent<Props> = props => {
  const [tokenCount, setTokenCount] = useState(10);

  return (
    <View
      style={{
        position: 'absolute',
        bottom: 0,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        paddingLeft: 20,
        paddingRight: 20,
        height: '70%',
        width: '100%',
        backgroundColor: '#fff',
        justifyContent: 'center',
      }}>
      <TouchableOpacity
        style={{
          position: 'relative',
          top: 0,
          width: '100%',
        }}
        onPress={props.modalHandler}>
        <Image
          source={require('./images/bluedownarrow.png')}
          style={{
            width: 30,
            height: 30,
            marginLeft: 'auto',
            marginRight: 'auto',
            resizeMode: 'center',
          }}
        />
      </TouchableOpacity>
      <Calculator
        type={'refund'}
        countHandler={(token: number) => {
          setTokenCount(token);
        }}
        tokenCount={tokenCount}
        return={props.return}
      />
      <ExchangedValue
        return={props.return}
        tokenCount={tokenCount}
        type={'refund'}
      />
      <SubmitButton
        style={{
          position: 'relative',
          bottom: 0,
          marginBottom: 10,
          width: '100%',
          marginLeft: 'auto',
          marginRight: 'auto',
          marginTop: 10,
        }}
        handler={() => {}}
        title={i18n.t('product_label.refund')}
      />
    </View>
  );
};

export default OwnershipRefund;
