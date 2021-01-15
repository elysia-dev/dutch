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
  Alert,
  Image,
} from 'react-native';

import { Picker } from '@react-native-community/picker';
import { useNavigation } from '@react-navigation/native';
import * as Notifications from 'expo-notifications';
import i18n from '../../i18n/i18n';
import { P1Text, H3Text } from '../../shared/components/Texts';
import WrapperLayout from '../../shared/components/WrapperLayout';
import LocaleType from '../../enums/LocaleType';
import RootContext from '../../contexts/RootContext';
import { SubmitButton } from '../../shared/components/SubmitButton';
import registerForPushNotificationsAsync from '../../utiles/registerForPushNotificationsAsync';
import getEnvironment from '../../utiles/getEnvironment';
import IosPickerModal from '../../shared/components/IosPickerModal';
import { MorePage } from '../../enums/pageEnum';
import CurrencyType from '../../enums/CurrencyType';
import SignInStatus from '../../enums/SignInStatus';

interface Props {
  resetHandler: () => void;
}

const Setting: FunctionComponent<Props> = (props: Props) => {
  const {
    changeLanguage,
    changeCurrency,
    Server,
    user,
    signOut,
    setUserExpoPushToken,
    expoPushToken,
  } = useContext(RootContext);
  const navigation = useNavigation();
  const [state, setState] = useState({
    hasPermission: user.expoPushTokens?.includes(expoPushToken),
    selectedLanguage: i18n.currentLocale(),
    selectedCurrency: user.currency,
    showLanguageModal: false,
    showCurrencyModal: false,
  });

  useEffect(() => {
    Notifications.getExpoPushTokenAsync().then((token) => {
      setState({
        ...state,
        hasPermission: user.expoPushTokens?.includes(token.data),
      });
    });
  }, []);

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
      return '한국어';
    } else if (i18n.currentLocale() === LocaleType.CH) {
      return '简体中文';
    } else {
      return 'English';
    }
  };

  const currencyText = () => {
    if (user.currency === CurrencyType.KRW) {
      return 'KRW (₩)';
    } else if (user.currency === CurrencyType.CNY) {
      return 'CNY (¥)';
    } else {
      return 'USD ($)';
    }
  };

  const confirmSignOut = () => {
    Alert.alert(
      i18n.t('more_label.logout'),
      i18n.t('more.confirm_logout'),
      [
        {
          text: 'Cancel',
          onPress: () => { },
          style: 'cancel',
        },
        { text: 'OK', onPress: () => { signOut(SignInStatus.SIGNOUT) }, style: 'default' },
      ],
      { cancelable: false },
    );
  };

  return (
    <>
      <WrapperLayout
        isScrolling={true}
        backButtonHandler={() => {
          navigation.goBack();
        }}
        title={i18n.t('more_label.app_setting')}
        body={
          <>
            <View
              style={{
                // paddingBottom: 20,
                // borderBottomWidth: 5,
                borderBottomColor: '#F6F6F8',
                top: 22,
              }}>
              <H3Text
                label={i18n.t('more_label.notification_setting')}
                style={{
                  paddingLeft: '5%',
                  paddingRight: '5%',
                  fontSize: 18,
                }}
              />
              <View
                style={{
                  paddingTop: 30,
                  paddingBottom: 20,
                  marginBottom: 30,
                  borderBottomWidth: 5,
                  borderBottomColor: '#F6F6F8',
                }}>
                <View
                  style={{
                    paddingLeft: '5%',
                    paddingRight: '5%',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignContent: 'center',
                  }}>
                  <P1Text
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
              <View
                style={{
                  paddingBottom: 20,
                  marginBottom: 30,
                  borderBottomWidth: 5,
                  borderBottomColor: '#F6F6F8',
                }}>
                <H3Text
                  label={i18n.t('more_label.app_info')}
                  style={{
                    paddingLeft: '5%',
                    fontSize: 18,
                  }}
                />
                <TouchableOpacity
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginTop: 30,
                    paddingLeft: '5%',
                    paddingRight: '5%',
                  }}
                  onPress={() =>
                    navigation.navigate('More', {
                      screen: MorePage.WhatsNew,
                    })
                  }>
                  <P1Text
                    label={
                      i18n.t('more_label.version') +
                      ` ${getEnvironment().version}`
                    }
                  />
                  <Image
                    source={require('./images/next_gray.png')}
                    style={{
                      width: 5,
                      height: 8,
                    }}
                  />
                </TouchableOpacity>
              </View>
              <H3Text
                label={i18n.t('more_label.language')}
                style={{
                  paddingLeft: '5%',
                  fontSize: 18,
                }}
              />
              <View
                style={{
                  marginVertical: 20,
                  marginHorizontal: '5%',
                  borderWidth: 1,
                  borderRadius: 5,
                  paddingLeft: 10,
                  borderColor: '#D0D8DF',
                  paddingRight: Platform.OS === 'android' ? 10 : 0,
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
                      await Server.resetLanguage(i18n.currentLocale()).catch(
                        (e) => {
                          alert(i18n.t('account_errors.server'));
                        },
                      );
                      changeLanguage(i18n.currentLocale() as LocaleType);
                    }}>
                    <Picker.Item label={'한국어'} value="ko" key={0} />
                    <Picker.Item label={'English'} value="en" key={1} />
                    <Picker.Item label={'简体中文'} value="zhHans" key={2} />
                  </Picker>
                ) : (
                    <TouchableOpacity
                      style={{
                        width: '100%',
                        height: 40,
                        backgroundColor: '#fff',
                        borderRadius: 5,
                        alignItems: 'center',
                        flexDirection: 'row',
                        justifyContent: 'center',
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
              <H3Text
                label={i18n.t('more_label.currency')}
                style={{
                  paddingLeft: '5%',
                  fontSize: 18,
                }}
              />
              <View
                style={{
                  marginVertical: 20,
                  marginBottom: 40,
                  marginHorizontal: '5%',
                  borderWidth: 1,
                  borderRadius: 5,
                  paddingLeft: 10,
                  borderColor: '#D0D8DF',
                  paddingRight: Platform.OS === 'android' ? 10 : 0,
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
                      await Server.resetCurrency(itemValue as string).catch(
                        (e) => {
                          alert(i18n.t('account_errors.server'));
                        },
                      );
                      changeCurrency(itemValue as CurrencyType);
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
                        height: 40,
                        backgroundColor: '#fff',
                        borderRadius: 5,
                        alignItems: 'center',
                        flexDirection: 'row',
                        justifyContent: 'center',
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
              <View
                style={{
                  height: 125,
                  backgroundColor: '#F6F6F8',
                  paddingHorizontal: '5%',
                  paddingTop: 25,
                  paddingBottom: 25,
                }}>
                <SubmitButton
                  title={i18n.t('more_label.logout')}
                  handler={confirmSignOut}
                  style={{
                    width: '100%',
                    alignSelf: 'center',
                    backgroundColor: '#767577',
                  }}
                />
              </View>
            </View>
          </>
        }
      />
      {(state.showLanguageModal || state.showCurrencyModal) && (
        <View
          style={{
            backgroundColor: 'rgba(0,0,0,0.3)',
            position: 'absolute',
            width: '100%',
            height: '100%',
          }}
        />
      )}
      <IosPickerModal
        modalVisible={state.showLanguageModal}
        doneHandler={async () => {
          changeI18n(state.selectedLanguage);
          await Server.resetLanguage(i18n.currentLocale()).catch((e) => {
            alert(i18n.t('account_errors.server'));
          });
          changeLanguage(i18n.currentLocale() as LocaleType);
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
          await Server.resetCurrency(state.selectedCurrency).catch((e) => {
            alert(i18n.t('account_errors.server'));
          });
          changeCurrency(state.selectedCurrency);
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
