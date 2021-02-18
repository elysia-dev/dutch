import React, { FunctionComponent, useContext } from 'react';
import { View, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import { useNavigation } from '@react-navigation/native';
import i18n from '../../i18n/i18n';
import { KycStatus } from '../../enums/KycStatus';
import { AccountPage, MorePage } from '../../enums/pageEnum';
import { H3Text, P1Text, P3Text } from '../../shared/components/Texts';
import WrapperLayout from '../../shared/components/WrapperLayout';
import UserContext from '../../contexts/UserContext';
import FunctionContext from '../../contexts/FunctionContext';

const InfoArrowImg = styled.Image`
  width: 5px;
  height: 8px;
  margin: 20px 20px;
`;

const MyPage: FunctionComponent = () => {
  const { user } = useContext(UserContext);
  const { signOut } = useContext(FunctionContext);

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

          <View
            style={{
              paddingLeft: '5%',
              paddingVertical: 10,
              borderBottomWidth: 5,
              borderBottomColor: '#F6F6F8',
            }}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate(MorePage.MembershipWithdrawl);
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <View
                  style={{
                    paddingVertical: 10,
                    flexDirection: 'column',
                  }}>
                  <H3Text
                    label={i18n.t('more_label.leave_elysia')}
                    style={{ fontSize: 15, lineHeight: 25, color: '#CC3743' }}
                  />
                  <P3Text
                    label={i18n.t('more.delete_info')}
                    style={{ color: '#a7a7a7' }}
                  />
                </View>
                <InfoArrowImg
                  source={require('./images/next_gray.png')}
                  style={{ alignSelf: 'center' }}
                />
              </View>
            </TouchableOpacity>
          </View>
        </>
      }
    />
  );
};

export default MyPage;
