import React, { FunctionComponent } from 'react';
import { View } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { H1Text, P1Text } from '../../shared/components/Texts';
import PasswordLayout from './components/PasswordLayout';
import PasswordDialPad from './components/PasswordDialPad';
import { WalletPage } from '../../enums/pageEnum';
import { setPassword } from '../../asyncStorages/password';

type RouteParams = {
  ConfirmPassword: {
    password: string;
  };
};

const ConfirmPassword: FunctionComponent = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<RouteParams, WalletPage.ConfirmPassword>>();

  return (
    <PasswordLayout>
      <View style={{ length: 200, marginTop: 100, marginBottom: 50 }}>
        <H1Text style={{ textAlign: 'center' }} label={'Confirm Password'} />
        <P1Text style={{ textAlign: 'center' }} label={'It used for authentication'} />
      </View>
      <PasswordDialPad
        nextHandler={async (password) => {
          if (route.params.password === password) {
            await setPassword(password)
            navigation.navigate(WalletPage.SecureWalletNotice)
          } else {
            alert(false)
          }
        }}
      />
    </PasswordLayout>
  );
};

export default ConfirmPassword;