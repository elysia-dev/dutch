/* eslint-disable radix */
import React, { FunctionComponent } from 'react';
import { View, Share } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import QRCode from 'react-native-qrcode-svg';
import { useTranslation } from 'react-i18next';
import { P2Text } from '../../shared/components/Texts';
import AppColors from '../../enums/AppColors';
import SheetHeader from '../../shared/components/SheetHeader';
import NextButton from '../../shared/components/NextButton';
import useUserAddress from '../../hooks/useUserAddress';

interface Props {
  modalHandler: () => void;
}

const Deposit: FunctionComponent<Props> = () => {
  const address = useUserAddress();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  return (
    <>
      <SheetHeader title={t('main.my_address')} />
      <View
        style={{
          paddingLeft: 20,
          paddingRight: 20,
          height: '100%',
          backgroundColor: AppColors.WHITE,
        }}>
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 30,
          }}>
          <QRCode size={136} value={address} />
          <P2Text
            label={address}
            style={{ color: AppColors.BLACK, marginTop: 20 }}
          />
        </View>
      </View>
      <View
        style={{
          position: 'absolute',
          width: '100%',
          bottom: insets.bottom || 10,
          paddingLeft: '5%',
          paddingRight: '5%',
        }}>
        <NextButton
          title={t('main.copy_address')}
          handler={() => {
            if (address) {
              Share.share({
                message: address,
              });
            }
          }}
        />
      </View>
    </>
  );
};

export default Deposit;
