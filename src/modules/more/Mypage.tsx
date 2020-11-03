import React, { FunctionComponent, useContext } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import { NavigationScreenProp, NavigationRoute } from 'react-navigation';
import { useNavigation } from '@react-navigation/native';
import { SubmitButton } from '../../shared/components/SubmitButton';
import i18n from '../../i18n/i18n';
import { KycStatus } from '../../enums/KycStatus';
import { BackButton } from '../../shared/components/BackButton';
import { AccountPage } from '../../enums/pageEnum';
import RootContext from '../../contexts/RootContext';
import {
  H1Text,
  H2Text,
  P1Text,
  TitleText,
} from '../../shared/components/Texts';
import WrapperLayout from '../../shared/components/WrapperLayout';

const InfoArrowImg = styled.Image`
  width: 5px;
  height: 8px;
  margin: 20px 20px;
`;

const MyPage: FunctionComponent = () => {
  const { user, signOut } = useContext(RootContext);
  const navigation = useNavigation();

  return (
    <WrapperLayout
      isScrolling={false}
      title={i18n.t('more_label.my_account')}
      backButtonHandler={() => navigation.goBack()}
      body={
        <>
        <View
        style={{
          paddingLeft: '5%',
          // paddingBottom: 20,
          borderBottomWidth: 5,
          borderBottomColor: '#F6F6F8',
        }}>
        <P1Text
          label={i18n.t('account_label.account_email')}
          style={{ color: '#a7a7a7', marginTop: 20, marginBottom: 5 }}
        />
        <P1Text label={user.email} style={{ fontSize: 15 }} />
        <View
          style={{
            height: 50,
            marginTop: 20,
          }}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('More', {
                screen: AccountPage.CurrentPassword,
              })
            }>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <P1Text
                label={i18n.t('more_label.reset_password')}
                style={{ lineHeight: 50, fontSize: 15 }}
              />
              <InfoArrowImg source={require('./images/next_gray.png')} />
            </View>
          </TouchableOpacity>
        </View>
      </View>
      {(user.kycStatus === KycStatus.SUCCESS ||
        user.ethAddresses?.length > 0) && (
        <View
          style={{
            padding: '5%',
            paddingTop: 30,
            borderBottomWidth: 5,
            borderBottomColor: '#F6F6F8',
          }}>
          <H2Text label={i18n.t('more_label.my_info')} />
          {user.kycStatus === KycStatus.SUCCESS && (
            <>
              <P1Text
                label={i18n.t('more_label.name')}
                style={{ color: '#a7a7a7', marginTop: 30, marginBottom: 5 }}
              />
              <P1Text
                label={`${user.firstName} ${
                  user.lastName !== null ? user.lastName : ''
                }`}
                style={{ fontSize: 15 }}
              />
              <P1Text
                label={i18n.t('more_label.gender')}
                style={{ color: '#a7a7a7', marginTop: 30, marginBottom: 5 }}
              />
              <P1Text label={user.gender} style={{ fontSize: 15 }} />
            </>
          )}
          {user.ethAddresses?.length > 0 && (
            <>
              <P1Text
                label={i18n.t('account_label.ethaddress')}
                style={{ color: '#a7a7a7', marginTop: 30, marginBottom: 5 }}
              />
              <P1Text
                label={`${user.ethAddresses[0]}`}
                style={{ fontSize: 15 }}
              />
            </>
          )}
        </View>
      )}
        </>
      }
    />
  );
};

export default MyPage;
