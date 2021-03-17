import React, { FunctionComponent } from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import i18n from '../../i18n/i18n';
import { AccountPage } from '../../enums/pageEnum';
import { H3Text, P1Text } from '../../shared/components/Texts';

const ExpiredAccount: FunctionComponent<{ nextHandler?: () => void }> = ({
  nextHandler = () => { navigation.navigate(AccountPage.IntroduceElysia) },
}) => {
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
        onPress={() => nextHandler()}
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
