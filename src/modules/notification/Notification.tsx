import React, { Component } from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import styled from 'styled-components/native';
import { NavigationScreenProp, NavigationRoute } from 'react-navigation';

import i18n from '../../i18n/i18n';
import { DashboardPage } from '../../enums/pageEnum';
import { NotiBox } from './components/NotiBox';
import Api, { NotificationResponse } from '../../api/notification';

const H1Text = styled.Text`
  color: #1c1c1c;
  font-size: 28px;
  font-weight: bold;
  text-align: left;
`;

interface Props {
  navigation: NavigationScreenProp<any>;
  route: NavigationRoute;
}
interface State {
  notificationList: Array<NotificationResponse>;
}

export class Notification extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { notificationList: [] };
  }

  callApi() {
    const { navigation } = this.props;

    Api.notification()
      .then(res => this.setState({ notificationList: res.data }))
      .catch(e => {
        if (e.response.status === 401) {
          alert(i18n.t('account.need_login'));
          navigation.navigate('Account');
        } else if (e.response.status === 500) {
          alert(i18n.t('errors.server.duplicate_email'));
        }
      });
  }
  componentDidMount() {
    this.callApi();
  }

  // componentDidUpdate(
  //   _prevProps: object,
  //   prevState: { notificationList: Array<NotificationResponse> }
  // ) {
  //   if (prevState.notificationList !== this.state.notificationList) {
  //     this.callApi();
  //   }
  // }

  render() {
    const { navigation } = this.props;
    const listToShow = this.state.notificationList.map(
      (notification, index) => (
        <NotiBox notification={notification} key={index}></NotiBox>
      ),
    );

    return (
      <ScrollView
        style={{
          width: '100%',
          height: '100%',
          top: 0,
          backgroundColor: '#FFF',
          padding: 20,
        }}>
        <View style={{ marginTop: 50, marginBottom: 25 }}>
          <H1Text>{i18n.t('notification_label.notification')}</H1Text>
        </View>
        <View>{listToShow}</View>
      </ScrollView>
    );
  }
}
