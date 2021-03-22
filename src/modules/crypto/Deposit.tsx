/* eslint-disable radix */
import React, {
  FunctionComponent, useContext,
} from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import { P2Text } from '../../shared/components/Texts';
import QRCode from 'react-native-qrcode-svg';
import AppColors from '../../enums/AppColors';
import Clipboard from 'expo-clipboard';
import WalletContext from '../../contexts/WalletContext';
import { useTranslation } from 'react-i18next';
import UserContext from '../../contexts/UserContext';
import SheetHeader from '../../shared/components/SheetHeader';

interface Props {
  modalHandler: () => void;
}

const Deposit: FunctionComponent<Props> = props => {
  const { isWalletUser, user } = useContext(UserContext);
  const { wallet } = useContext(WalletContext);
  const address = isWalletUser ? wallet?.getNodes()[0].address : user.ethAddresses[0];
  const { t } = useTranslation();

  return (
    <>
      <SheetHeader title={t('main.my_address')} />
      <View
        style={{
          paddingLeft: 20,
          paddingRight: 20,
          height: '100%',
          backgroundColor: '#fff',
        }}>
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
              source={require('./images/copyduplicate.png')}
            />
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

export default Deposit;
