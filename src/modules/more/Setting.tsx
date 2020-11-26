import React, {
  FunctionComponent,
  useState,
  useContext,
  useEffect,
} from 'react';
import { View, Switch, Platform, TouchableOpacity, Alert } from 'react-native';

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

interface Props {
  resetHandler: () => void;
}

const Setting: FunctionComponent<Props> = (props: Props) => {
  const {
    changeLanguage,
    Server,
    user,
    signOut,
    setUserExpoPushToken,
    expoPushToken,
  } = useContext(RootContext);
  const navigation = useNavigation();
  const [state, setState] = useState({
    hasPermission: user.expoPushTokens?.includes(expoPushToken),
    selectedValue: i18n.currentLocale(),
    showPickerModal: false,
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

  const confirmSignOut = () => {
    Alert.alert(
      i18n.t('more_label.logout'),
      i18n.t('more.confirm_logout'),
      [
        {
          text: 'Cancel',
          onPress: () => {},
          style: 'cancel',
        },
        { text: 'OK', onPress: signOut, style: 'default' },
      ],
      { cancelable: false },
    );
  };

  return (
    <>
      <WrapperLayout
        isScrolling={false}
        backButtonHandler={() => {
          navigation.goBack();
        }}
        title={i18n.t('more_label.app_setting')}
        body={
          <>
            <View
              style={{
                paddingBottom: 20,
                borderBottomWidth: 5,
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
                <P1Text
                  label={
                    i18n.t('more_label.version') +
                    ` ${getEnvironment().version}`
                  }
                  style={{
                    marginTop: 30,
                    paddingLeft: '5%',
                  }}
                />
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
                        selectedValue: i18n.currentLocale(),
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
                      setState({ ...state, showPickerModal: true });
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
              <View
                style={{
                  height: 500,
                  backgroundColor: '#F6F6F8',
                  paddingHorizontal: '5%',
                  paddingTop: 25,
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
      {state.showPickerModal && (
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
        modalVisible={state.showPickerModal}
        doneHandler={async () => {
          changeI18n(state.selectedValue);
          await Server.resetLanguage(i18n.currentLocale()).catch((e) => {
            alert(i18n.t('account_errors.server'));
          });
          changeLanguage(i18n.currentLocale() as LocaleType);
          setState({ ...state, showPickerModal: false });
        }}
        cancelHandler={() => {
          setState({
            ...state,
            selectedValue: i18n.currentLocale(),
            showPickerModal: false,
          });
        }}
        buttonNumber={2}
        children={
          <Picker
            style={{
              top: 35,
            }}
            accessibilityLabel={'settings'}
            selectedValue={state.selectedValue}
            onValueChange={async (itemValue) => {
              setState({
                ...state,
                selectedValue: itemValue.toString(),
              });
            }}>
            <Picker.Item label={'한국어'} value="ko" key={0} />
            <Picker.Item label={'English'} value="en" key={1} />
            <Picker.Item label={'简体中文'} value="zhHans" key={2} />
          </Picker>
        }
      />
    </>
  );
};

export default Setting;
