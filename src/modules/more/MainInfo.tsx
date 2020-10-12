import React, { FunctionComponent, useContext } from 'react';
import {
  View,
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
import RootContext from '../../contexts/RootContext';
import ExchangeBithumbPng from './images/bithumb_logo.png';
import ExchangebobooPng from './images/boboo_logo.png';
import LocaleType from '../../enums/LocaleType';
import { H1Text } from '../../shared/components/H1Text';
import { PText } from '../../shared/components/PText';
import { TitleText } from '../../shared/components/TitleText';
import WrapperLayout from '../../shared/components/WrapperLayout';

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
const InfoHeaderSettingImg = styled.Image`
  width: 21px;
  height: 21px;
  top: 9px;
`;
const InfoArrowImg = styled.Image`
  width: 5px;
  height: 8px;
  margin: 20px 20px;
  resize-mode: center;
`;
const MainInfo: FunctionComponent = () => {
  const { user } = useContext(RootContext);
  const navigation = useNavigation();

  return (
    <>
      <WrapperLayout
        title={
          <>
            <View
              style={{
                flexDirection: 'row',
              }}>
              <View
                style={{
                  flex: 1,
                }}>
                <TitleText label={'MORE'} />
              </View>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('More', { screen: MorePage.MyPage });
                }}>
                <InfoHeaderSettingImg
                  source={require('./images/setting.png')}
                />
              </TouchableOpacity>
            </View>
          </>
        }
        isScrolling={true}
        isBackbutton={false}
        body={
          <>
            <View
              style={{
                borderBottomColor: '#F6F6F8',
                borderBottomWidth: 5,
                height: 350,
              }}>
              {user.kycStatus === KycStatus.NONE && (
                <SubmitButton
                  style={{
                    shadowOffset: { width: 2, height: 1 },
                    shadowColor: '#00000064',
                    shadowOpacity: 0.8,
                    shadowRadius: 6,
                    height: 70,
                    elevation: 6,
                  }}
                  duplicateTitle={i18n.t('more_label.need_kyc_duplicate_label')}
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
                    height: 70,
                    elevation: 6,
                  }}
                  duplicateTitle={i18n.t(
                    'more_label.proceed_kyc_duplicate_label',
                  )}
                  title={i18n.t('more_label.proceed_kyc')}
                  handler={() => {
                    alert(i18n.t('more.kyc_proceeding_wait'));
                  }}
                  variant={'GrayTheme'}
                />
              )}
              {user.kycStatus === KycStatus.SUCCESS && (
                <SubmitButton
                  style={{
                    shadowOffset: { width: 2, height: 1 },
                    shadowColor: '#00000064',
                    shadowOpacity: 0.8,
                    shadowRadius: 6,
                    height: 70,
                    elevation: 6,
                  }}
                  duplicateTitle={i18n.t(
                    'more_label.approved_kyc_duplicate_label',
                  )}
                  title={i18n.t('more_label.approved_kyc')}
                  handler={() => {}}
                  variant={'GrayTheme'}
                />
              )}
              <View
                style={{ marginLeft: '5%', marginRight: '5%', paddingTop: 38 }}>
                <H1Text
                  label={i18n.t('more_label.my_info')}
                  style={{ marginBottom: 15 }}
                />
                <View
                  style={{
                    height: 50,
                    marginTop: 10,
                  }}>
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate('More', {
                        screen: MorePage.Transactions,
                      })
                    }>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <PText
                        label={i18n.t('more_label.transaction_history')}
                        style={{ lineHeight: 50, fontSize: 15 }}
                      />
                      <InfoArrowImg
                        source={require('./images/next_gray.png')}
                      />
                    </View>
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    height: 50,
                    marginTop: 10,
                  }}>
                  <TouchableOpacity onPress={() => {}}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <PText
                        label={i18n.t('more_label.wallet_connect')}
                        style={{ lineHeight: 50, fontSize: 15 }}
                      />
                      <InfoArrowImg
                        source={require('./images/next_gray.png')}
                      />
                    </View>
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    height: 50,
                    marginTop: 10,
                  }}>
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate('More', {
                        screen: MorePage.MyPage,
                      })
                    }>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <PText
                        label={i18n.t('more_label.my_account')}
                        style={{ lineHeight: 50, fontSize: 15 }}
                      />
                      <InfoArrowImg
                        source={require('./images/next_gray.png')}
                      />
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <View
              style={{
                borderBottomColor: '#F6F6F8',
                borderBottomWidth: 5,
              }}>
              <View
                style={{
                  marginLeft: '5%',
                  marginRight: '5%',
                  paddingTop: 25,
                  paddingBottom: 15,
                }}>
                <H1Text
                  label={i18n.t('more_label.service_center')}
                  style={{ marginBottom: 15 }}
                />
                <View
                  style={{
                    height: 50,
                    marginTop: 10,
                  }}>
                  <TouchableOpacity onPress={() => {}}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <PText
                        label={i18n.t('more_label.notice')}
                        style={{ lineHeight: 50, fontSize: 15 }}
                      />
                      <InfoArrowImg
                        source={require('./images/next_gray.png')}
                      />
                    </View>
                  </TouchableOpacity>
                </View>

                <View
                  style={{
                    height: 50,
                    marginTop: 10,
                  }}>
                  <TouchableOpacity onPress={() => {}}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <PText
                        label={i18n.t('more_label.faq')}
                        style={{ lineHeight: 50, fontSize: 15 }}
                      />
                      <InfoArrowImg
                        source={require('./images/next_gray.png')}
                      />
                    </View>
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    height: 50,
                    marginTop: 10,
                  }}>
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate('More', {
                        screen: MorePage.Contact,
                      })
                    }>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <PText
                        label={i18n.t('more_label.contact')}
                        style={{ lineHeight: 50, fontSize: 15 }}
                      />
                      <InfoArrowImg
                        source={require('./images/next_gray.png')}
                      />
                    </View>
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    height: 50,
                    marginTop: 10,
                  }}>
                  <TouchableOpacity onPress={() => {}}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <PText
                        label={i18n.t('more_label.service_terms')}
                        style={{ lineHeight: 50, fontSize: 15 }}
                      />
                      <InfoArrowImg
                        source={require('./images/next_gray.png')}
                      />
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <View
              style={{
                borderBottomColor: '#F6F6F8',
                borderBottomWidth: 5,
              }}>
              <View
                style={{
                  marginLeft: '5%',
                  marginRight: '5%',
                  paddingTop: 25,
                  paddingBottom: 15,
                }}>
                <H1Text
                  label={i18n.t('more_label.app_setting')}
                  style={{ marginBottom: 15 }}
                />
                <H1Text
                  style={{ fontSize: 16, marginTop: 10 }}
                  label={i18n.t('more_label.language')}
                />
                <View
                  style={{
                    borderColor: '#d6d6d8',
                    borderWidth: 1,
                    borderStyle: 'solid',
                    borderRadius: 5,
                    height: 50,
                    marginBottom: 20,
                    marginTop: 10,
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
            </View>
            <View
              style={{
                borderBottomColor: '#F6F6F8',
                borderBottomWidth: 5,
              }}>
              <H1Text
                label={i18n.t('more_label.el_exchange')}
                style={{
                  marginTop: 10,
                  marginLeft: '5%',
                  marginRight: '5%',
                  paddingTop: 25,
                  paddingBottom: 45,
                }}
              />
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
          </>
        }
      />
    </>
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
