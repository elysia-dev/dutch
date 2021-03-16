/* eslint-disable radix */
import React, {
  FunctionComponent,
} from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import NextButton from '../../../shared/components/NextButton';
import { H3Text } from '../../../shared/components/Texts';

interface Props {
  modalHandler: () => void;
  submitHandler: () => void;
}

const Withdrawal: FunctionComponent<Props> = props => {
  return (
    <View
      style={{
        position: 'absolute',
        bottom: 0,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        paddingLeft: 20,
        paddingRight: 20,
        height: 280,
        width: '100%',
        backgroundColor: '#fff',
        justifyContent: 'center',
      }}>
      <TouchableOpacity
        style={{
          position: 'relative',
          top: -10,
          width: '100%',
        }}
        onPress={props.modalHandler}>
        <Image
          source={require('../images/bluedownarrow.png')}
          style={{
            width: 30,
            height: 30,
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        />
      </TouchableOpacity>
      <H3Text label={'출금하기'} />
      <NextButton
        title={'출금하기'}
        style={{
          width: '100%',
          marginTop: 20,
        }}
        handler={props.submitHandler}
      />
    </View>
  );
};

export default Withdrawal;
