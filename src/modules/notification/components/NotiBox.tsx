import React, { FunctionComponent } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import i18n from '../../../i18n/i18n';
import styled from 'styled-components/native';
import Api, { NotificationResponse } from '../../../api/notification';
import NotificationType from '../../../enums/NotificationType';
import { useNavigation } from '@react-navigation/native';

interface Props {
  notification: NotificationResponse;
}

const TypeDateText = styled.Text`
  font-size: 13px;
  text-align: left;
  margin-bottom: 6px;
`;
const TitleText = styled.Text`
  font-size: 15px;
  text-align: left;

  margin-bottom: 6px;
`;

const callApi = (id: number) => {
  Api.read(id)
    .then()
    .catch(e => {
      if (e.response.status === 500) {
        alert(i18n.t('errors.server.duplicate_email'));
      }
    });
};

export const NotiBox: FunctionComponent<Props> = (props: Props) => {
  const type = props.notification.notificationType;
  const status = props.notification.status;
  const data = props.notification.data;
  return (
    <View
      style={{
        backgroundColor: '#fff',
        width: '100%',
        height: 120,
      }}>
      <TouchableOpacity onPress={() => callApi(props.notification.id)}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View style={{ flex: 1 }}>
            <Image
              style={{ resizeMode: 'center', width: 13, height: 17 }}
              // source={require(`../images/${type}_${status}.png`)}
            />
          </View>
          <View style={{ flex: 10, flexDirection: 'column' }}>
            <TypeDateText
              style={{ color: status === 'read' ? '#A7A7A7' : '#4e4e4e' }}>
              {i18n.t(`notification_label.${type}`)}
            </TypeDateText>
            <TitleText
              style={{
                color: status === 'read' ? '#A7A7A7' : '1c1c1c',
                fontWeight: status === 'read' ? 'normal' : 'bold',
              }}>
              {i18n.t(`notification.${type}`, {
                month: data.month,
                week: data.week,
                device: data.message,
                profit: data.message,
              })}
            </TitleText>
            {type === NotificationType.FAIL_KYC && (
              <Text
                style={{
                  fontSize: 13,
                  textAlign: 'left',

                  marginBottom: 6,
                  color: status === 'read' ? '#A7A7A7' : '#4e4e4e',
                }}>
                {`- ${data.message}`}
              </Text>
            )}
            <TypeDateText
              style={{ color: status === 'read' ? '#A7A7A7' : '#4e4e4e' }}>
              {i18n.strftime(
                new Date(props.notification.createdAt),
                i18n.t('notification_label.date_format'),
              )}
            </TypeDateText>
          </View>
          <View
            style={{
              flex: 1,
              alignContent: 'center',
              justifyContent: 'center',
            }}>
            {!(
              type === NotificationType.PROFIT ||
              type === NotificationType.SUCCESS_KYC ||
              type === NotificationType.NEW_DEVICE
            ) && (
              <Image
                style={{ resizeMode: 'center', width: 6, height: 9 }}
                // source={require(`../images/next_${props.notification.status}.png`)}
              />
            )}
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};
