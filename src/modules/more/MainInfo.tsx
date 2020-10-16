import React, { FunctionComponent, useContext, useState } from 'react';
import {
  View,
  TouchableOpacity,
  Platform,
  Picker,
  StyleSheet,
  Text,
  ScrollView,
  Animated,
} from 'react-native';
import styled from 'styled-components/native';
import { useNavigation, useScrollToTop } from '@react-navigation/native';
import RNPickerSelect, { Item } from 'react-native-picker-select';
import AsyncStorage from '@react-native-community/async-storage';
import { SubmitButton } from '../../shared/components/SubmitButton';
import i18n from '../../i18n/i18n';
import { KycStatus } from '../../enums/KycStatus';
import { MorePage } from '../../enums/pageEnum';
import RootContext from '../../contexts/RootContext';
import ExchangeBithumbPng from './images/bithumb_logo.png';
import ExchangebobooPng from './images/boboo_logo.png';
import kycNoneButtonPng from './images/kycNoneButtonImg.png';
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
const KycNoneButton = styled.TouchableOpacity`
  color: #1c1c1c;
  width: 90%;
  margin: 5px auto;
  height: 70px;
  background-color: #fff;
  border-radius: 5px;
  border: solid 1.5px #3679b5;
  flex-direction: row;
  justify-content: center;
  align-content: center;
  z-index: 5;
`;
const KycNoneButtonImg = styled.Image`
  height: 67px;
  z-index: 0;
  margin-left: auto;
`;
const ExchangeBobooImg = styled.Image`
  width: 40%;
  flex: 1;
  height: 60px;
  resize-mode: center;
  top: 3px;
`;
const InfoHeaderSettingImg = styled.Image`
  marginTop: 5px;
  width: 21px;
  height: 21px;
`;
const InfoArrowImg = styled.Image`
  width: 5px;
  height: 8px;
  margin: 20px 20px;
  resize-mode: center;
`;
const MainInfo: FunctionComponent = () => {
  const [scrollY] = useState(new Animated.Value(0));
  const { user } = useContext(RootContext);
  const navigation = useNavigation();
  const ref = React.useRef(null);
  useScrollToTop(ref);

  return (
    <View
      style={{
        width: '100%',
        height: '100%',
        top: 0,
        backgroundColor: '#FFF',
      }}
    >
      <Animated.View
        style={{
          flexDirection: 'row',
          backgroundColor: '#fff',
          shadowOffset: { width: 1, height: 1 },
          shadowColor: '#00000033',
          shadowOpacity: scrollY.interpolate({
            inputRange: [0, 15, 1000],
            outputRange: [0, 0.5, 0.5],
          }),
          paddingTop: 60,
          paddingBottom: 15,
          paddingLeft: 20,
          paddingRight: 20,
          transform: [
            {
              translateY: scrollY.interpolate({
                inputRange: [0, 15, 1000],
                outputRange: [0, -5, -5],
              }),
            },
          ],
        }}
      >
        <View>
          <Animated.Text
            style={{
              position: 'relative',
              left: 0,
              color: '#1c1c1c',
              fontSize: 28,
              transform: [
                {
                  scale: scrollY.interpolate({
                    inputRange: [-1000, 0, 15, 1000],
                    outputRange: [1, 1, 0.9, 0.9],
                  }),
                },
              ],
              fontWeight: 'bold',
              textAlign: 'center',
            }}>
            {i18n.t('more_label.more')}
          </Animated.Text>
        </View>
        <TouchableOpacity
          style={{ marginLeft: 'auto' }}
          onPress={() => {
            navigation.navigate('More', { screen: MorePage.Setting });
          }}>
          <InfoHeaderSettingImg
            source={require('./images/setting.png')}
          />
        </TouchableOpacity>
      </Animated.View>
      <Animated.ScrollView
        ref={ref}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [
            {
              nativeEvent: { contentOffset: { y: scrollY } },
            },
          ],
          { useNativeDriver: true },
        )}
      >
        <View
          style={{
            borderBottomColor: '#F6F6F8',
            borderBottomWidth: 5,
            height: 350,
            marginTop: 30,
          }}>
          {user.kycStatus === KycStatus.NONE && (
            <View>
              <KycNoneButton
                onPress={() => navigation.navigate('Kyc')}
                style={{
                  shadowOffset: { width: 2, height: 1 },
                  shadowColor: '#00000064',
                  shadowOpacity: 0.8,
                  shadowRadius: 6,
                  height: 70,
                  elevation: 6,
                }}>
                <Text
                  style={{
                    fontSize: 13,
                    textAlign: 'left',
                    marginLeft: '6%',
                    paddingTop: 12,
                  }}>
                  {i18n.t('more_label.need_kyc_duplicate_label')}
                  <Text
                    style={{
                      fontSize: 15,
                      textAlign: 'left',
                      fontWeight: 'bold',
                    }}>
                    {'\n'}
                    {i18n.t('more_label.need_kyc')}
                  </Text>
                </Text>
                <KycNoneButtonImg source={kycNoneButtonPng} />
              </KycNoneButton>
            </View>
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
                'more_label.pending_kyc_duplicate_label',
              )}
              title={i18n.t('more_label.pending_kyc')}
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
                'more_label.success_kyc_duplicate_label',
              )}
              title={i18n.t('more_label.success_kyc')}
              handler={() => { }}
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
                onPress={() => navigation.navigate('More', {
                  screen: MorePage.Transactions,
                })}>
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
              <TouchableOpacity
                onPress={() => { }}>
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
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('More', {
                    screen: MorePage.Faq,
                  })
                }>
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
              <TouchableOpacity
                onPress={() => { }}>
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
      </Animated.ScrollView>
    </View>
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
