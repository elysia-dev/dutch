import React, { FunctionComponent } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import { useNavigation } from '@react-navigation/native';
import i18n from '../../../i18n/i18n';
import NotificationType from '../../../enums/NotificationType';
import images from '../Images';
import Notification from '../../../types/Notification';
import { DashboardPage } from '../../../enums/pageEnum';

interface Props {
  notification: Notification;
  readNotification: (notification: Notification) => void;
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

const NotiBox: FunctionComponent<Props> = (props: Props) => {
  const type = props.notification.notificationType;
  const typeId = () => {
    switch (type) {
      case 'closeOwnership':
        return 0;
      case 'elysiaNotice':
        return 1;
      case 'failKyc':
        return 2;
      case 'monthlyReport':
        return 3;
      case 'newDevice':
        return 4;
      case 'productNotice':
        return 5;
      case 'profit':
        return 6;
      case 'successKyc':
        return 7;
      case 'weeklyReport':
        return 8;
      default:
        return 0;
    }
  };
  const status = props.notification.status;
  const data = props.notification.data;
  const navigation = useNavigation();

  return (
    <View
      style={{
        backgroundColor: '#fff',
        width: '100%',
        height: 120,
      }}>
      <TouchableOpacity
        onPress={() => {
          props.readNotification(props.notification);
          if (type === NotificationType.PRODUCT_NOTICE) {
            navigation.navigate('Dashboard', { screen: DashboardPage.ProductNotice, params: { productId: data.productId } });
          }
        }
        }>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View style={{ flex: 1 }}>
            <Image
              style={{ resizeMode: 'center', width: typeId() === 2 ? 15 : 13, height: typeId() === 2 ? 18.5 : 17, left: typeId() === 2 ? -1 : 0 }}
              source={images[typeId()][status === 'read' ? 0 : 1]}
            />
          </View>
          <View style={{ flex: 10, flexDirection: 'column' }}>
            <TypeDateText
              style={{ color: status === 'read' ? '#A7A7A7' : '#4e4e4e' }}>
              {i18n.t(`notification_label.${type}`)}
            </TypeDateText>
            <TitleText
              style={{
                color: status === 'read' ? '#A7A7A7' : '#1c1c1c',
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
            {
              type === NotificationType.PRODUCT_NOTICE
              && (
                <Image
                  style={{ resizeMode: 'center', width: 6, height: 9 }}
                  source={images[9][status === 'read' ? 0 : 1]}
                />
              )}
          </View>
        </View>
      </TouchableOpacity>
    </View >
  );
};

export default NotiBox;
