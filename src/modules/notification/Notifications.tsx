import React, { FunctionComponent, useContext, useState } from 'react';
import {
  View,
  Animated,
  RefreshControl,
  Dimensions,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { useScrollToTop } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import NotiBox from './components/NotiBox';
import Notification from '../../types/Notification';
import NotificationStatus from '../../enums/NotificationStatus';
import VirtualTab from '../../shared/components/VirtualTab';
import { P1Text, P3Text } from '../../shared/components/Texts';
import ProviderType from '../../enums/ProviderType';
import UserContext from '../../contexts/UserContext';
import AnimatedMainHeader from '../../shared/components/AnimatedMainHeader';
import WalletContext from '../../contexts/WalletContext';
import EspressoV2 from '../../api/EspressoV2';
import AppColors from '../../enums/AppColors';

const Notifications: FunctionComponent = () => {
  const [scrollY] = useState(new Animated.Value(0));
  const [refreshing, setRefreshing] = React.useState(false);
  const { t } = useTranslation();

  const ref = React.useRef(null);
  useScrollToTop(ref);

  const { user, notifications, isWalletUser, Server, setNotifications } =
    useContext(UserContext);
  const { wallet } = useContext(WalletContext);
  const address = wallet?.getFirstAddress() || '';

  const loadNotifications = () => {
    Server.notification()
      .then((res) => {
        setNotifications(res.data);
        setRefreshing(false);
      })
      .catch((e) => {
        if (e.response.status === 500) {
          alert(t('account_errors.server'));
        }
      });
  };

  const loadV2UserNotifications = () => {
    EspressoV2.getNoficiations(address)
      .then((res) => {
        setNotifications(res.data);
        setRefreshing(false);
      })
      .catch((e) => {
        if (e.response.status === 500) {
          alert(t('account_errors.server'));
        }
      });
  };

  const onRefresh = React.useCallback(() => {
    if (isWalletUser) {
      loadV2UserNotifications();
      setRefreshing(true);
      return;
    }

    if (user.provider === ProviderType.GUEST) return;

    setRefreshing(true);
    loadNotifications();
  }, []);

  const readAllNotification = () => {
    if (isWalletUser) {
      EspressoV2.readAllNotifications(address)
        .then((_res) => loadV2UserNotifications())
        .catch((e) => {
          alert(e);
          if (e.response.status === 500) {
            alert(t('account_errors.server'));
          }
        });
    } else if (user.provider === ProviderType.GUEST) {
      setNotifications(
        notifications.map((notification, _index) => ({
          ...notification,
          status: NotificationStatus.READ,
        })),
      );
    } else {
      Server.readAll()
        .then((_res) => loadNotifications())
        .catch((e) => {
          if (e.response.status === 500) {
            alert(t('account_errors.server'));
          }
        });
    }
  };

  const countUnreadNotifications = () => {
    return notifications.filter(
      (notification) => notification.status === 'unread',
    ).length;
  };

  const readNotification = (notification: Notification) => {
    if (notification.status === NotificationStatus.READ) return;

    if (isWalletUser) {
      EspressoV2.readNotification(address, notification.id)
        .then(() => {
          setNotifications(
            notifications.map((n) => {
              if (n.id === notification.id) {
                return {
                  ...n,
                  status: NotificationStatus.READ,
                };
              } else {
                return n;
              }
            }),
          );
        })
        .catch((e) => {
          alert(t('account_errors.server'));
        });
    } else {
      Server.read(notification.id)
        .then(() => {
          setNotifications(
            notifications.map((n) => {
              if (n.id === notification.id) {
                return {
                  ...n,
                  status: NotificationStatus.READ,
                };
              } else {
                return n;
              }
            }),
          );
        })
        .catch((e) => {
          if (e.response.status === 500) {
            alert(t('account_errors.server'));
          }
        });
    }
  };

  return (
    <SafeAreaView
      style={{
        width: '100%',
        height: '100%',
        top: 0,
        backgroundColor: AppColors.WHITE,
      }}>
      <AnimatedMainHeader
        title={t('notification_label.notification')}
        scrollY={scrollY}
      />
      <Animated.ScrollView
        ref={ref}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [
            {
              nativeEvent: { contentOffset: { y: scrollY } },
            },
          ],
          { useNativeDriver: true },
        )}
        style={{ width: '100%', padding: 20 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        {notifications.length === 0 ? (
          <View
            style={{
              width: '100%',
              height: Dimensions.get('window').height - 200,
              alignContent: 'center',
              justifyContent: 'center',
              top: -20,
            }}>
            <P1Text
              style={{
                color: AppColors.TEXT_GREY,
                textAlign: 'center',
                fontSize: 15,
              }}
              label={t('notification.no_notification')}
            />
          </View>
        ) : (
          <>
            {countUnreadNotifications() > 0 && (
              <TouchableOpacity onPress={readAllNotification}>
                <P3Text
                  style={{
                    marginTop: 0,
                    marginBottom: 30,
                    textAlign: 'center',
                  }}
                  label={t('notification.read_all_notifications', {
                    number: countUnreadNotifications(),
                  })}
                />
              </TouchableOpacity>
            )}
            {notifications.map((notification, index) => {
              return (
                <NotiBox
                  notification={notification}
                  key={index}
                  readNotification={readNotification}
                />
              );
            })}
            {user.provider !== ProviderType.GUEST && (
              <P3Text
                style={{
                  marginTop: 0,
                  marginBottom: 75,
                  textAlign: 'center',
                }}
                label={t('notification.saved_90days')}
              />
            )}
          </>
        )}
        <VirtualTab />
      </Animated.ScrollView>
    </SafeAreaView>
  );
};

export default Notifications;
