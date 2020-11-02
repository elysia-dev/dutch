import React, {
  FunctionComponent,
  useState,
  useEffect,
  useContext,
} from 'react';
import { View, StyleSheet, Switch, Platform } from 'react-native';
import { Picker } from '@react-native-community/picker';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-community/async-storage';
import { useNavigation } from '@react-navigation/native';
import i18n from '../../i18n/i18n';
import { H1Text, P1Text, H3Text } from '../../shared/components/Texts';
import WrapperLayout from '../../shared/components/WrapperLayout';
import LocaleType from '../../enums/LocaleType';
import RootContext from '../../contexts/RootContext';
import disablePushNotificationsAsync from '../../utiles/disableNotificationsAsync';
import enablePushNotificationsAsync from '../../utiles/enableNotificationsAsync';

interface Props {
  resetHandler: () => void;
}

const Setting: FunctionComponent<Props> = (props: Props) => {
  const { changeLanguage, Server, user } = useContext(RootContext);
  const navigation = useNavigation();
  const [state, setState] = useState({
    hasPermission: false,
    selectedValue: '',
  });

  const initializeState = () => {
    setState({ ...state, selectedValue: i18n.currentLocale() });

    Notifications.getPermissionsAsync().then((settings) => {
      AsyncStorage.getItem('pushNotificationPermission').then((permission) => {
        if (
          settings.granted ||
          settings.ios?.status ===
            Notifications.IosAuthorizationStatus.PROVISIONAL
        ) {
          AsyncStorage.getItem('pushNotificationPermission').then((res) => {
            setState({ ...state, hasPermission: res === 'granted' });
          });
        }
      });
    });
  };

  useEffect(initializeState, []);

  const activityToggleButton = async () => {
    setState({ ...state, hasPermission: !state.hasPermission });

    if (!state.hasPermission) {
      const res = await enablePushNotificationsAsync(user.email);
      setState({ ...state, hasPermission: res });
    } else {
      await disablePushNotificationsAsync(user.email);
      setState({ ...state, hasPermission: false });
    }
  };

  const changeI18n = async (value: string) => {
    i18n.locale = value;
  };

  return (
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
                borderColor: '#D0D8DF',
                paddingRight: Platform.OS === 'android' ? 10 : 0,
              }}>
              <Picker
                style={{
                  height: Platform.OS === 'ios' ? 200 : 40,
                  marginVertical: 10,
                }}
                accessibilityLabel={'settings'}
                selectedValue={i18n.currentLocale()}
                onValueChange={async (itemValue) => {
                  changeI18n(itemValue.toString());
                  setState({ ...state, selectedValue: i18n.currentLocale() });
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
            </View>
            <View
              style={{
                height: 500,
                backgroundColor: '#F6F6F8',
              }}
            />
          </View>
        </>
      }
    />
  );
};

export default Setting;

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 5,
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
    borderRadius: 5,
    fontSize: 16,
    color: '#1C1C1C',
    justifyContent: 'center',
    alignContent: 'center',
  },
});
