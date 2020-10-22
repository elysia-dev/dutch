import React, { FunctionComponent, useState, useEffect, useContext } from 'react';
import { View, StyleSheet, Switch, Platform, Text } from 'react-native';
import { Picker } from '@react-native-community/picker';
import * as Permissions from 'expo-permissions';
import { Notifications } from 'expo';
import AsyncStorage from '@react-native-community/async-storage';
import RNPickerSelect, { Item } from 'react-native-picker-select';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';
import i18n from '../../i18n/i18n';
import { H1Text, P1Text, H3Text } from '../../shared/components/Texts';
import WrapperLayout from '../../shared/components/WrapperLayout';
import LocaleType from '../../enums/LocaleType';
import RootContext from '../../contexts/RootContext';

interface Props {
  resetHandler: () => void;
}

const Setting: FunctionComponent<Props> = (props: Props) => {
  const { changeLanguage, Server } = useContext(RootContext);
  const navigation = useNavigation();
  const [state, setState] = useState({
    hasPermission: false,
    selectedValue: '',
  });
  const initializeState = () => {
    setState({ ...state, selectedValue: i18n.currentLocale() });
    Permissions.getAsync(Permissions.NOTIFICATIONS).then(
      status => {
        if (status.granted) {
          setState({ ...state, hasPermission: true });
        }
      },
    );
  };

  useEffect(
    initializeState,
    []);

  const activityToggleButton = () => {
    setState({ ...state, hasPermission: !state.hasPermission });

    if (!state.hasPermission) {
      enablePushNotificationsAsync();
    } else {
      disablePushNotificationsAsync();
    }
  };
  const enablePushNotificationsAsync = async () => {
    const { status } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
    if (status === 'granted') {
      await AsyncStorage.setItem('pushNotificationPermission', "granted");
    } else {
      alert('Sorry, we need notification permissions to make this work!');
      setState({ ...state, hasPermission: false });
      disablePushNotificationsAsync();
    }
  };
  const disablePushNotificationsAsync = async () => {
    await AsyncStorage.setItem('pushNotificationPermission', "denied");
  };
  const changeI18n = async (value: string) => {
    i18n.locale = value;
    // await AsyncStorage.setItem('i18nLanguage', value);
  };
  const TermListIos = [
    {
      label: "한국어",
      value: 'ko',
    },
    {
      label: "English",
      value: 'en',
    },
    // {
    //   label: "简体中文",
    //   value: 'zhHans',
    // },
  ];

  // eslint-disable-next-line no-nested-ternary
  const currentTermNum = i18n.currentLocale() === LocaleType.KO ?
    0 : i18n.currentLocale() === LocaleType.EN ? 1 : 2;

  const currentTermListIos = [TermListIos[currentTermNum]]
    .concat(TermListIos.filter(term => term.value !== i18n.currentLocale()));


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
            <H3Text label={i18n.t('more_label.notification_setting')}
              style={{
                paddingLeft: '5%',
                paddingRight: '5%',
                fontSize: 18,
              }}/>
            <View
              style={{
                paddingTop: 30,
                paddingBottom: 20,
                marginBottom: 30,
                borderBottomWidth: 5,
                borderBottomColor: '#F6F6F8',
              }}>
              <View style={{
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
            <H3Text label={i18n.t('more_label.language')}
              style={{
                paddingLeft: '5%',
                fontSize: 18,
                marginBottom: 24,
              }}/>
            <View style={{
              marginLeft: '5%',
              marginRight: '5%',
              marginBottom: 10,
            }}>
              <View
                style={{
                  borderColor: '#d6d6d8',
                  borderWidth: 1,
                  borderStyle: 'solid',
                  borderRadius: 5,
                  height: 50,
                  marginBottom: 20,
                  marginTop: 10,
                  paddingHorizontal: 15,
                }}>
                {Platform.OS === 'android' ? (
                  <Picker
                    selectedValue={state.selectedValue}
                    onValueChange={async (itemValue) => {
                      changeI18n(itemValue.toString());
                      setState({ ...state, selectedValue: i18n.currentLocale() });
                      await Server.resetLanguage(i18n.currentLocale()).catch(e => { alert(i18n.t('account_errors.server')); });
                      changeLanguage(i18n.currentLocale() as LocaleType);
                    }}
                  >
                    <Picker.Item label={"한국어"} value="ko" key={0} />
                    <Picker.Item label={"English"} value="en" key={1} />
                    {/* <Picker.Item label={"简体中文"} value="zhHans" key={2} /> */}
                  </Picker>
                ) : (
                    <RNPickerSelect
                      style={pickerSelectStyles}
                      onClose={async () => {
                        await Server.resetLanguage(i18n.currentLocale()).catch(e => { alert(i18n.t('account_errors.server')); });
                        changeLanguage(i18n.currentLocale() as LocaleType);
                      }
                      }
                      onValueChange={(itemValue) => {
                        changeI18n(itemValue);
                      }}
                      items={currentTermListIos}
                      placeholder={{}}
                    />
                )}
              </View>
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
