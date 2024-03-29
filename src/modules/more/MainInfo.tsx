import React, { FunctionComponent, useContext, useState } from 'react';
import {
  View,
  TouchableOpacity,
  Animated,
  SafeAreaView,
  Alert,
  Platform,
} from 'react-native';
import { useNavigation, useScrollToTop } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { ScrollView } from 'react-native-gesture-handler';
import { MorePage } from '../../enums/pageEnum';
import Exchange00 from './images/bithumb_logo.png';
import Exchange01 from './images/bithumb_global_logo.png';
import Exchange03 from './images/gopax.png';
import Exchange04 from './images/xt_logo.png';
import Exchange05 from './images/mexe_logo.png';
import { H3Text } from '../../shared/components/Texts';
import ProviderType from '../../enums/ProviderType';
import UserContext from '../../contexts/UserContext';
import Setting from './Setting';
import { SubmitButton } from '../../shared/components/SubmitButton';
import WalletContext from '../../contexts/WalletContext';
import SignInStatus from '../../enums/SignInStatus';
import AppColors from '../../enums/AppColors';
import AnimatedMainHeader from '../../shared/components/AnimatedMainHeader';
import ExchangeButton from './components/ExchangeButton';
import useUserAddress from '../../hooks/useUserAddress';

const MainInfo: FunctionComponent = () => {
  const [scrollY] = useState(new Animated.Value(0));
  const { signOut } = useContext(UserContext);
  const { setLock, clearWallet } = useContext(WalletContext);
  const { user, isWalletUser } = useContext(UserContext);
  const navigation = useNavigation();
  const { t } = useTranslation();
  const userAddress = useUserAddress();
  const ref = React.useRef(null);
  useScrollToTop(ref);

  const isPublicAddressUser =
    user.provider === ProviderType.GUEST || user.provider === ProviderType.ETH;
  const isLegacyAsset2Owner = user.legacyAsset2Value > 0;

  const buttonTitle = () => {
    // TODO : 더욱 강력한 경고 문구로 삭제됨. 백업하지 않았으면, 해당 지갑을 복구 할 수 없음을 명시하기
    if (isWalletUser) {
      return t('more_label.delete_address');
    }

    switch (user.provider) {
      case ProviderType.ETH:
        return t('more_label.disconnect_address');
      case ProviderType.GUEST:
        return t('more_label.return_initial');
      case ProviderType.EMAIL:
        return t('more_label.logout');
      default:
        return '';
    }
  };

  const confirmSignOut = () => {
    // TODO : 더욱 강력한 경고 문구로 변경하기
    if (isWalletUser) {
      if (Platform.OS !== 'android') {
        return Alert.prompt(
          t('more_label.delete_address'),
          t('more.confirm_delete'),
          (res) => {
            if (res === 'delete') {
              setLock();
              clearWallet();
              signOut(SignInStatus.SIGNOUT);
            }
          },
        );
      } else {
        return Alert.alert(
          t('more_label.delete_address'),
          t('more.confirm_disconnect'),
          [
            {
              text: 'Cancel',
              onPress: () => {},
              style: 'cancel',
            },
            {
              text: 'OK',
              onPress: () => {
                setLock();
                clearWallet();
                signOut(SignInStatus.SIGNOUT);
              },
              style: 'default',
            },
          ],
          { cancelable: false },
        );
      }
    }

    switch (user.provider) {
      case ProviderType.ETH:
        return Alert.alert(
          t('more_label.disconnect'),
          t('more.confirm_disconnect'),
          [
            {
              text: 'Cancel',
              onPress: () => {},
              style: 'cancel',
            },
            {
              text: 'OK',
              onPress: () => {
                signOut(SignInStatus.SIGNOUT);
              },
              style: 'default',
            },
          ],
          { cancelable: false },
        );
      case ProviderType.GUEST:
        return signOut(SignInStatus.SIGNOUT);
      case ProviderType.EMAIL:
        return Alert.alert(
          t('more_label.logout'),
          t('more.confirm_logout'),
          [
            {
              text: 'Cancel',
              onPress: () => {},
              style: 'cancel',
            },
            {
              text: 'OK',
              onPress: () => {
                signOut(SignInStatus.SIGNOUT);
              },
              style: 'default',
            },
          ],
          { cancelable: false },
        );
      default:
        break;
    }
  };

  return (
    <SafeAreaView
      style={{
        width: '100%',
        height: '100%',
        top: 0,
        backgroundColor: AppColors.WHITE,
      }}>
      <AnimatedMainHeader title={t('more_label.more')} scrollY={scrollY} />
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
            // height: 350,
            marginTop: 10,
            paddingBottom: 10,
          }}>
          <View style={{ marginLeft: '5%', marginRight: '5%', paddingTop: 10 }}>
            <Setting />
            <H3Text
              label={t('more_label.my_info')}
              style={{ marginTop: 60, color: AppColors.BLACK2 }}
            />
            {!userAddress && (
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
                      <H3Text
                        label={t('more_label.wallet_connect')}
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
                            backgroundColor: AppColors.NOTICE_RED,
                          }}
                        />
                      )}
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            )}

            {!isPublicAddressUser && (
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
                    <H3Text
                      label={t('more_label.my_account')}
                      style={{ lineHeight: 50, fontSize: 15 }}
                    />
                  </View>
                </TouchableOpacity>
              </View>
            )}

            {isLegacyAsset2Owner && (
              <View
                style={{
                  height: 50,
                  marginTop: 10,
                }}>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('More', {
                      screen: MorePage.Asset2Ownership,
                    })
                  }>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <H3Text
                      label="My asset#2 ownership"
                      style={{ lineHeight: 50, fontSize: 15 }}
                    />
                  </View>
                </TouchableOpacity>
              </View>
            )}

            {isWalletUser && (
              <View
                style={{
                  height: 50,
                  marginTop: 10,
                }}>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('More', {
                      screen: MorePage.CheckMnemonic,
                    })
                  }>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <H3Text
                      label={t('more_label.backupseed')}
                      style={{ lineHeight: 50, fontSize: 15 }}
                    />
                  </View>
                </TouchableOpacity>
              </View>
            )}

            <View
              style={{
                marginTop: 30,
                height: 2,
                backgroundColor: AppColors.BACKGROUND_GREY,
              }}
            />

            <H3Text
              label={t('more_label.service_center')}
              style={{ marginTop: 30, color: AppColors.BLACK2 }}
            />
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
                  <H3Text
                    label={t('more_label.contact')}
                    style={{ lineHeight: 50, fontSize: 15 }}
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
                    screen: MorePage.HelpDesk,
                  })
                }>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <H3Text
                    label={t('more_label.help_desk')}
                    style={{ lineHeight: 50, fontSize: 15 }}
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
                    screen: MorePage.TermsOfUse,
                  })
                }>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <H3Text
                    label={t('more_label.service_terms')}
                    style={{ lineHeight: 50, fontSize: 15 }}
                  />
                </View>
              </TouchableOpacity>
            </View>
            {!isPublicAddressUser && (
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
                    <H3Text
                      label={t('more_label.privacy_policy')}
                      style={{ lineHeight: 50, fontSize: 15 }}
                    />
                  </View>
                </TouchableOpacity>
              </View>
            )}

            <View
              style={{
                marginTop: 30,
                height: 2,
                backgroundColor: AppColors.BACKGROUND_GREY,
              }}
            />

            <H3Text
              label={t('more_label.el_exchange')}
              style={{
                marginTop: 10,
                paddingTop: 25,
                paddingBottom: 30,
                color: AppColors.BLACK2,
              }}
            />
            <ScrollView
              horizontal={true}
              style={{
                flexDirection: 'row',
                marginBottom: 20,
              }}>
              <ExchangeButton url="https://www.bithumb.com" img={Exchange00} />
              <ExchangeButton
                url="https://www.bithumb.pro/en-us"
                img={Exchange01}
              />
              <ExchangeButton url="https://www.gopax.co.kr" img={Exchange03} />
              <ExchangeButton url="https://www.xt.com" img={Exchange04} />
              <ExchangeButton
                url="https://www.mexc.com/ko-KR"
                img={Exchange05}
              />
            </ScrollView>

            <View
              style={{
                marginTop: 30,
                height: 2,
                backgroundColor: AppColors.BACKGROUND_GREY,
              }}
            />

            <View
              style={{
                height: 125,
                paddingTop: 25,
                paddingBottom: 25,
              }}>
              <SubmitButton
                title={buttonTitle()}
                handler={confirmSignOut}
                style={{
                  width: '100%',
                  alignSelf: 'center',
                  backgroundColor:
                    user.provider === ProviderType.ETH || isWalletUser
                      ? AppColors.CRITICAL_RED
                      : '#767577',
                }}
              />
            </View>
          </View>
        </View>
      </Animated.ScrollView>
    </SafeAreaView>
  );
};

export default MainInfo;
