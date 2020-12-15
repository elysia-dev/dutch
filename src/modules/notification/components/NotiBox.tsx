import React, { FunctionComponent, useContext } from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import i18n from '../../../i18n/i18n';
import NotificationType from '../../../enums/NotificationType';
import images from '../Images';
import Notification from '../../../types/Notification';
import { DashboardPage } from '../../../enums/pageEnum';
import { P3Text, P1Text } from '../../../shared/components/Texts';
import RootContext from '../../../contexts/RootContext';

interface Props {
  notification: Notification;
  readNotification: (notification: Notification) => void;
}

const NotiBox: FunctionComponent<Props> = (props: Props) => {
  const { currencyExchange } = useContext(RootContext);

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
  const width = [15, 15, 20, 15, 15, 15, 15, 15, 15, 15];
  const height = [17, 17, 18.5, 17, 17, 17, 17, 17, 17, 17];
  const left = [0, 0, -1, 0, 0, 0, 0, 0, 0, 0];
  const status = props.notification.status;
  const data = props.notification.data;
  const navigation = useNavigation();

  return (
    <View
      style={{
        backgroundColor: '#fff',
        width: '100%',
        flex: 1,
        marginBottom: 40,
      }}>
      <TouchableOpacity
        onPress={() => {
          props.readNotification(props.notification);
          if (type === NotificationType.PRODUCT_NOTICE) {
            navigation.navigate('Dashboard', {
              screen: DashboardPage.ProductNotice,
              params: { productId: data.productId },
            });
          }
        }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View style={{ flex: 1 }}>
            <Image
              style={{
                width: 20,
                height: 20,
                marginTop: -3,
              }}
              source={images[typeId()][status === 'read' ? 0 : 1]}
            />
          </View>
          <View style={{ flex: 10, flexDirection: 'column' }}>
            <P3Text
              style={{
                color: status === 'read' ? '#A7A7A7' : '#4e4e4e',
                fontSize: 13,
                marginBottom: 6,
              }}
              label={i18n.t(`notification_label.${type}`)}
            />
            <P1Text
              style={{
                color: status === 'read' ? '#A7A7A7' : '#1c1c1c',
                fontFamily:
                  status === 'read' ? 'Roboto_400Regular' : 'Roboto_700Bold',
                marginBottom: 6,
              }}
              label={i18n.t(`notification.${type}`, {
                month: data.month,
                week: data.week,
                device: data.message,
                profit: currencyExchange(parseFloat(data.message), 4),
              })}
            />
            {type === NotificationType.FAIL_KYC && (
              <P1Text
                style={{
                  fontSize: 13,
                  textAlign: 'left',
                  marginBottom: 6,
                  color: status === 'read' ? '#A7A7A7' : '#4e4e4e',
                }}
                label={`- ${data.message}`}
              />
            )}
            <P3Text
              style={{
                color: status === 'read' ? '#A7A7A7' : '#4e4e4e',
                fontSize: 13,
                marginBottom: 6,
              }}
              label={i18n.strftime(
                new Date(props.notification.createdAt),
                i18n.t('notification_label.date_format'),
              )}
            />
          </View>
          <View
            style={{
              flex: 1,
              alignContent: 'center',
              justifyContent: 'center',
            }}>
            {type === NotificationType.PRODUCT_NOTICE && (
              <Image
                style={{ width: 6, height: 9 }}
                source={images[9][status === 'read' ? 0 : 1]}
              />
            )}
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default NotiBox;
