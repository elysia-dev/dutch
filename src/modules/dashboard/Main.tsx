import React, { Component } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { NavigationScreenProp, NavigationRoute } from 'react-navigation';
import i18n from '../../i18n/i18n';
import { BalanceCard } from './components/BalanceCard';
import { Asset } from './components/Asset';
import { DashboardPage } from '../../enums/pageEnum';
import VirtualTab from '../../shared/components/VirtualTab';
import Api from '../../api/account';
import { Api as OwnershipApi } from '../../api/ownerships';
import { Api as TransactionApi } from '../../api/transactions';
import { Api as ReportApi } from '../../api/reports';
import { UserResponse } from '../../types/AccountResponse';
import { KycStatus } from '../../enums/KycStatus';
import { Transaction } from '../../types/Transaction';

interface Props {
  navigation: NavigationScreenProp<any>;
  route: NavigationRoute;
}
interface State {
  user: UserResponse['user'];
  ownerships: UserResponse['ownerships'];
  balance: string;
}

export class Main extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      user: this.defaultUser,
      balance: '',
      ownerships: [this.defaultOwnerships],
    };
  }

  defaultUser = {
    id: 0,
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
        this.setState({
          user: res.data.user,
          ownerships: res.data.ownerships,
          balance: res.data.totalBalance,
        });
      })
      .catch(e => {
        if (e.response.status === 401) {
          alert(i18n.t('account.need_login'));
          navigation.navigate('Account');
        } else if (e.response.status === 500) {
          alert(i18n.t('account_errors.server'));
        }
      });
  }

  callSummaryApi() {
    const { navigation } = this.props;

    ReportApi.getSummaryReport()
      .then(res => {
        console.log(res.data);
        navigation.navigate('Dashboard', {
          screen: DashboardPage.SummaryReport,
          params: {
            report: res.data,
          },
        });
      })
      .catch(e => {
        if (e.response.status === 401) {
          alert(i18n.t('account.need_login'));
          navigation.navigate('Account');
        } else if (e.response.status === 500) {
          alert(i18n.t('account_errors.server'));
        }
      });
  }

  async callOwnershipApi(id: number) {
    const { navigation } = this.props;
    let ownership = {};
    let transaction: Transaction[] = [];

    await OwnershipApi.ownershipDetail(id)
      .then(res => {
        ownership = res.data;
      })
      .catch(e => {
        if (e.response.status === 400) {
          alert(i18n.t('dashboard.ownership_error'));
        } else if (e.response.status === 401) {
          alert(i18n.t('account.need_login'));
          navigation.navigate('Account');
        } else if (e.response.status === 500) {
          alert(i18n.t('account_errors.server'));
        }
      });

    await TransactionApi.getTransaction(id, 1)
      .then(res => {
        transaction = res.data;
      })
      .catch(e => {
        if (e.response.status === 400) {
          alert(i18n.t('dashboard.ownership_error'));
        } else if (e.response.status === 401) {
          alert(i18n.t('account.need_login'));
          navigation.navigate('Account');
        } else if (e.response.status === 500) {
          alert(i18n.t('account_errors.server'));
        }
      });

    navigation.navigate('Dashboard', {
      screen: DashboardPage.OwnershipDetail,
      params: {
        ownership,
        ownershipId: id,
        transaction,
      },
    });
  }

  componentDidMount() {
    this.callApi();
  }

  render() {
    const { navigation } = this.props;
    const ownershipsList = this.state.ownerships.map((ownership, index) => (
      <Asset
        handler={() => {
          this.callOwnershipApi(ownership.id);
        }}
        ownership={ownership}
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
        <SafeAreaView>
          <View style={{ paddingTop: 40, height: '100%', padding: 20 }}>
            <Text
              style={{
                color: '#7A7D8D',
                fontSize: 15,
                textAlign: 'left',
                marginBottom: 10,
              }}>
              {'Welcome to ELYSIA'}
            </Text>
            <Text
              style={{
                color: '#1C1C1C',
                fontWeight: 'bold',
                fontSize: 28,
                textAlign: 'left',
                marginBottom: 40,
              }}>{`Hi, ${this.state.user.firstName}${this.state.user.lastName}`}</Text>
            <BalanceCard
              balance={`$ ${this.state.balance}`}
              handler={() => this.callSummaryApi()}
            />
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
              }}>
              {ownershipsList}
              <TouchableOpacity
                style={{
                  position: 'relative',
                  width: '47%',
                  height: 200,
                  borderRadius: 10,
                  backgroundColor: '#fff',
                  justifyContent: 'center',
                  alignContent: 'center',
                  shadowOffset: { width: 2, height: 2 },
                  shadowColor: '#1C1C1C4D',
                  shadowOpacity: 0.8,
                  shadowRadius: 7,
                }}
                onPress={() => { }}>
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
          </View>
          <VirtualTab />
        </SafeAreaView>
      </ScrollView>
    );
  }
}
