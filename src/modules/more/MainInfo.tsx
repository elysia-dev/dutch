import React, { FunctionComponent, useContext, useState } from 'react';
import {
  View,
  TouchableOpacity,
  Platform,
  StyleSheet,
  Text,
  ScrollView,
  Animated,
  SafeAreaView,
} from 'react-native';
import styled from 'styled-components/native';
import { useNavigation, useScrollToTop } from '@react-navigation/native';
import * as Linking from 'expo-linking';
import { SubmitButton } from '../../shared/components/SubmitButton';
import i18n from '../../i18n/i18n';
import { KycStatus } from '../../enums/KycStatus';
import { MorePage } from '../../enums/pageEnum';
import RootContext from '../../contexts/RootContext';
import ExchangeBithumbPng from './images/bithumb_logo.png';
import ExchangeBithumbGlobalPng from './images/bithumb_global_logo.png';
import ExchangebobooPng from './images/boboo_logo.png';
import ExchangeGopaxPng from './images/gopax.png';
import ExchangeXtPng from './images/xt_logo.png';
import kycNoneButtonPng from './images/kycNoneButtonImg.png';
import { H1Text, P1Text, P4Text, H3Text } from '../../shared/components/Texts';
import ProviderType from '../../enums/ProviderType';

const ExchangeImg = styled.Image`
  width: 100%;
  height: 60px;
  resize-mode: contain;
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
const KycPendingButton = styled.View`
  color: #1c1c1c;
  width: 90%;
  margin: 5px auto;
  height: 70px;
  border-radius: 5px;
  flex-direction: row;
  justify-content: center;
  align-content: center;
`;
const KycNoneButtonImg = styled.Image`
  height: 67px;
  z-index: 0;
  margin-left: auto;
`;
const InfoHeaderSettingImg = styled.Image`
  margin-top: 5px;
  width: 21px;
  height: 21px;
`;
const InfoArrowImg = styled.Image`
  width: 5px;
  height: 8px;
  margin: 20px 20px;
`;
const MainInfo: FunctionComponent = () => {
  const [scrollY] = useState(new Animated.Value(0));
  const { user } = useContext(RootContext);
  const navigation = useNavigation();
  const ref = React.useRef(null);
  useScrollToTop(ref);

  const isNewWalletUser =
    user.provider === ProviderType.GUEST || user.provider === ProviderType.ETH;

  return (
    <SafeAreaView
      style={{
        width: '100%',
        height: '100%',
        top: 0,
        backgroundColor: '#FFF',
      }}>
      <Animated.View
        style={{
          overflow: 'hidden',
          backgroundColor: 'transparent',
          paddingBottom: 1,
        }}>
        <Animated.View
          style={{
            flexDirection: 'row',
            backgroundColor: '#fff',
            elevation: scrollY.interpolate({
              inputRange: [-1000, 0, 15, 1000],
              outputRange: [0, 0, 5, 5],
            }),
            shadowOffset: { width: 1, height: 1 },
            shadowColor: '#00000033',
            shadowOpacity: scrollY.interpolate({
              inputRange: [-1000, 0, 15, 1000],
              outputRange: [0, 0, 0.5, 0.5],
            }),
            paddingTop: Platform.OS === 'android' ? 65 : 45,
            paddingBottom: 10,
            paddingLeft: '5%',
            paddingRight: '5%',
            transform: [
              {
                translateY: scrollY.interpolate({
                  inputRange: [-1000, 0, 15, 1000],
                  outputRange: [0, 0, -5, -5],
                }),
              },
            ],
          }}>
          <View>
            <Animated.Text
              allowFontScaling={false}
              style={{
                color: '#1c1c1c',
                fontSize: 28,
                left: 0,
                paddingLeft: 0,
                transform: [
                  {
                    translateX: scrollY.interpolate({
                      inputRange: [-1000, 0, 15, 1000],
                      outputRange: [0, 0, -5, -5],
                    }),
                  },
                  {
                    translateY: 0,
                  },
                  {
                    scale: scrollY.interpolate({
                      inputRange: [-1000, 0, 15, 1000],
                      outputRange: [1, 1, 0.9, 0.9],
                    }),
                  },
                ],
                textAlign: 'left',
                fontFamily: 'Roboto_700Bold',
              }}>
              {i18n.t('more_label.more')}
            </Animated.Text>
          </View>
          <TouchableOpacity
            style={{ marginLeft: 'auto' }}
            onPress={() => {
              navigation.navigate('More', { screen: MorePage.Setting });
            }}>
            <InfoHeaderSettingImg source={require('./images/setting.png')} />
          </TouchableOpacity>
        </Animated.View>
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
        )}>
        <View
          style={{
            borderBottomColor: '#F6F6F8',
            borderBottomWidth: 5,
            // height: 350,
            marginTop: 10,
            paddingBottom: 10,
          }}>
          {!isNewWalletUser && user.kycStatus === KycStatus.NONE && (
            <View style={{ marginBottom: 28 }}>
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
                <View style={{ alignSelf: 'center', marginLeft: '6%' }}>
                  <Text
                    allowFontScaling={false}
                    style={{
                      fontSize: 13,
                      textAlign: 'left',
                      fontFamily: 'Roboto_400Regular',
                    }}>
                    {i18n.t('more_label.none_kyc_duplicate_label')}
                    <Text
                      allowFontScaling={false}
                      style={{
                        fontSize: 15,
                        textAlign: 'left',
                        fontFamily: 'Roboto_700Bold',
                      }}>
                      {'\n'}
                      {i18n.t('more_label.none_kyc')}
                    </Text>
                  </Text>
                  <View
                    style={{
                      position: 'absolute',
                      top: 9,
                      right: -9,
                      width: 8,
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: '#FC5C4F',
                    }}
                  />
                </View>
                <KycNoneButtonImg source={kycNoneButtonPng} />
              </KycNoneButton>
            </View>
          )}
          {!isNewWalletUser && user.kycStatus === KycStatus.REJECTED && (
            <View style={{ marginBottom: 28 }}>
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
                <View style={{ alignSelf: 'center', marginLeft: '6%' }}>
                  <Text
                    allowFontScaling={false}
                    style={{
                      fontSize: 13,
                      textAlign: 'left',
                      fontFamily: 'Roboto_400Regular',
                    }}>
                    {i18n.t('more_label.none_kyc_duplicate_label')}
                    <Text
                      allowFontScaling={false}
                      style={{
                        fontSize: 15,
                        textAlign: 'left',
                        fontFamily: 'Roboto_700Bold',
                      }}>
                      {'\n'}
                      {i18n.t('more_label.none_kyc')}
                    </Text>
                  </Text>
                  <View
                    style={{
                      position: 'absolute',
                      top: 9,
                      right: -9,
                      width: 8,
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: '#FC5C4F',
                    }}
                  />
                </View>
                <KycNoneButtonImg source={kycNoneButtonPng} />
              </KycNoneButton>
            </View>
          )}
          {!isNewWalletUser && user.kycStatus === KycStatus.PENDING && (
            <View style={{ marginBottom: 28 }}>
              <H3Text
                label={i18n.t('more_label.pending_kyc')}
                style={{
                  color: '#FFF',
                  zIndex: 11,
                  width: '100%',
                  position: 'absolute',
                  textAlign: 'center',
                  lineHeight: 80,
                }}
              />
              <KycPendingButton
                style={{
                  backgroundColor: '#000000D0',
                  position: 'absolute',
                  zIndex: 10,
                  marginLeft: '5%',
                }}
              />
              <KycPendingButton>
                <View style={{ alignSelf: 'center', marginLeft: '6%' }}>
                  <Text
                    allowFontScaling={false}
                    style={{
                      fontSize: 13,
                      textAlign: 'left',
                      fontFamily: 'Roboto_400Regular',
                    }}>
                    {i18n.t('more_label.none_kyc_duplicate_label')}
                    <Text
                      allowFontScaling={false}
                      style={{
                        fontSize: 15,
                        textAlign: 'left',
                        fontFamily: 'Roboto_700Bold',
                      }}>
                      {'\n'}
                      {i18n.t('more_label.none_kyc')}
                    </Text>
                  </Text>
                </View>
                <KycNoneButtonImg source={kycNoneButtonPng} />
              </KycPendingButton>
            </View>
          )}
          {!isNewWalletUser && user.kycStatus === KycStatus.SUCCESS && (
            <SubmitButton
              style={{
                height: 70,
                marginBottom: 28,
              }}
              duplicateTitle={i18n.t('more_label.success_kyc_duplicate_label')}
              title={i18n.t('more_label.success_kyc')}
              handler={() => {}}
              variant={'GrayTheme'}
            />
          )}
          <View style={{ marginLeft: '5%', marginRight: '5%', paddingTop: 10 }}>
            <H3Text
              label={i18n.t('more_label.my_info')}
              style={{ marginBottom: 15, fontSize: 18 }}
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
                  <P1Text
                    label={i18n.t('more_label.transaction_history')}
                    style={{ lineHeight: 50, fontSize: 15 }}
                  />
                  <InfoArrowImg source={require('./images/next_gray.png')} />
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
                    screen: MorePage.RegisterEthAddress,
                  })
                }>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <View>
                    <P1Text
                      label={
                        user.ethAddresses?.length > 0
                          ? i18n.t('more_label.my_wallet')
                          : i18n.t('more_label.wallet_connect')
                      }
                      style={{ lineHeight: 50, fontSize: 15 }}
                    />
                    {!(user.ethAddresses?.length > 0) && (
                      <View
                        style={{
                          position: 'absolute',
                          top: 10,
                          right: -13,
                          width: 8,
                          height: 8,
                          borderRadius: 4,
                          backgroundColor: '#FC5C4F',
                        }}
                      />
                    )}
                  </View>
                  <InfoArrowImg source={require('./images/next_gray.png')} />
                </View>
              </TouchableOpacity>
            </View>

            {!isNewWalletUser && (
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
                    <P1Text
                      label={i18n.t('more_label.my_account')}
                      style={{ lineHeight: 50, fontSize: 15 }}
                    />
                    <InfoArrowImg source={require('./images/next_gray.png')} />
                  </View>
                </TouchableOpacity>
              </View>
            )}
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
            <H3Text
              label={i18n.t('more_label.service_center')}
              style={{ marginBottom: 15, fontSize: 18 }}
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
                  <P1Text
                    label={i18n.t('more_label.faq')}
                    style={{ lineHeight: 50, fontSize: 15 }}
                  />
                  <InfoArrowImg source={require('./images/next_gray.png')} />
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
                  <P1Text
                    label={i18n.t('more_label.contact')}
                    style={{ lineHeight: 50, fontSize: 15 }}
                  />
                  <InfoArrowImg source={require('./images/next_gray.png')} />
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
                    screen: MorePage.TermsOfUse,
                  })
                }>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <P1Text
                    label={i18n.t('more_label.service_terms')}
                    style={{ lineHeight: 50, fontSize: 15 }}
                  />
                  <InfoArrowImg source={require('./images/next_gray.png')} />
                </View>
              </TouchableOpacity>
            </View>
            {!isNewWalletUser && (
              <View
                style={{
                  height: 50,
                  marginTop: 10,
                }}>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('More', {
                      screen: MorePage.PrivacyPolicy,
                    })
                  }>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <P1Text
                      label={i18n.t('more_label.privacy_policy')}
                      style={{ lineHeight: 50, fontSize: 15 }}
                    />
                    <InfoArrowImg source={require('./images/next_gray.png')} />
                  </View>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
        <View
          style={{
            borderBottomColor: '#F6F6F8',
            borderBottomWidth: 5,
          }}>
          <H3Text
            label={i18n.t('more_label.el_exchange')}
            style={{
              marginTop: 10,
              marginLeft: '5%',
              marginRight: '5%',
              paddingTop: 25,
              paddingBottom: 30,
              fontSize: 18,
            }}
          />
          <View
            style={{
              flexDirection: 'column',
              marginBottom: 30,
              paddingHorizontal: '3%',
            }}>
            <View
              style={{
                flexDirection: 'row',
                marginBottom: 20,
              }}>
              <TouchableOpacity
                style={{ width: '50%' }}
                onPress={() => Linking.openURL('https://www.bithumb.com')}>
                <ExchangeImg source={ExchangeBithumbPng} />
              </TouchableOpacity>
              <TouchableOpacity
                style={{ width: '50%' }}
                onPress={() =>
                  Linking.openURL('https://www.bithumb.pro/en-us')
                }>
                <ExchangeImg source={ExchangeBithumbGlobalPng} />
              </TouchableOpacity>
            </View>
            <View
              style={{
                flexDirection: 'row',
              }}>
              <TouchableOpacity
                style={{
                  width: '50%',
                  paddingHorizontal: '3%',
                }}
                onPress={() => Linking.openURL('https://www.boboo.com')}>
                <ExchangeImg source={ExchangebobooPng} />
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  width: '50%',
                  paddingHorizontal: '5%',
                }}
                onPress={() => Linking.openURL('https://www.gopax.co.kr')}>
                <ExchangeImg source={ExchangeGopaxPng} />
              </TouchableOpacity>
            </View>
            <View
              style={{
                flexDirection: 'row',
              }}>
              <TouchableOpacity
                style={{
                  width: '50%',
                  paddingHorizontal: '5%',
                }}
                onPress={() => Linking.openURL('https://www.xt.com')}>
                <ExchangeImg source={ExchangeXtPng} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View
          style={{
            height: 100,
            backgroundColor: '#F6F6F8',
          }}
        />
      </Animated.ScrollView>
    </SafeAreaView>
  );
};

export default MainInfo;
