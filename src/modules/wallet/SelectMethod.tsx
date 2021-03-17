import React, { FunctionComponent } from 'react';
import WrapperLayout from '../../shared/components/WrapperLayout';
import { useNavigation } from '@react-navigation/native';
import { P3Text } from '../../shared/components/Texts';
import BasicLayout from '../../shared/components/BasicLayout';
import NextButton from '../../shared/components/NextButton';
import { WalletPage } from '../../enums/pageEnum';
import BorderButton from '../../shared/components/BorderButton';

const SelectMethod: FunctionComponent = () => {
  const navigation = useNavigation();

  return (
    <WrapperLayout
      isScrolling={false}
      backButtonHandler={() => navigation.goBack()}
      title={'혹시 기존에 사용하던\n지갑이 있으신가요?'}
      body={
        <BasicLayout>
          <P3Text label={'새로운 지갑을 만들거나 기존 지갑을 사용할 수 있습니다.'} style={{ marginTop: 10 }} />
        </BasicLayout>
      }
      button={
        <>
          <BorderButton
            style={{ marginLeft: '5%', marginRight: '5%' }}
            title={'기존 지갑 사용하기'}
            handler={() => {
              navigation.navigate(WalletPage.RecoverSeedPharase)
            }}
          />
          <NextButton
            style={{ marginTop: 10, marginLeft: '5%', marginRight: '5%' }}
            title={'새로운 지갑 생성하기'}
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