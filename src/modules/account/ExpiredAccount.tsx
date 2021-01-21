import React, { FunctionComponent, useContext, useState } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import i18n from '../../i18n/i18n';
import { AccountPage } from '../../enums/pageEnum';
import RootContext from '../../contexts/RootContext';
import AccountLayout from '../../shared/components/AccountLayout';
import { H1Text, H3Text, P1Text } from '../../shared/components/Texts';

const ExpiredAccount: FunctionComponent = () => {
  const navigation = useNavigation();
  return (
    <View style={{ width: '100%', height: '100%', backgroundColor: '#3679B5' }}>
      <Image
        style={{
          width: 120,
          height: 120,
          top: 150,
          marginLeft: 'auto',
          marginRight: 'auto',
          marginBottom: 50,
        }}
        source={require('./images/elysialogo.png')}></Image>
      <P1Text
        style={{
          position: 'relative',
          top: 100,
          color: '#fff',
          textAlign: 'center',
        }}
        label={i18n.t('account.expired_logout')}
      />
      <TouchableOpacity
        onPress={() => navigation.navigate(AccountPage.IntroduceElysia)}
        style={{
          position: 'absolute',
          bottom: '20%',
          alignSelf: 'center',
          backgroundColor: '#2C6190',
          width: 200,
          height: 50,
          justifyContent: 'center',
          alignContent: 'center',
          borderRadius: 5,
        }}>
        <H3Text
          style={{
            color: '#fff',
            fontSize: 16,
            textAlign: 'center',
          }}
          label={i18n.t('account.login_again')}
        />
      </TouchableOpacity>
    </View>
  );
};

export default ExpiredAccount;
