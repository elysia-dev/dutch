/* eslint-disable radix */
import React, {
  FunctionComponent, useContext,
} from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import { H3Text, P2Text } from '../../../shared/components/Texts';
import QRCode from 'react-native-qrcode-svg';
import AppColors from '../../../enums/AppColors';
import Clipboard from 'expo-clipboard';
import { showMessage } from "react-native-flash-message";
import WalletContext from '../../../contexts/WalletContext';

interface Props {
  modalHandler: () => void;
}

const Deposit: FunctionComponent<Props> = props => {
  const { wallet } = useContext(WalletContext);
  const address = wallet?.getRoot().address || '';

  return (
    <View
      style={{
        position: 'absolute',
        bottom: 0,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        paddingLeft: 20,
        paddingRight: 20,
        height: 370,
        width: '100%',
        backgroundColor: '#fff',
      }}>
      <TouchableOpacity
        style={{
          marginTop: 10,
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
      <H3Text label={'내 입금 주소'} style={{ marginTop: 20 }} />
      <View style={{
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 30
      }}>
        <QRCode
          size={136}
          value={address}
        />
        <TouchableOpacity
          style={{
            marginTop: 25,
            backgroundColor: AppColors.MAIN,
            height: 70,
            flexDirection: 'row',
            alignItems: 'center',
            borderRadius: 5,
            paddingLeft: 20,
            paddingRight: 20,
          }}
          onPress={() => {
            Clipboard.setString(address);
            showMessage({
              message: "성공적으로 복사했습니다.",
            });
          }}
        >
          <P2Text label={address} style={{ color: 'white', flex: 1 }} />
          <View style={{ marginLeft: 10, width: 1, height: 40, backgroundColor: 'white' }} />
          <Image
            style={{
              marginLeft: 10,
              width: 20,
              height: 20,
            }}
            source={require('../images/copyduplicate.png')}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Deposit;
