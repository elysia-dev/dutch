/* eslint-disable radix */
import React, {
  FunctionComponent,
} from 'react';
import { View, Image, Text, TouchableOpacity } from 'react-native';
import i18n from '../../i18n/i18n';
import { SubmitButton } from '../../shared/components/SubmitButton';
import { P1Text } from '../../shared/components/Texts';

interface Props {
  modalHandler: () => void;
  submitHandler: () => void;
}

const LegacyOwnershipRefund: FunctionComponent<Props> = props => {
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
          source={require('./images/bluedownarrow.png')}
          style={{
            width: 30,
            height: 30,
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        />
      </TouchableOpacity>
      <View
        style={{
          flexDirection: 'column',
          alignContent: 'space-between',
          position: 'relative',
          width: '100%',
          backgroundColor: '#F6F6F8',
          borderWidth: 2,
          borderColor: '#F1F1F1',
          borderRadius: 10,
          padding: 15,
          marginTop: 30,
        }}
      >
        <P1Text 
          label={i18n.t('legacy.refund_notice')}
        />
      </View>
      <SubmitButton
        style={{
          position: 'relative',
          bottom: 0,
          marginBottom: 10,
          width: '100%',
          marginLeft: 'auto',
          marginRight: 'auto',
          marginTop: 20,
        }}
        handler={props.submitHandler}
        title={i18n.t('product_label.legacy_refund')}
      />
    </View>
  );
};

export default LegacyOwnershipRefund;
