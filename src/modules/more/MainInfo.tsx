import React, { FunctionComponent, useContext } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Platform,
  Picker,
  StyleSheet,
  Text,
} from 'react-native';
import styled from 'styled-components/native';
import { useNavigation } from '@react-navigation/native';
import RNPickerSelect, { Item } from 'react-native-picker-select';
import AsyncStorage from '@react-native-community/async-storage';

import { SubmitButton } from '../../shared/components/SubmitButton';
import i18n from '../../i18n/i18n';
import { KycStatus } from '../../enums/KycStatus';
import { MorePage } from '../../enums/pageEnum';
import UserContext from '../../contexts/UserContext';
import ExchangeBithumbPng from './images/bithumb_logo.png';
import ExchangebobooPng from './images/boboo_logo.png';
import LocaleType from '../../enums/LocaleType';

const ExchangeBithumbImg = styled.Image`
  width: 40%;
  flex: 1;
  height: 60px;
  resize-mode: center;
`;
const ExchangeBobooImg = styled.Image`
  width: 40%;
  flex: 1;
  height: 60px;
  resize-mode: center;
  top: 3px;
`;
const MainInfoWrapper = styled.SafeAreaView`
  padding-top: ${Platform.OS === 'android' ? '25px' : '0px'};
  background-color: #ffffff;
`;
const InfoHeaderWrapper = styled.View`
  width: 100%;
  height: 10%;
  flex-direction: row;
  border-bottom-color: #f6f6f8;
  border-bottom-width: 5px;
  margin-bottom: 30px;
`;
const InfoHeaderH1Text = styled.Text`
  color: #1c1c1c;
  font-size: 20px;
  font-weight: bold;
  line-height: 21px;
  height: 21px;
  text-align: left;
  margin: 50px 5% 0px 5%;
`;
const InfoHeaderSettingImg = styled.Image`
  width: 21px;
  height: 21px;
  margin: 50px 5% 5px 5%;
`;
const InfoHeaderUserImg = styled.Image`
  width: 20px;
  height: 20px;
`;
const InfoHeaderUserName = styled.Text`
  font-size: 14px;
  color: #838383;
  margin: 0 5%;
  height: 20px;
  line-height: 25px;
  flex: 1;
`;
const InfoUserWrapper = styled.View`
  flex: 1;
  height: 28px;
`;
const H1Text = styled.Text`
  color: #1c1c1c;
  font-weight: bold;
  text-align: left;
  margin-left: 20px;
  font-size: 18px;
  margin-top: 20px;
  margin-bottom: 25px;
`;
const PText = styled.Text`
  color: #5c5b5b;
  margin-bottom: 12px;
  font-size: 15px;
  line-height: 50px;
`;
const InfoArrowImg = styled.Image`
  width: 5px;
  height: 8px;
  margin: 20px 20px;
  resize-mode: center;
`;
const InfoButtonTabWrapper = styled.View`
  height: 50px;
  margin-right: 20px;
  margin-left: 20px;
  margin-bottom: 15px;
`;
const InfoButtonInnerWrapper = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

const MainInfo: FunctionComponent = () => {
  const { user } = useContext(UserContext);
  const navigation = useNavigation();

  return (
    <MainInfoWrapper>
      <ScrollView>
        <InfoHeaderWrapper>
          <InfoUserWrapper>
            <InfoHeaderH1Text>{user.email}</InfoHeaderH1Text>
            <Text
              style={{
                marginLeft: '5%',
                height: 50,
                lineHeight: 20,
                textAlign: 'justify',
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'stretch',
                alignContent: 'stretch',
              }}>
              <InfoHeaderUserImg
                source={require('../kyc/images/userIcon.png')}
              />
              {user.kycStatus !== KycStatus.SUCCESS ? (
                <InfoHeaderUserName>
                  {i18n.t('more_label.need_kyc_label')}
                </InfoHeaderUserName>
              ) : (
                <InfoHeaderUserName>
                  {user.firstName} {user.lastName}
                </InfoHeaderUserName>
              )}
            </Text>
          </InfoUserWrapper>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('More', { screen: MorePage.MyPage });
            }}>
            <InfoHeaderSettingImg source={require('./images/setting.png')} />
          </TouchableOpacity>
        </InfoHeaderWrapper>
        <View
          style={{
            marginTop: 10,
            marginLeft: 20,
            marginRight: 20,
            display: 'flex',
            flexDirection: 'row',
          }}></View>
        <View
          style={{
            borderBottomColor: '#F6F6F8',
            borderBottomWidth: 5,
            height: 86,
          }}>
          {user.kycStatus === KycStatus.NONE && (
            <SubmitButton
              style={{
                shadowOffset: { width: 2, height: 1 },
                shadowColor: '#00000064',
                shadowOpacity: 0.8,
                shadowRadius: 6,
              }}
              title={i18n.t('more_label.need_kyc')}
              handler={() => navigation.navigate('Kyc')}
            />
          )}
          {user.kycStatus === KycStatus.PENDING && (
            <SubmitButton
              style={{
                shadowOffset: { width: 2, height: 1 },
                shadowColor: '#00000064',
                shadowOpacity: 0.8,
                shadowRadius: 6,
              }}
              title={i18n.t('more_label.proceed_kyc')}
              handler={() => {
                alert(i18n.t('more.kyc_proceeding_wait'));
              }}
              ButtonTheme={'GrayTheme'}
            />
          )}
          {user.kycStatus === KycStatus.SUCCESS && (
            <SubmitButton
              style={{
                shadowOffset: { width: 2, height: 1 },
                shadowColor: '#00000064',
                shadowOpacity: 0.8,
                shadowRadius: 6,
              }}
              title={i18n.t('more_label.approved_kyc')}
              handler={() => {}}
              ButtonTheme={'GrayTheme'}
            />
          )}
        </View>
        <View
          style={{
            borderBottomColor: '#F6F6F8',
            borderBottomWidth: 5,
          }}>
          <H1Text>{i18n.t('more_label.confirm')}</H1Text>
          <InfoButtonTabWrapper>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('More', {
                  screen: MorePage.OwnershipHistory,
                })
              }>
              <InfoButtonInnerWrapper>
                <PText>{i18n.t('more_label.investment_history')}</PText>
                <InfoArrowImg source={require('./images/next_gray.png')} />
              </InfoButtonInnerWrapper>
            </TouchableOpacity>
          </InfoButtonTabWrapper>

          <InfoButtonTabWrapper>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('More', {
                  screen: MorePage.TransactionHistory,
                })
              }>
              <InfoButtonInnerWrapper>
                <PText>{i18n.t('more_label.transaction_history')}</PText>
                <InfoArrowImg source={require('./images/next_gray.png')} />
              </InfoButtonInnerWrapper>
            </TouchableOpacity>
          </InfoButtonTabWrapper>
        </View>
        <View
          style={{
            borderBottomColor: '#F6F6F8',
            borderBottomWidth: 5,
            justifyContent: 'center',
            alignContent: 'flex-start',
          }}>
          <View>
            <H1Text>{i18n.t('more_label.elysia')}</H1Text>
          </View>

          <InfoButtonTabWrapper>
            <TouchableOpacity onPress={() => {}}>
              <InfoButtonInnerWrapper>
                <PText>{i18n.t('more_label.notice')}</PText>
                <InfoArrowImg source={require('./images/next_gray.png')} />
              </InfoButtonInnerWrapper>
            </TouchableOpacity>
          </InfoButtonTabWrapper>
          <InfoButtonTabWrapper>
            <TouchableOpacity onPress={() => {}}>
              <InfoButtonInnerWrapper>
                <PText>{i18n.t('more_label.service_terms')}</PText>
                <InfoArrowImg source={require('./images/next_gray.png')} />
              </InfoButtonInnerWrapper>
            </TouchableOpacity>
          </InfoButtonTabWrapper>
          <InfoButtonTabWrapper>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('More', { screen: MorePage.Contact })
              }>
              <InfoButtonInnerWrapper>
                <PText>{i18n.t('more_label.contact')}</PText>
                <InfoArrowImg source={require('./images/next_gray.png')} />
              </InfoButtonInnerWrapper>
            </TouchableOpacity>
          </InfoButtonTabWrapper>
          <InfoButtonTabWrapper>
            <TouchableOpacity onPress={() => {}}>
              <InfoButtonInnerWrapper>
                <PText>{i18n.t('more_label.faq')}</PText>
                <InfoArrowImg source={require('./images/next_gray.png')} />
              </InfoButtonInnerWrapper>
            </TouchableOpacity>
          </InfoButtonTabWrapper>
        </View>
        <View
          style={{
            borderBottomColor: '#F6F6F8',
            borderBottomWidth: 5,
          }}>
          <H1Text>{i18n.t('more_label.app_setting')}</H1Text>
          <H1Text style={{ fontSize: 16 }}>
            {i18n.t('more_label.language')}
          </H1Text>
          <View
            style={{
              borderColor: '#d6d6d8',
              borderWidth: 1,
              borderStyle: 'solid',
              marginLeft: '5%',
              marginRight: '5%',
              borderRadius: 5,
              height: 50,
              width: '90%',
              marginBottom: 20,
            }}>
            {Platform.OS === 'android' ? (
              <Picker style={{}}>
                <Picker.Item label="한국어" value="ko" />
                <Picker.Item label="English" value="en" />
                <Picker.Item label="简体中文" value="zh-hans" />
              </Picker>
            ) : (
              <RNPickerSelect
                style={pickerSelectStyles}
                onValueChange={async (value: LocaleType) => {
                  await AsyncStorage.setItem('@locale', value);
                }}
                items={[
                  { label: '한국어', value: LocaleType.KO },
                  { label: 'English', value: LocaleType.EN },
                  { label: '简体中文', value: LocaleType.CH },
                ]}
                placeholder={{
                  label: 'Select your app language',
                  value: '',
                  color: '#1C1C1C',
                }}
              />
            )}
          </View>
        </View>
        <View
          style={{
            borderBottomColor: '#F6F6F8',
            borderBottomWidth: 5,
          }}>
          <H1Text>{i18n.t('more_label.el_exchange')}</H1Text>
          <View style={{ flexDirection: 'row', marginBottom: 30 }}>
            <ExchangeBithumbImg source={ExchangeBithumbPng} />
            <ExchangeBobooImg source={ExchangebobooPng} />
          </View>
        </View>
        <Text
          style={{
            backgroundColor: '#F6F6F8',
            textAlign: 'right',
            paddingRight: '5%',
            fontSize: 10,
          }}>
          Ver demo sprint3
        </Text>
        <View
          style={{
            height: 100,
            backgroundColor: '#F6F6F8',
          }}
        />
      </ScrollView>
    </MainInfoWrapper>
  );
};

export default MainInfo;

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
    fontSize: 16,
    color: '#1C1C1C',
    justifyContent: 'center',
    alignContent: 'center',
    textAlign: 'center',
  },
  inputAndroid: {
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
    fontSize: 16,
    color: '#1C1C1C',
    justifyContent: 'center',
    alignContent: 'center',
  },
});
