import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  GestureResponderEvent,
} from 'react-native';
import { NavigationScreenProp, NavigationRoute } from 'react-navigation';
import i18n from '../../i18n/i18n';
import { BalanceCard } from './components/BalanceCard';
import { Asset } from './components/Asset';
import { DashboardPage } from '../../enums/pageEnum';
import Api from '../../api/account';
import { Api as OwnershipApi } from '../../api/ownerships';

import { UserResponse } from '../../types/AccountResponse';
import { KycStatus } from '../../enums/KycStatus';

interface Props {
  navigation: NavigationScreenProp<any>;
  route: NavigationRoute;
}
interface State {
  user: UserResponse['user'];
  ownerships: UserResponse['ownerships'];
}

export class Main extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      user: this.defaultUser,
      ownerships: [this.defaultOwnerships],
    };
  }

  defaultUser = {
    email: '',
    kycStatus: KycStatus.NONE,
    ethAddress: [],
    gender: '',
    firstName: '',
    lastName: '',
    language: '',
  };

  defaultOwnerships = {
    id: 0,
    title: '',
    productType: '',
    value: 0,
    profit: 0,
  };

  callApi() {
    const { navigation } = this.props;

    Api.me()
      .then(res => {
        console.log(res.data);
        this.setState({
          user: res.data.user,
          ownerships: res.data.ownerships,
        });
      })
      .catch(e => {
        if (e.response.status === 401) {
          alert(i18n.t('account.need_login'));
          navigation.navigate('Account');
        } else if (e.response.status === 500) {
          alert(i18n.t('errors.server.duplicate_email'));
        }
      });
  }

  callOwnershipApi(id: number) {
    const { navigation } = this.props;

    OwnershipApi.ownershipDetail(id)
      .then(res => {
        console.log(res.data);

        navigation.navigate('Dashboard', {
          screen: DashboardPage.OwnershipDetail,
          params: {
            ownership: res.data,
          },
        });
      })
      .catch(e => {
        if (e.response.status === 400) {
          alert(i18n.t('dashboard.ownership_error'));
        } else if (e.response.status === 401) {
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

  render() {
    const { navigation } = this.props;
    const ownershipsList = this.state.ownerships.map((ownership, index) => (
      <Asset
        handler={() => this.callOwnershipApi(ownership.id)}
        name={ownership.title}
        investment={`$${ownership.value}`}
        profit={`$${ownership.profit}`}
        key={index}
      />
    ));

    return (
      <ScrollView
        style={{
          width: '100%',
          height: '100%',
          top: 0,
          backgroundColor: '#FAFCFF',
        }}>
        <View style={{ paddingTop: 90, height: '100%', padding: 20 }}>
          <BalanceCard
            balance={'$30.00'}
            profit={'+ $3.18'}
            handler={() =>
              navigation.navigate('Dashboard', {
                screen: DashboardPage.SummaryReport,
              })
            }
          />
          <View>{ownershipsList}</View>
          <TouchableOpacity
            style={{
              width: '100%',
              height: 50,
              borderRadius: 5,
              backgroundColor: '#E6ECF2',
              justifyContent: 'center',
              alignContent: 'center',
            }}
            onPress={() => {}}>
            <Text
              style={{
                textAlign: 'center',
                fontWeight: 'bold',
                fontSize: 25,
                color: '#838383',
              }}>
              {'+'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }
}
