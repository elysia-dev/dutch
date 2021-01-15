import React, { FunctionComponent, useContext, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
  ActivityIndicator,
  Modal,
  Platform,
  RefreshControl,
} from 'react-native';
import { useNavigation, useScrollToTop } from '@react-navigation/native';
import i18n from '../../i18n/i18n';
import { BalanceCard } from './components/BalanceCard';
import { WithdrawalCard } from './components/WithdrawalCard';
import { Asset } from './components/Asset';
import { DashboardPage } from '../../enums/pageEnum';
import VirtualTab from '../../shared/components/VirtualTab';
import { KycStatus } from '../../enums/KycStatus';
import RootContext from '../../contexts/RootContext';
import { H2Text, P1Text, H1Text } from '../../shared/components/Texts';
import LegacyRefundStatus from '../../enums/LegacyRefundStatus';
import { EventCard } from './components/EventCard';

export const Main: FunctionComponent = () => {
  const navigation = useNavigation();
  const { elPrice, user, ownerships, refreshUser, balance } = useContext(
    RootContext,
  );
  const legacyTotal: number | undefined = parseFloat(
    (user.legacyEl * elPrice + user.legacyUsd).toFixed(2),
  );
  const [refreshing, setRefreshing] = React.useState(false);

  const ref = React.useRef(null);
  useScrollToTop(ref);

  useEffect(() => {
    refreshUser();
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    refreshUser().then(() => setRefreshing(false));
  }, []);

  const ownershipsList = ownerships.map((ownership, index) => (
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
    <>
      <Modal visible={user.id === 0 || elPrice === 0} transparent={false}>
        <View
          style={{
            width: '100%',
            height: '100%',
            justifyContent: 'center',
            alignSelf: 'center',
          }}>
          <ActivityIndicator size="large" color="#3679B5" />
        </View>
      </Modal>
      <ScrollView
        ref={ref}
        style={{
          width: '100%',
          height: '100%',
          top: 0,
          backgroundColor: '#FAFCFF',
        }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <SafeAreaView>
          <View
            style={{
              paddingTop: Platform.OS === 'android' ? 65 : 45,
              height: '100%',
              padding: 20,
            }}>
            <H1Text
              style={{ marginBottom: 40 }}
              label={
                user.firstName && user.lastName
                  ? i18n.t('greeting', {
                    firstName: user.firstName,
                    lastName: user.lastName === null ? '' : user.lastName,
                  })
                  : i18n.t('greeting_new', {
                    email: user.email,
                  })
              }
            />
            <BalanceCard
              balance={balance}
              handler={() =>
                navigation.navigate('Dashboard', {
                  screen: DashboardPage.SummaryReport,
                })
              }
            />
            {(user.legacyEl !== 0 || user.legacyUsd !== 0) &&
              [LegacyRefundStatus.NONE, LegacyRefundStatus.PENDING].includes(
                user.legacyWalletRefundStatus,
              ) && (
                <WithdrawalCard
                  balance={legacyTotal}
                  handler={() =>
                    navigation.navigate('Dashboard', {
                      screen: DashboardPage.RemainingBalance,
                    })
                  }
                  redDot={
                    user.legacyWalletRefundStatus === LegacyRefundStatus.NONE
                  }
                />
              )}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
              }}>
              {ownershipsList}
              {ownerships.length > 0 && (
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
                    elevation: 6,
                    marginBottom: 20,
                  }}
                  onPress={() =>
                    navigation.navigate('ProductsMain', { refresh: true })
                  }>
                  <Text
                    style={{
                      textAlign: 'center',
                      fontFamily: 'Roboto_700Bold',
                      fontSize: 25,
                      color: '#838383',
                    }}>
                    {'+'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
            {ownerships.length === 0 && (
              <>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('Dashboard', {
                      screen: DashboardPage.InvestmentGuide,
                    })
                  }
                  style={{
                    marginBottom: 25,
                    width: '100%',
                    backgroundColor: '#fff',
                    borderRadius: 10,
                    shadowColor: '#3679B540',
                    shadowOffset: { width: 1, height: 1 },
                    shadowOpacity: 0.8,
                    shadowRadius: 8,
                    elevation: 8,
                  }}>
                  <Image
                    source={require('./images/investmentguide.png')}
                    style={{ width: '100%', height: 416, borderRadius: 10 }}
                  />
                  <H2Text
                    style={{ position: 'absolute', top: 30, left: 25 }}
                    label={i18n.t('dashboard.investment_guide')}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('ProductsMain', { refresh: true })
                  }
                  style={{
                    marginBottom: 25,
                    width: '100%',
                    backgroundColor: '#fff',
                    borderRadius: 10,
                    shadowColor: '#3679B540',
                    shadowOffset: { width: 1, height: 1 },
                    shadowOpacity: 0.8,
                    shadowRadius: 8,
                    elevation: 8,
                  }}>
                  <Image
                    source={require('./images/newinvestment.png')}
                    style={{ width: '100%', height: 250, borderRadius: 10 }}
                  />
                  <H2Text
                    style={{
                      position: 'absolute',
                      top: 30,
                      left: 25,
                    }}
                    label={i18n.t('dashboard.invest_first_asset')}
                  />
                </TouchableOpacity>
              </>
            )}
          </View>
          <VirtualTab />
        </SafeAreaView>
      </ScrollView>
    </>
  );
};
