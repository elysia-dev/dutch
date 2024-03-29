import React, { FunctionComponent, useContext } from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { AccountPage, MorePage } from '../../enums/pageEnum';
import { H3Text, P1Text, P3Text } from '../../shared/components/Texts';
import WrapperLayout from '../../shared/components/WrapperLayout';
import UserContext from '../../contexts/UserContext';
import AppColors from '../../enums/AppColors';

const MyPage: FunctionComponent = () => {
  const { user } = useContext(UserContext);
  const { t } = useTranslation();

  const navigation = useNavigation();

  return (
    <WrapperLayout
      isScrolling={false}
      title={t('more_label.my_account')}
      backButtonHandler={() => navigation.goBack()}
      body={
        <>
          <View
            style={{
              paddingLeft: '5%',
              // paddingBottom: 20,
              borderBottomWidth: 5,
              borderBottomColor: AppColors.BACKGROUND_GREY,
            }}>
            <P1Text
              label={t('account_label.account_email')}
              style={{
                color: AppColors.TEXT_GREY,
                marginTop: 20,
                marginBottom: 5,
              }}
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
                    label={t('more_label.reset_password')}
                    style={{ lineHeight: 50, fontSize: 15 }}
                  />
                  <Image
                    source={require('./images/next_gray.png')}
                    style={{
                      width: 5,
                      height: 8,
                      margin: 20,
                    }}
                  />
                </View>
              </TouchableOpacity>
            </View>
          </View>

          <View
            style={{
              paddingLeft: '5%',
              paddingVertical: 10,
              borderBottomWidth: 5,
              borderBottomColor: AppColors.BACKGROUND_GREY,
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
                    label={t('more_label.leave_elysia')}
                    style={{
                      fontSize: 15,
                      lineHeight: 25,
                      color: AppColors.CRITICAL_RED,
                    }}
                  />
                  <P3Text
                    label={t('more.delete_info')}
                    style={{ color: AppColors.TEXT_GREY }}
                  />
                </View>
                <Image
                  source={require('./images/next_gray.png')}
                  style={{
                    alignSelf: 'center',
                    width: 5,
                    height: 8,
                    margin: 20,
                  }}
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
