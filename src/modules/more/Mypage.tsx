import React, { FunctionComponent, useContext } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import { NavigationScreenProp, NavigationRoute } from 'react-navigation';
import { useNavigation } from '@react-navigation/native';
import { SubmitButton } from '../../shared/components/SubmitButton';
import i18n from '../../i18n/i18n';
import { KycStatus } from '../../enums/KycStatus';
import Api from '../../api/account';
import { BackButton } from '../../shared/components/BackButton';
import { AccountPage } from '../../enums/pageEnum';
import UserContext from '../../contexts/UserContext';
import { H1Text } from '../../shared/components/H1Text';
import { PText } from '../../shared/components/PText';

const MyPage: FunctionComponent = () => {
  const { user, signOut } = useContext(UserContext);
  const navigation = useNavigation();

  return (
    <SafeAreaView
      style={{
        width: '100%',
        backgroundColor: '#fff',
        paddingTop: 25,
        flex: 1,
      }}>
      <BackButton
        handler={() => {
          navigation.goBack();
        }}
        style={{ marginLeft: '5%' }}
      />
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingLeft: '5%',
          paddingRight: '5%',
          paddingBottom: 0,
          height: 50,
        }}>
        <H1Text label={i18n.t('more_label.my_account')} />
        <TouchableOpacity
          onPress={() => {
            signOut();
          }}
          style={{
            backgroundColor: '#E6ECF2',
            borderRadius: 5,
            width: 80,
            height: 25,
            justifyContent: 'center',
            alignContent: 'center',
          }}>
          <PText
            label={i18n.t('more_label.logout')}
            style={{ color: '#5c5b5b', textAlign: 'center' }}
          />
        </TouchableOpacity>
      </View>
      <View
        style={{
          paddingLeft: '5%',
          paddingBottom: 20,
          borderBottomWidth: 5,
          borderBottomColor: '#F6F6F8',
        }}>
        <PText
          label={i18n.t('account_label.account_email')}
          style={{ color: '#a7a7a7', marginTop: 15, marginBottom: 5 }}
        />
        <PText label={user.email} style={{ fontSize: 15 }} />
        <PText
          label={i18n.t('account_label.account_password')}
          style={{ color: '#a7a7a7', marginTop: 15, marginBottom: 5 }}
        />
        <TouchableOpacity
          onPress={() => {}}
          style={{
            backgroundColor: '#E6ECF2',
            borderRadius: 5,
            width: 120,
            height: 25,
            justifyContent: 'center',
            alignContent: 'center',
          }}>
          <PText
            label={'비밀번호 변경(임시)'}
            style={{ color: '#5c5b5b', textAlign: 'center' }}
          />
        </TouchableOpacity>
      </View>
      {user.kycStatus === KycStatus.SUCCESS && (
        <View
          style={{
            padding: '5%',
            borderBottomWidth: 5,
            borderBottomColor: '#F6F6F8',
          }}>
          <H1Text label={i18n.t('more_label.my_info')} />
          <PText
            label={i18n.t('more_label.name')}
            style={{ color: '#a7a7a7', marginTop: 15, marginBottom: 5 }}
          />
          <PText
            label={`${user.firstName} ${user.lastName}`}
            style={{ fontSize: 15 }}
          />
          <PText
            label={i18n.t('more_label.gender')}
            style={{ color: '#a7a7a7', marginTop: 15, marginBottom: 5 }}
          />
          <PText label={user.gender} style={{ fontSize: 15 }} />
        </View>
      )}
    </SafeAreaView>
  );
};

export default MyPage;
