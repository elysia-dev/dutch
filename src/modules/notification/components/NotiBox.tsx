import React, { FunctionComponent, useContext, useState } from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import NotificationType from '../../../enums/NotificationType';
import images from '../Images';
import Notification from '../../../types/Notification';
import { DashboardPage, MorePage, Page } from '../../../enums/pageEnum';
import { P3Text, P1Text, P4Text } from '../../../shared/components/Texts';
import NotificationStatus from '../../../enums/NotificationStatus';
import UserContext from '../../../contexts/UserContext';
import PreferenceContext from '../../../contexts/PreferenceContext';
import AppFonts from '../../../enums/AppFonts';
import getTxScanLink from '../../../utiles/getTxScanLink';
import NetworkType from '../../../enums/NetworkType';

interface Props {
  notification: Notification;
  readNotification: (notification: Notification) => void;
}

const NotiBox: FunctionComponent<Props> = (props: Props) => {
  const { currencyFormatter } = useContext(PreferenceContext);
  const { notifications, setNotifications } = useContext(UserContext);
  const [showTx, setShowTx] = useState(false);
  const { t } = useTranslation();

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
  const isTransactionNoti = [
    NotificationType.PENDING_TRANSACTION,
    NotificationType.INCREASE_OWNERSHIP,
    NotificationType.DECREASE_OWNERSHIP,
    NotificationType.WITHDRAW_INTEREST,
  ].includes(type);

  const navigate = () => {
    switch (type) {
      case NotificationType.PRODUCT_NOTICE:
        navigation.navigate(Page.Dashboard, {
          screen: DashboardPage.ProductNotice,
          params: { productId: data.productId },
        });
        break;
      case NotificationType.ONBOARDING_CONNECT_WALLET:
        navigation.navigate(Page.More, {
          screen: MorePage.RegisterEthAddress,
        });
        break;
      case NotificationType.ONBOARDING_NEW_USER:
        navigation.navigate(Page.Dashboard, {
          screen: DashboardPage.InvestmentGuide,
        });
        break;
      default:
        break;
    }
  };

  const readNotificationForEachType = () => {
    if (
      !(
        type === NotificationType.PENDING_TRANSACTION ||
        type === NotificationType.ONBOARDING_NEW_USER ||
        type === NotificationType.ONBOARDING_CONNECT_WALLET
      )
    ) {
      props.readNotification(props.notification);
    } else if (
      type === NotificationType.ONBOARDING_NEW_USER ||
      type === NotificationType.ONBOARDING_CONNECT_WALLET
    ) {
      setNotifications(
        notifications.map((notification, _index) => ({
          ...notification,
          status:
            notification.status === NotificationStatus.READ ||
              notification.id === props.notification.id
              ? NotificationStatus.READ
              : NotificationStatus.UNREAD,
        })),
      );
    }
  };

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
          readNotificationForEachType();
          navigate();
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
              label={t(`notification_label.${type}`)}
            />
            <P1Text
              style={{
                color: status === 'read' ? '#A7A7A7' : '#1c1c1c',
                fontFamily:
                  status === 'read' ? AppFonts.Regular : AppFonts.Bold,
                marginBottom: 6,
              }}
              label={t(`notification.${type}`, {
                month: data.month,
                week: data.week,
                device: data.message,
                profit: currencyFormatter(
                  parseFloat(data.message),
                  4,
                ),
                tokenName: data.tokenName,
                tokenAmount: data.tokenAmount,
                paymentMethod: data.paymentMethod?.toUpperCase(),
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
            {isTransactionNoti && (
              <>
                <TouchableOpacity
                  onPress={() => setShowTx(!showTx)}
                  style={{
                    backgroundColor: '#A7A7A7',
                    borderRadius: 2,
                    width: 75,
                    height: 20,
                    justifyContent: 'center',
                    alignContent: 'center',
                    marginBottom: 8,
                  }}>
                  <View
                    style={{ flexDirection: 'row', justifyContent: 'center' }}>
                    <P4Text
                      style={{ color: '#fff', textAlign: 'center' }}
                      label={
                        showTx
                          ? t('dashboard_label.fold')
                          : t('dashboard_label.transaction')
                      }
                    />
                    <Image
                      style={{
                        width: 5,
                        height: 3,
                        marginTop: 'auto',
                        marginBottom: 'auto',
                        marginLeft: 3,
                      }}
                      source={
                        showTx
                          ? require('../../dashboard/images/whiteupbutton.png')
                          : require('../../dashboard/images/whitedownbutton.png')
                      }></Image>
                  </View>
                </TouchableOpacity>
                {showTx && (
                  <TouchableOpacity
                    onPress={() => {
                      Linking.openURL(
                        getTxScanLink(data.txHash, data.network as NetworkType),
                      );
                    }}
                    style={{
                      marginBottom: 8,
                    }}>
                    <P3Text
                      label={data.txHash}
                      style={{ textDecorationLine: 'underline' }}
                    />
                  </TouchableOpacity>
                )}
              </>
            )}
            <P3Text
              style={{
                color: status === 'read' ? '#A7A7A7' : '#4e4e4e',
                fontSize: 13,
                marginBottom: 6,
              }}
              label={moment(props.notification.createdAt).format('MM.DD')}
            />
          </View>
          <View
            style={{
              flex: 1,
              alignContent: 'center',
              justifyContent: 'center',
            }}>
            {(type === NotificationType.PRODUCT_NOTICE ||
              type === NotificationType.ONBOARDING_NEW_USER ||
              type === NotificationType.ONBOARDING_CONNECT_WALLET) && (
                <Image
                  style={{ left: 10, width: 6, height: 9 }}
                  source={images[9][status === 'read' ? 0 : 1]}
                />
              )}
          </View>
          {type === NotificationType.PENDING_TRANSACTION && (
            <View
              style={{
                flex: 1,
                alignContent: 'center',
                justifyContent: 'center',
              }}>
              <ActivityIndicator size="small" color="#3679B5" />
            </View>
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default NotiBox;
