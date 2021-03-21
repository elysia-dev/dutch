import React, { FunctionComponent } from 'react';
import WrapperLayout from '../../shared/components/WrapperLayout';
import { useNavigation } from '@react-navigation/native';
import { P3Text } from '../../shared/components/Texts';
import BasicLayout from '../../shared/components/BasicLayout';
import NextButton from '../../shared/components/NextButton';
import { WalletPage } from '../../enums/pageEnum';
import BorderButton from '../../shared/components/BorderButton';
import i18n from '../../i18n/i18n';

const SelectMethod: FunctionComponent = () => {
  const navigation = useNavigation();

  return (
    <WrapperLayout
      isScrolling={false}
      backButtonHandler={() => navigation.goBack()}
      title={i18n.t('recovery_key.wallet_select')}
      body={
        <BasicLayout>
          <P3Text label={i18n.t('recovery_key.wallet_select_content')} style={{ marginTop: 10 }} />
        </BasicLayout>
      }
      button={
        <>
          <BorderButton
            style={{ marginLeft: '5%', marginRight: '5%' }}
            title={i18n.t('recovery_key.existing_wallet')}
            handler={() => {
              navigation.navigate(WalletPage.RecoverSeedPharase)
            }}
          />
          <NextButton
            style={{ marginTop: 10, marginLeft: '5%', marginRight: '5%' }}
            title={i18n.t('recovery_key.create_wallet')}
            handler={() => {
              navigation.navigate(WalletPage.NewPassword)
            }}
          />
        </>
      }
    />
  );
};

export default SelectMethod;