import React, {
  FunctionComponent,
  useState,
  useContext,
  useEffect,
} from 'react';
import {
  View,
  Switch,
  Platform,
  TouchableOpacity,
  Image,
} from 'react-native';

import { Picker } from '@react-native-community/picker';
import { useNavigation } from '@react-navigation/native';
import * as Notifications from 'expo-notifications';
import { useTranslation } from 'react-i18next';
import { P1Text, H3Text } from '../../shared/components/Texts';
import LocaleType from '../../enums/LocaleType';
import registerForPushNotificationsAsync from '../../utiles/registerForPushNotificationsAsync';
import { config } from '../../../package.json';
import IosPickerModal from '../../shared/components/IosPickerModal';
import { MorePage } from '../../enums/pageEnum';
import CurrencyType from '../../enums/CurrencyType';
import storeDeeplink from '../../utiles/storeDeeplink';
import checkLatestVersion from '../../utiles/checkLatestVersion';
import ProviderType from '../../enums/ProviderType';
import UserContext from '../../contexts/UserContext';
import AppColors from '../../enums/AppColors';
import PreferenceContext from '../../contexts/PreferenceContext';
import EspressoV2 from '../../api/EspressoV2';
import WalletContext from '../../contexts/WalletContext';

const Setting: FunctionComponent = () => {
  const { user, expoPushToken, isWalletUser, Server, setUserExpoPushToken } = useContext(UserContext);
  const navigation = useNavigation();
  const { language, currency, notification, setLanguage, setCurrency, setNotification } = useContext(PreferenceContext);
  const { wallet } = useContext(WalletContext);
  const [state, setState] = useState({
    hasPermission: user.expoPushTokens?.includes(expoPushToken) || (isWalletUser && notification),
    selectedCurrency: currency || CurrencyType.USD,
    showLanguageModal: false,
    showCurrencyModal: false,
    selectedLanguage: language || LocaleType.EN,
    selctedCurrency: currency,
    latestVersion: config.version,
  });
  const { t } = useTranslation();

  useEffect(() => {
    loadVersion();
  }, []);

  const loadVersion = async () => {
    try {
      const version = await Server.checkLatestVersion(Platform.OS);

      setState({
        ...state,
        latestVersion: version.data,
      });
    } catch (e) {
      if (e.response.status === 500) {
        alert(t('account_errors.server'));
      }
    }
  };

  const activityToggleButton = async () => {
    setState({ ...state, hasPermission: !state.hasPermission });

    if (!state.hasPermission) {
      registerForPushNotificationsAsync().then((expoPushToken) => {
        if (expoPushToken) {
          if (isWalletUser) {
            EspressoV2.subscribeExisted(wallet?.getFirstNode()?.address || '', expoPushToken);
          } else {
            Server.registerExpoPushToken(expoPushToken);
          }
          setNotification(true);
          setUserExpoPushToken(expoPushToken);
        }
      });
    } else {
      Notifications.getExpoPushTokenAsync().then((token) => {
        if (isWalletUser) {
          EspressoV2.unsubsribe(wallet?.getFirstNode()?.address || '', expoPushToken);
        } else {
          Server.deleteExpoPushToken(token.data);
        }
        setNotification(false);
        setUserExpoPushToken('');
      });
    }
  };

  const currencyText = () => {
    if (currency === CurrencyType.KRW) {
      return '₩';
    } else if (currency === CurrencyType.CNY) {
      return '¥';
    } else {
      return '$';
    }
  };

  return (
    <>
      <>
        <View
          style={{
            borderBottomColor: '#F6F6F8',
            top: 22,
          }}>
          <H3Text
            label={t('more_label.app_setting')}
            style={{ color: AppColors.BLACK2 }}
          />
          {
            (user.provider !== ProviderType.GUEST || isWalletUser) && <View>
              <View
                style={{
                  marginTop: 30,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignContent: 'center',
                  }}>
                  <H3Text
                    label={t('more_label.push_notice')}
                    style={{
                      alignSelf: 'center',
                      fontSize: 15,
                    }}
                  />
                  <Switch
                    trackColor={{ false: '#767577', true: '#3679B5' }}
                    thumbColor={state.hasPermission ? '#FFFFFF' : '#f4f3f4'}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={activityToggleButton}
                    value={state.hasPermission}
                    style={{
                      alignSelf: 'center',
                    }}
                  />
                </View>
              </View>
            </View>
          }
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignContent: 'center',
              marginTop: 20,
            }}>
            <H3Text
              label={t('more_label.language')}
              style={{
                alignSelf: 'center',
                fontSize: 15,
              }}
            />
            <View
              style={{
                width: Platform.OS === 'android' ? 80 : 52,
                borderWidth: 1,
                borderRadius: 20,
                borderColor: AppColors.BLUE_2,
                backgroundColor: AppColors.BACKGROUND_GREY,
              }}>
              {Platform.OS === 'android' ? (
                <View style={{ padding: 5 }}>
                  <P1Text
                    style={{ position: 'absolute', textAlign: 'center', width: 80, top: 3 }}
                    label={state.selectedLanguage === LocaleType.KO ? 'ko' : state.selectedLanguage === LocaleType.EN ? 'en' : 'ch'}
                  />
                  <Picker
                    style={{
                      opacity: 0,
                      height: 20,
                      backgroundColor: 'transparent',
                    }}
                    accessibilityLabel={'settings'}
                    selectedValue={state.selectedLanguage?.toString()}
                    onValueChange={async (itemValue) => {
                      setState({
                        ...state,
                        selectedLanguage: itemValue.toString() as LocaleType,
                      });
                      setLanguage(itemValue.toString() as LocaleType);
                    }}>
                    <Picker.Item label={'한국어'} value={LocaleType.KO} key={0} />
                    <Picker.Item label={'English'} value={LocaleType.EN} key={1} />
                    <Picker.Item label={'简体中文'} value={LocaleType.CH} key={2} />
                  </Picker>
                </View>
              ) : (
                <TouchableOpacity
                  style={{
                    width: '100%',
                    alignItems: 'center',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    padding: 5,
                  }}
                  onPress={() => {
                    setState({ ...state, showLanguageModal: true });
                  }}>
                  <P1Text
                    label={state.selectedLanguage === LocaleType.KO ? 'ko' : state.selectedLanguage === LocaleType.EN ? 'en' : 'ch'}
                    style={{
                      textAlign: 'center',
                    }}
                  />
                </TouchableOpacity>
              )}
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignContent: 'center',
              marginTop: 20,
            }}>
            <H3Text
              label={t('more_label.currency')}
              style={{
                alignSelf: 'center',
                fontSize: 15,
              }}
            />
            <View
              style={{
                width: Platform.OS === 'android' ? 80 : 52,
                borderWidth: 1,
                borderRadius: 20,
                borderColor: AppColors.BLUE_2,
                backgroundColor: AppColors.BACKGROUND_GREY,
              }}>
              {Platform.OS === 'android' ? (
                <View style={{ padding: 5 }}>
                  <P1Text
                    style={{ position: 'absolute', textAlign: 'center', width: 80, top: 3 }}
                    label={currencyText()}
                  />
                  <Picker
                    style={{
                      opacity: 0,
                      height: 20,
                      backgroundColor: 'transparent',
                    }}
                    itemStyle={{
                      margin: 0,
                      padding: 0,
                      alignItems: 'center',
                    }}
                    accessibilityLabel={'settings'}
                    selectedValue={state.selectedCurrency}
                    onValueChange={async (itemValue) => {
                      setState({
                        ...state,
                        selectedCurrency: itemValue.toString() as CurrencyType,
                      });

                      setCurrency(itemValue.toString() as CurrencyType);
                    }}>
                    <Picker.Item
                      label={'KRW (₩)'}
                      value={CurrencyType.KRW}
                      key={0}
                    />
                    <Picker.Item
                      label={'USD ($)'}
                      value={CurrencyType.USD}
                      key={1}
                    />
                    <Picker.Item
                      label={'CNY (¥)'}
                      value={CurrencyType.CNY}
                      key={2}
                    />
                  </Picker>
                </View>
              ) : (
                <TouchableOpacity
                  style={{
                    width: '100%',
                    alignItems: 'center',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    padding: 5,
                  }}
                  onPress={() => {
                    setState({ ...state, showCurrencyModal: true });
                  }}>
                  <P1Text
                    label={currencyText()}
                    style={{
                      textAlign: 'center',
                    }}
                  />
                </TouchableOpacity>
              )}
            </View>
          </View>
          <View style={{ marginTop: 30, height: 2, backgroundColor: AppColors.BACKGROUND_GREY }} />
          <View
            style={{
              marginTop: 30,
            }}>
            <H3Text
              label={t('more_label.app_info')}
              style={{
                color: AppColors.SUB_BLACK,
              }}
            />
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 30,
              }}
              onPress={() =>
                navigation.navigate('More', {
                  screen: MorePage.WhatsNew,
                })
              }>
              <H3Text
                label={
                  t('more_label.version') +
                  ` ${config.version}`
                }
                style={{ fontSize: 15 }}
              />
            </TouchableOpacity>
            {checkLatestVersion(
              config.version,
              state.latestVersion,
            ) && (
                <TouchableOpacity
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginTop: 30,
                  }}
                  onPress={() => {
                    storeDeeplink('elysia/id1536733411', 'land.elysia');
                  }}>
                  <H3Text
                    label={t('more_label.get_latest_version', {
                      version: state.latestVersion,
                    })}
                    style={{ color: '#CC3743', fontSize: 15 }}
                  />
                  <Image
                    source={require('./images/next_gray.png')}
                    style={{
                      width: 5,
                      height: 8,
                    }}
                  />
                </TouchableOpacity>
              )}
          </View>
          <View style={{ marginTop: 30, height: 2, backgroundColor: AppColors.BACKGROUND_GREY }} />
        </View>
      </>
      <IosPickerModal
        modalVisible={state.showLanguageModal}
        doneHandler={async () => {
          setState({ ...state, showLanguageModal: false });
          setLanguage(state.selectedLanguage);
        }}
        cancelHandler={() => {
          setState({
            ...state,
            showLanguageModal: false,
          });
        }}
        buttonNumber={2}
        children={
          <Picker
            style={{
              top: 35,
            }}
            accessibilityLabel={'settings'}
            selectedValue={state.selectedLanguage?.toString()}
            onValueChange={async (itemValue) => {
              setState({
                ...state,
                selectedLanguage: itemValue.toString() as LocaleType,
              });
            }}>
            <Picker.Item label={'한국어'} value={LocaleType.KO} key={0} />
            <Picker.Item label={'English'} value={LocaleType.EN} key={1} />
            <Picker.Item label={'简体中文'} value={LocaleType.CH} key={2} />
          </Picker>
        }
      />
      <IosPickerModal
        modalVisible={state.showCurrencyModal}
        doneHandler={async () => {
          setState({ ...state, showCurrencyModal: false });
          setCurrency(state.selectedCurrency);
        }}
        cancelHandler={() => {
          setState({
            ...state,
            showCurrencyModal: false,
          });
        }}
        buttonNumber={2}
        children={
          <Picker
            style={{
              top: 35,
            }}
            accessibilityLabel={'settings'}
            selectedValue={state.selectedCurrency?.toString()}
            onValueChange={async (itemValue) => {
              setState({
                ...state,
                selectedCurrency: itemValue.toString() as CurrencyType,
              });
            }}>
            <Picker.Item label={'KRW (₩)'} value={CurrencyType.KRW} key={0} />
            <Picker.Item label={'USD ($)'} value={CurrencyType.USD} key={1} />
            <Picker.Item label={'CNY (¥)'} value={CurrencyType.CNY} key={2} />
          </Picker>
        }
      />
    </>
  );
};

export default Setting;
