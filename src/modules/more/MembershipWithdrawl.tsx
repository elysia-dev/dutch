import React, { FunctionComponent, useContext, useState } from 'react';
import { View, Dimensions, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SubmitButton } from '../../shared/components/SubmitButton';
import i18n from '../../i18n/i18n';
import RootContext from '../../contexts/RootContext';
import { P3Text } from '../../shared/components/Texts';
import WrapperLayout from '../../shared/components/WrapperLayout';
import { TextField } from '../../shared/components/TextField';
import LocaleType from '../../enums/LocaleType';

const MembershipWithdrawl: FunctionComponent = () => {
  const { user, ownerships, autoSignOut, Server } = useContext(RootContext);
  const navigation = useNavigation();

  const legacyOwnerships = ownerships
    .filter((ownerhsip, index) => ownerhsip.isLegacy)
    .map((ownership, index) => {
      return ownership.title;
    });

  const [password, setPassword] = useState('');

  const callApi = () => {
    Server.deleteUser(password)
      .then((_res) => {
        autoSignOut(true);
      })
      .catch((e) => {
        if (e.response.status === 400) {
          alert(i18n.t('account_errors.password_do_not_match'));
        }
      });
  };

  const confirmWithdrawl = () => {
    Alert.alert(
      i18n.t('more_label.account_withdrawl'),
      i18n.t('more.withdrawl_confirm'),
      [
        {
          text: 'Cancel',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: callApi,
          style: 'default',
        },
      ],
      { cancelable: false },
    );
  };

  return (
    <WrapperLayout
      isScrolling={false}
      title={i18n.t('more_label.leave_elysia')}
      backButtonHandler={() => navigation.goBack()}
      body={
        <View
          style={{
            paddingHorizontal: '5%',
            width: '100%',
            height: '100%',
          }}>
          <View
            style={{
              width: Dimensions.get('window').width * 0.9,
              height: user.language === LocaleType.EN ? 330 : 240,
              flexDirection: 'column',
              padding: 20,
              backgroundColor: '#fff',
              elevation: 6,
              shadowColor: '#1C1C1C4D',
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.5,
              shadowRadius: 4,
              borderRadius: 10,
              marginTop: 20,
              top: 0,
              position: 'relative',
              marginBottom: 40,
            }}>
            {legacyOwnerships.length > 0 && (
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <P3Text
                  label={'*  '}
                  style={{
                    color: '#CC3743',
                  }}
                />
                <P3Text
                  label={i18n.t('more.withdrawl_check_1', { legacyOwnerships })}
                  style={{ color: '#1C1C1C', lineHeight: 18 }}
                />
              </View>
            )}
            {(user.legacyEl || user.legacyUsd) && (
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <P3Text
                  label={'*  '}
                  style={{
                    color: '#CC3743',
                  }}
                />
                <P3Text
                  label={i18n.t('more.withdrawl_check_2', {
                    legacyEl: user.legacyUsd,
                    legacyUsd: user.legacyUsd,
                  })}
                  style={{ color: '#1C1C1C', lineHeight: 18 }}
                />
              </View>
            )}
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <P3Text
                label={'*  '}
                style={{
                  color: '#CC3743',
                }}
              />
              <P3Text
                label={i18n.t('more.withdrawl_check_3')}
                style={{ color: '#1C1C1C', lineHeight: 18 }}
              />
            </View>
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <P3Text
                label={'*  '}
                style={{
                  color: '#CC3743',
                }}
              />
              <P3Text
                label={i18n.t('more.withdrawl_check_4')}
                style={{ color: '#1C1C1C', lineHeight: 18 }}
              />
            </View>
          </View>
          <TextField
            label={i18n.t('account.insert_password')}
            eventHandler={(input: string) => setPassword(input)}
            secure={true}
            value={password}
          />
        </View>
      }
      button={
        <SubmitButton
          title={i18n.t('more_label.agree_withdrawl')}
          handler={confirmWithdrawl}
          style={{
            backgroundColor: password ? '#3679B5' : '#D0D8DF',
          }}
          disabled={!password}
        />
      }
    />
  );
};

export default MembershipWithdrawl;