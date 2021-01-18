import React, { FunctionComponent, useContext, useState } from 'react';
import { View, Dimensions, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SubmitButton } from '../../shared/components/SubmitButton';
import i18n from '../../i18n/i18n';
import RootContext from '../../contexts/RootContext';
import { H2Text, P3Text } from '../../shared/components/Texts';
import { TextField } from '../../shared/components/TextField';
import AccountLayout from '../../shared/components/AccountLayout';
import { BackButton } from '../../shared/components/BackButton';
import { SignInStatus } from '../../enums/SignInStatus';

const MembershipWithdrawl: FunctionComponent = () => {
  const { user, ownerships, signOut, Server } = useContext(RootContext);
  const navigation = useNavigation();

  const legacyOwnerships = ownerships
    .filter((ownerhsip) => ownerhsip.isLegacy)
    .map((ownership) => {
      return ownership.title;
    });

  const [password, setPassword] = useState('');

  const callApi = () => {
    Server.deleteUser(password)
      .then((_res) => {
        signOut(SignInStatus.DELETE);
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
    <AccountLayout
      title={
        <>
          <BackButton
            handler={() => navigation.goBack()}
            style={{ width: 30 }}
          />
          <H2Text label={i18n.t('more_label.leave_elysia')} />
        </>
      }
      body={
        <View
          style={{
            // paddingHorizontal: '5%',
            width: '100%',
            height: '100%',
          }}>
          <TextField
            label={i18n.t('account.insert_password')}
            eventHandler={(input: string) => setPassword(input)}
            secure={true}
            value={password}
          />
          <View
            style={{
              width: Dimensions.get('window').width * 0.9,
              height: 'auto',
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
                  marginVertical: 10,
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
            {(user.legacyEl > 0 || user.legacyUsd > 0) && (
              <View
                style={{
                  marginVertical: 10,
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
                marginVertical: 10,
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
                marginVertical: 10,
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
