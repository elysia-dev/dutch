import React, { FunctionComponent, useContext, useState } from 'react';
import {
  View,
  Animated,
  RefreshControl,
  Dimensions,
  SafeAreaView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { useScrollToTop } from '@react-navigation/native';
import i18n from '../../i18n/i18n';
import NotiBox from './components/NotiBox';
import RootContext from '../../contexts/RootContext';
import Notification from '../../types/Notification';
import NotificationStatus from '../../enums/NotificationStatus';
import VirtualTab from '../../shared/components/VirtualTab';
import { P1Text, P3Text } from '../../shared/components/Texts';
import ProviderType from '../../enums/ProviderType';

const Notifications: FunctionComponent = () => {
  const [scrollY] = useState(new Animated.Value(0));
  const [refreshing, setRefreshing] = React.useState(false);

  const ref = React.useRef(null);
  useScrollToTop(ref);

  const { Server, user } = useContext(RootContext);

  const { notifications, setNotifications } = useContext(RootContext);

  const loadNotifications = () =>
    Server.notification()
      .then((res) => {
        setNotifications(res.data);
        setRefreshing(false);
      })
      .catch((e) => {
        if (e.response.status === 500) {
          alert(i18n.t('account_errors.server'));
        }
      });

  const onRefresh = React.useCallback(() => {
    if (user.provider !== ProviderType.GUEST) {
      setRefreshing(true);
      loadNotifications();
    }
  }, []);

  const readAllNotification = () => {
    if (user.provider === ProviderType.GUEST) {
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
            alert(i18n.t('account_errors.server'));
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
          alert(i18n.t('account_errors.server'));
        }
      });
  };

  return (
    <SafeAreaView
      style={{
        width: '100%',
        height: '100%',
        top: 0,
        backgroundColor: '#FFF',
      }}>
      <Animated.View
        style={{
          overflow: 'hidden',
          backgroundColor: 'transparent',
          paddingBottom: 1,
        }}>
        <Animated.View
          style={{
            backgroundColor: '#fff',
            elevation: scrollY.interpolate({
              inputRange: [-1000, 0, 15, 1000],
              outputRange: [0, 0, 5, 5],
            }),
            shadowOffset: { width: 1, height: 1 },
            shadowColor: '#00000033',
            shadowOpacity: scrollY.interpolate({
              inputRange: [-1000, 0, 15, 1000],
              outputRange: [0, 0, 0.5, 0.5],
            }),
            paddingTop: Platform.OS === 'android' ? 65 : 45,
            paddingBottom: 10,
            paddingLeft: 20,
            transform: [
              {
                translateY: scrollY.interpolate({
                  inputRange: [-1000, 0, 50, 1000],
                  outputRange: [0, 0, -5, -5],
                }),
              },
            ],
          }}>
          <Animated.Text
            allowFontScaling={false}
            style={{
              position: 'relative',
              left: 0,
              paddingLeft: 0,
              width: '100%',
              color: '#1c1c1c',
              fontSize: 28,
              transform: [
                {
                  translateX: scrollY.interpolate({
                    inputRange: [-1000, 0, 15, 1000],
                    outputRange: [0, 0, -20, -20],
                  }),
                },
                {
                  translateY: 0,
                },
                {
                  scale: scrollY.interpolate({
                    inputRange: [-1000, 0, 15, 1000],
                    outputRange: [1, 1, 0.9, 0.9],
                  }),
                },
              ],
              fontFamily: 'Roboto_700Bold',
              textAlign: 'left',
              justifyContent: 'flex-start',
              alignSelf: 'flex-start',
            }}>
            {i18n.t('notification_label.notification')}
          </Animated.Text>
        </Animated.View>
      </Animated.View>
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
                color: '#A7A7A7',
                textAlign: 'center',
                fontSize: 15,
              }}
              label={i18n.t('notification.no_notification')}
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
                  label={i18n.t('notification.read_all_notifications', {
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
                label={i18n.t('notification.saved_90days')}
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
