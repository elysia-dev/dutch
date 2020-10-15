import React, { Component, FunctionComponent, useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import i18n from '../../i18n/i18n';
import { BalanceCard } from './components/BalanceCard';
import { Asset } from './components/Asset';
import { DashboardPage, ProductPage } from '../../enums/pageEnum';
import VirtualTab from '../../shared/components/VirtualTab';
import { KycStatus } from '../../enums/KycStatus';
import RootContext from '../../contexts/RootContext';
import LocaleType from '../../enums/LocaleType';

export const Main: FunctionComponent = () => {
  const defaultUser = {
    id: 0,
    email: '',
    kycStatus: KycStatus.NONE,
    ethAddresses: [] as string[],
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
  const { user, ownerships } = state;

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
            {(user.firstName && user.lastName) ? i18n.t('greeting', {
              firstName: state.user.firstName,
              lastName: state.user.lastName,
            }) : i18n.t('greeting_new')}
          </Text>
          {(user.kycStatus !== KycStatus.SUCCESS || user.ethAddresses === null) &&
            <TouchableOpacity onPress={() => navigation.navigate('Dashboard', {
              screen: DashboardPage.PreparingInvestment,
              params: {
                kycStatus: user.kycStatus, ethAddresses: user.ethAddresses,
              },
            })} style={{ marginBottom: 25, width: "100%", borderRadius: 10, backgroundColor: "#fff", shadowColor: '#3679B540', shadowOffset: { width: 1, height: 1 }, shadowOpacity: 0.8, shadowRadius: 8 }}>
              <Image style={{ width: '100%', height: 416, resizeMode: 'center', alignSelf: "center", borderRadius: 10 }} source={require('./images/promotion.png')} />
              <Text style={{ position: "absolute", top: 30, left: 25, fontSize: 15, color: "#1C1C1C" }}>{i18n.t('dashboard.connect_wallet')}</Text>
              <Text style={{ position: "absolute", top: 50, left: 25, fontWeight: 'bold', fontSize: 25, color: "#1C1C1C" }}>{i18n.t('dashboard.get_EL')}</Text>
            </TouchableOpacity>}
          {(user.kycStatus === KycStatus.SUCCESS && ownerships.length === 0) &&
            <>
              <TouchableOpacity onPress={() => navigation.navigate('Dashboard', {
                screen: DashboardPage.PreparingInvestment,
                params: {
                  kycStatus: user.kycStatus, ethAddresses: user.ethAddresses,
                },
              })} style={{ marginBottom: 25, width: "100%", height: 100, backgroundColor: "#fff", borderRadius: 10, shadowColor: '#3679B540', shadowOffset: { width: 1, height: 1 }, shadowOpacity: 0.8, shadowRadius: 8 }}>
                <Image style={{ width: 80, height: 90, resizeMode: 'cover', position: 'absolute', right: 10, top: 5 }} source={require('./images/promotion.png')} />
                <Text style={{ position: "absolute", top: 25, left: 25, fontSize: 15, color: "#1C1C1C" }}>{i18n.t('dashboard.connect_wallet')}</Text>
                <Text style={{ position: "absolute", top: 45, left: 25, fontWeight: 'bold', fontSize: 25, color: "#1C1C1C" }}>{i18n.t('dashboard.get_EL')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{ marginBottom: 25, width: "100%", backgroundColor: "#fff", borderRadius: 10, shadowColor: '#3679B540', shadowOffset: { width: 1, height: 1 }, shadowOpacity: 0.8, shadowRadius: 8 }}>
                <Image source={require('./images/investmentguide.png')} style={{ width: "100%", height: 416, resizeMode: 'stretch', borderRadius: 10 }} />
                <Text style={{ position: "absolute", top: 30, left: 25, fontSize: 15, color: "#1C1C1C" }}>{i18n.t('dashboard.with_elysia')}</Text>
                <Text style={{ position: "absolute", top: 50, left: 25, fontWeight: 'bold', fontSize: 25, color: "#1C1C1C" }}>{i18n.t('dashboard.investment_guide')}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('ProductsMain')} style={{ marginBottom: 25, width: "100%", backgroundColor: "#fff", borderRadius: 10, shadowColor: '#3679B540', shadowOffset: { width: 1, height: 1 }, shadowOpacity: 0.8, shadowRadius: 8 }}>
                <Image source={require('./images/newinvestment.png')} style={{ width: "100%", height: 250, resizeMode: 'stretch', borderRadius: 10 }} />
                <Text style={{ position: "absolute", top: 30, left: 25, fontSize: 15, color: "#1C1C1C" }}>{i18n.t('dashboard.right_now')}</Text>
                <Text style={{ position: "absolute", top: 50, left: 25, fontWeight: 'bold', fontSize: 25, color: "#fff" }}>{i18n.t('dashboard.invest_first_asset')}</Text>
              </TouchableOpacity>
            </>}
          {ownerships.length > 0 &&
            <>
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
            </>}
        </View>
        <VirtualTab />
      </SafeAreaView>
    </ScrollView >
  );
};
