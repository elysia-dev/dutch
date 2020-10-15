import React, { Component, FunctionComponent, useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { NavigationScreenProp, NavigationRoute } from 'react-navigation';
import { useNavigation, useScrollToTop } from '@react-navigation/native';
import i18n from '../../i18n/i18n';
import { BalanceCard } from './components/BalanceCard';
import { Asset } from './components/Asset';
import { DashboardPage, ProductPage } from '../../enums/pageEnum';
import VirtualTab from '../../shared/components/VirtualTab';
import { UserResponse } from '../../types/AccountResponse';
import { KycStatus } from '../../enums/KycStatus';
import { Transaction } from '../../types/Transaction';
import RootContext from '../../contexts/RootContext';
import LocaleType from '../../enums/LocaleType';

export const Main: FunctionComponent = () => {
  const defaultUser = {
    id: 0,
    email: '',
    kycStatus: KycStatus.NONE,
    ethAddresses: [""],
    gender: '',
    firstName: '',
    lastName: '',
    language: LocaleType.EN,
  };

  const defaultOwnerships = {
    id: 0,
    title: '',
    productType: '',
    value: 0,
    profit: 0,
  };

  const navigation = useNavigation();
  const { Server } = useContext(RootContext);
  const [state, setState] = useState({ user: defaultUser, ownerships: [defaultOwnerships], balance: '0' });

  const ref = React.useRef(null);
  useScrollToTop(ref);

  const callApi = () => {
    Server.me()
      .then(
        (res) => {
          setState({
            ...state,
            user: res.data.user,
            ownerships: res.data.ownerships,
            balance: res.data.totalBalance,
          });
        },
      )
      .catch((e) => {
        if (e.response.status === 500) {
          alert(i18n.t('account_errors.server'));
        }
      });
  };

  useEffect(() => { callApi(); }, []);

  const ownershipsList = state.ownerships.map((ownership, index) => (
    <Asset
      handler={() => {
        navigation.navigate('Dashboard', {
          screen: DashboardPage.OwnershipDetail,
          params: { ownershipId: ownership.id },
        });
      }}
      ownership={ownership}
      key={index}
    />
  ));

  return (
    <ScrollView
      ref={ref}
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
            {i18n.t('welcome')}
          </Text>
          <Text
            style={{
              color: '#1C1C1C',
              fontWeight: 'bold',
              fontSize: 28,
              textAlign: 'left',
              marginBottom: 40,
            }}>
            {i18n.t('greeting', {
              firstName: state.user.firstName,
              lastName: state.user.lastName,
            })}
          </Text>
          <BalanceCard
            balance={state.balance}
            handler={() => navigation.navigate('Dashboard', {
              screen: DashboardPage.SummaryReport,
            })}
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
              onPress={() => navigation.navigate('ProductsMain')}>
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
};
