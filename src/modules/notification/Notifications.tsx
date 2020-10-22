import React, {
  FunctionComponent,
  useContext,
  useEffect,
  useState,
} from 'react';
import { View, Animated, RefreshControl, Text, Platform } from 'react-native';
import { useNavigation, useScrollToTop } from '@react-navigation/native';
import i18n from '../../i18n/i18n';
import NotiBox from './components/NotiBox';
import RootContext from '../../contexts/RootContext';
import Notification from '../../types/Notification';
import NotificationStatus from '../../enums/NotificationStatus';
import VirtualTab from '../../shared/components/VirtualTab';
import { P3Text } from '../../shared/components/Texts';

const Notifications: FunctionComponent = () => {
  const [scrollY] = useState(new Animated.Value(0));
  const [refreshing, setRefreshing] = React.useState(false);
  const navigation = useNavigation();

  const ref = React.useRef(null);
  useScrollToTop(ref);

  const { Server } = useContext(RootContext);

  const {
    notifications,
    unreadNotificationCount,
    setNotifications,
    setUnreadNotificationCount,
  } = useContext(RootContext);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = () =>
    Server.notification()
      .then(res => {
        setNotifications(res.data);
        setRefreshing(false);
      })
      .catch(e => {
        if (e.response.status === 500) {
          alert(i18n.t('account_errors.server'));
        }
      });

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    loadNotifications();
  }, []);

  const readNotification = (notification: Notification) => {
    if (notification.status === NotificationStatus.READ) return;

    Server.read(notification.id)
      .then(() => {
        setNotifications(
          notifications.map(n => {
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
        setUnreadNotificationCount(unreadNotificationCount - 1);
      })
      .catch(e => {
        if (e.response.status === 500) {
          alert(i18n.t('account_errors.server'));
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
          elevation: scrollY.interpolate({
            inputRange: [0, 15, 1000],
            outputRange: [0, 5, 5],
          }),
          shadowOffset: { width: 1, height: 1 },
          shadowColor: '#00000033',
          shadowOpacity: scrollY.interpolate({
            inputRange: [0, 15, 1000],
            outputRange: [0, 0.5, 0.5],
          }),
          paddingTop: 93,
          paddingBottom: 8,
          paddingLeft: 20,
          transform: [
            {
              translateY: scrollY.interpolate({
                inputRange: [0, 50, 1000],
                outputRange: [0, -15, -15],
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
            width: "100%",
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
            justifyContent: "flex-start",
            alignSelf: 'flex-start',
          }}>
          {i18n.t('notification_label.notification')}
        </Animated.Text>
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
        {notifications.map((notification, index) => {
          return (
            <NotiBox
              notification={notification}
              key={index}
              readNotification={readNotification}
            />
          );
        })}
        <P3Text
          style={{
            marginTop: -20,
            marginBottom: 75,
            textAlign: 'center',
          }}
          label={i18n.t('notification.saved_90days')}
        />
        <VirtualTab />
      </Animated.ScrollView>
    </View>
  );
};

export default Notifications;
