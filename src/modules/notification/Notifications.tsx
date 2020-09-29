import React, { FunctionComponent, useContext, useEffect, useState } from 'react';
import { View, Animated, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import i18n from '../../i18n/i18n';
import NotiBox from './components/NotiBox';
import Api from '../../api/notification';
import NotificationContext from '../../contexts/NotificationContext';
import Notification from '../../types/Notification';
import NotificationStatus from '../../enums/NotificationStatus';
import VirtualTab from '../../shared/components/VirtualTab';

const Notifications: FunctionComponent = () => {
  const [scrollY] = useState(new Animated.Value(0));
  const [refreshing, setRefreshing] = React.useState(false);
  const navigation = useNavigation();

  const {
    notifications,
    unreadNotificationCount,
    setNotifications,
    setUnreadNotificationCount,
  } = useContext(NotificationContext);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = () => Api.notification()
    .then(res => { setNotifications(res.data); setRefreshing(false); })
    .catch(e => {
      if (e.response.status === 401) {
        alert(i18n.t('account.need_login'));
        navigation.navigate('Account');
      } else if (e.response.status === 500) {
        alert(i18n.t('errors.server.duplicate_email'));
      }
    });

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    loadNotifications();
  }, []);

  const readNotification = (notification: Notification) => {
    if (notification.status === NotificationStatus.READ) return;

    Api.read(notification.id)
      .then(() => {
        setNotifications(notifications.map((n) => {
          if (n.id === notification.id) {
            return {
              ...n,
              status: NotificationStatus.READ,
            };
          } else {
            return n;
          }
        }));
        setUnreadNotificationCount(unreadNotificationCount - 1);
      }).catch((e) => {
        if (e.response.status === 500) {
          alert(i18n.t('errors.server.duplicate_email'));
        }
      });
  };

  return (
    <View
      style={{
        width: '100%',
        height: '100%',
        top: 0,
        backgroundColor: '#FFF',
      }}>
      <Animated.View
        style={{
          backgroundColor: '#fff',
          shadowOffset: { width: 1, height: 1 },
          shadowColor: '#00000033',
          shadowOpacity: scrollY.interpolate({
            inputRange: [0, 15, 1000],
            outputRange: [0, 0.5, 0.5],
          }),
          paddingTop: 60,
          paddingBottom: 15,
          paddingLeft: 20,
          transform: [
            {
              translateY: scrollY.interpolate({
                inputRange: [0, 15, 1000],
                outputRange: [0, -5, -5],
              }),
            },
          ],
        }}>
        <Animated.Text
          style={{
            position: 'relative',
            left: 0,
            width: 50,
            color: '#1c1c1c',
            fontSize: 28,
            transform: [
              {
                scale: scrollY.interpolate({
                  inputRange: [-1000, 0, 15, 1000],
                  outputRange: [1, 1, 0.9, 0.9],
                }),
              },
            ],
            fontWeight: 'bold',
            textAlign: 'center',
          }}>
          {i18n.t('notification_label.notification')}
        </Animated.Text>
      </Animated.View>
      <Animated.ScrollView
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
        }
      >
        {
          notifications.map((notification, index) => {
            return (
              <NotiBox
                notification={notification}
                key={index}
                readNotification={readNotification}
              />
            );
          })
        }
        <VirtualTab />
      </Animated.ScrollView>
    </View>
  );
};

export default Notifications;
