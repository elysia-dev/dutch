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
import i18n from '../../i18n/i18n';
import { P1Text, H3Text, H4Text } from '../../shared/components/Texts';
import LocaleType from '../../enums/LocaleType';
import registerForPushNotificationsAsync from '../../utiles/registerForPushNotificationsAsync';
import getEnvironment from '../../utiles/getEnvironment';
import IosPickerModal from '../../shared/components/IosPickerModal';
import { MorePage } from '../../enums/pageEnum';
import CurrencyType from '../../enums/CurrencyType';
import storeDeeplink from '../../utiles/storeDeeplink';
import checkLatestVersion from '../../utiles/checkLatestVersion';
import ProviderType from '../../enums/ProviderType';
import UserContext from '../../contexts/UserContext';
import FunctionContext from '../../contexts/FunctionContext';
import AppColors from '../../enums/AppColors';

const Setting: FunctionComponent = () => {
  const { user, expoPushToken } = useContext(UserContext);
  const {
    setLanguage,
    setCurrency,
    Server,
    setUserExpoPushToken,
  } = useContext(FunctionContext);
  const navigation = useNavigation();
  const [state, setState] = useState({
    hasPermission: user.expoPushTokens?.includes(expoPushToken),
    selectedLanguage: i18n.currentLocale(),
    selectedCurrency: user.currency,
    showLanguageModal: false,
    showCurrencyModal: false,
    latestVersion: getEnvironment().version,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const token = await Notifications.getExpoPushTokenAsync();
      const version = await Server.checkLatestVersion(Platform.OS);
      setState({
        ...state,
        hasPermission: user.expoPushTokens?.includes(token.data),
        latestVersion: version.data,
      });
    } catch (e) {
      if (e.response.status === 500) {
        alert(i18n.t('account_errors.server'));
      }
    }
  };

  const activityToggleButton = async () => {
    setState({ ...state, hasPermission: !state.hasPermission });

    if (!state.hasPermission) {
      registerForPushNotificationsAsync().then((expoPushToken) => {
        if (expoPushToken) {
          Server.registerExpoPushToken(expoPushToken);
          setUserExpoPushToken(expoPushToken);
        }
      });
    } else {
      Notifications.getExpoPushTokenAsync().then((token) => {
        Server.deleteExpoPushToken(token.data);
        setUserExpoPushToken('');
      });
    }
  };

  const changeI18n = async (value: string) => {
    i18n.locale = value;
  };

  const localeText = () => {
    if (i18n.currentLocale() === LocaleType.KO) {
      return 'ko';
    } else if (i18n.currentLocale() === LocaleType.CH) {
      return 'ch';
    } else {
      return 'en';
    }
  };

  const currencyText = () => {
    if (user.currency === CurrencyType.KRW) {
      return '₩';
    } else if (user.currency === CurrencyType.CNY) {
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
            // paddingBottom: 20,
            // borderBottomWidth: 5,
            borderBottomColor: '#F6F6F8',
            top: 22,
          }}>
          <H3Text
            label={i18n.t('more_label.app_setting')}
            style={{ color: AppColors.BLACK2 }}
          />
          {
            user.provider !== ProviderType.GUEST && <View>
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
                  <H4Text
                    label={i18n.t('more_label.push_notice')}
                    style={{
                      alignSelf: 'center',
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
              marginTop: 20
            }}>
            <H4Text
              label={i18n.t('more_label.language')}
              style={{
                alignSelf: 'center',
              }}
            />
            <View
              style={{
                width: 52,
                borderWidth: 1,
                borderRadius: 20,
                borderColor: AppColors.BLUE_2,
                backgroundColor: AppColors.BACKGROUND_GREY,
              }}>
              {Platform.OS === 'android' ? (
                <Picker
                  style={{
                    height: 30,
                    marginVertical: 10,
                    padding: 0,
                  }}
                  accessibilityLabel={'settings'}
                  selectedValue={i18n.currentLocale()}
                  onValueChange={async (itemValue) => {
                    changeI18n(itemValue.toString());
                    setState({
                      ...state,
                      selectedLanguage: i18n.currentLocale(),
                    });

                    if (user.provider !== ProviderType.GUEST) {
                      await Server.resetLanguage(i18n.currentLocale()).catch(
                        (e) => {
                          alert(i18n.t('account_errors.server'));
                        },
                      );
                    }
                    setLanguage(i18n.currentLocale() as LocaleType);
                  }}>
                  <Picker.Item label={'한국어'} value="ko" key={0} />
                  <Picker.Item label={'English'} value="en" key={1} />
                  <Picker.Item label={'简体中文'} value="zhHans" key={2} />
                </Picker>
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
                    label={localeText()}
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
              marginTop: 20
            }}>
            <H4Text
              label={i18n.t('more_label.currency')}
              style={{
                alignSelf: 'center',
              }}
            />
            <View
              style={{
                width: 52,
                borderWidth: 1,
                borderRadius: 20,
                borderColor: AppColors.BLUE_2,
                backgroundColor: AppColors.BACKGROUND_GREY,
              }}>
              {Platform.OS === 'android' ? (
                <Picker
                  style={{
                    height: 30,
                    marginVertical: 10,
                    padding: 0,
                  }}
                  accessibilityLabel={'settings'}
                  selectedValue={state.selectedCurrency}
                  onValueChange={async (itemValue) => {
                    setState({
                      ...state,
                      selectedCurrency: itemValue as CurrencyType,
                    });

                    if (user.provider !== ProviderType.GUEST) {
                      await Server.resetCurrency(itemValue as string).catch(
                        (e) => {
                          alert(i18n.t('account_errors.server'));
                        },
                      );
                    }

                    setCurrency(itemValue as CurrencyType);
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
              label={i18n.t('more_label.app_info')}
              style={{
                color: AppColors.SUB_BLACK
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
              <H4Text
                label={
                  i18n.t('more_label.version') +
                  ` ${getEnvironment().version}`
                }
              />
            </TouchableOpacity>
            {checkLatestVersion(
              getEnvironment().version,
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
                    label={i18n.t('more_label.get_latest_version', {
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
          changeI18n(state.selectedLanguage);

          if (user.provider !== ProviderType.GUEST) {
            await Server.resetLanguage(i18n.currentLocale()).catch((e) => {
              alert(i18n.t('account_errors.server'));
            });
          }

          setLanguage(i18n.currentLocale() as LocaleType);
          setState({ ...state, showLanguageModal: false });
        }}
        cancelHandler={() => {
          setState({
            ...state,
            selectedLanguage: i18n.currentLocale(),
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
            selectedValue={state.selectedLanguage}
            onValueChange={async (itemValue) => {
              setState({
                ...state,
                selectedLanguage: itemValue.toString(),
              });
            }}>
            <Picker.Item label={'한국어'} value="ko" key={0} />
            <Picker.Item label={'English'} value="en" key={1} />
            <Picker.Item label={'简体中文'} value="zhHans" key={2} />
          </Picker>
        }
      />
      <IosPickerModal
        modalVisible={state.showCurrencyModal}
        doneHandler={async () => {
          if (user.provider !== ProviderType.GUEST) {
            await Server.resetCurrency(state.selectedCurrency).catch((e) => {
              alert(i18n.t('account_errors.server'));
            });
          }

          setCurrency(state.selectedCurrency);
          setState({ ...state, showCurrencyModal: false });
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
            selectedValue={state.selectedCurrency}
            onValueChange={async (itemValue) => {
              setState({
                ...state,
                selectedCurrency: itemValue as CurrencyType,
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
