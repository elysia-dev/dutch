import React, { FunctionComponent, useContext, useState } from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { H1Text, P1Text } from '../../shared/components/Texts';
import PasswordDialPad from './components/PasswordDialPad';
import PasswordLayout from './components/PasswordLayout';
import { WalletPage } from '../../enums/pageEnum';

const NewPassword: FunctionComponent = () => {
  const navigation = useNavigation();

  return (
    <PasswordLayout>
      <View style={{ length: 200, marginTop: 100, marginBottom: 50 }}>
        <H1Text style={{ textAlign: 'center' }} label={'New Password'} />
        <P1Text style={{ textAlign: 'center' }} label={'It used for authentication'} />
      </View>
      <PasswordDialPad nextHandler={(password) => { navigation.navigate(WalletPage.ConfirmPassword, { password }) }} />
    </PasswordLayout>
  );
};

export default NewPassword;