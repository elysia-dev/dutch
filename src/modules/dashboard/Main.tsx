import React, {
  FunctionComponent,
  useContext,
  useEffect,
  useState,
} from 'react';
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
import LocaleType from '../../enums/LocaleType';
import { H2Text, P1Text, H1Text } from '../../shared/components/Texts';

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
  const [state, setState] = useState({
    user: defaultUser,
    ownerships: [defaultOwnerships],
    balance: '0',
  });
  const { user, ownerships } = state;

  const ref = React.useRef(null);
  useScrollToTop(ref);

  const callApi = () => {
    Server.me()
      .then((res) => {
        setState({
          ...state,
          user: res.data.user,
          ownerships: res.data.ownerships,
          balance: res.data.totalBalance,
        });
      })
      .catch((e) => {
        if (e.response.status === 500) {
          alert(i18n.t('account_errors.server'));
        }
      });
  };

  useEffect(() => {
    callApi();
  }, []);

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
    <>
      <Modal visible={user.id === 0} transparent={false}>
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
        }}>
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
                      firstName: state.user.firstName,
                      lastName:
                        state.user.lastName === null ? '' : state.user.lastName,
                    })
                  : i18n.t('greeting_new', {
                      email: state.user.email,
                    })
              }
            />
            <BalanceCard
              balance={state.balance}
              handler={() =>
                navigation.navigate('Dashboard', {
                  screen: DashboardPage.SummaryReport,
                })
              }
            />
            <WithdrawalCard
              balance={state.balance}
              handler={() =>
                navigation.navigate('Dashboard', {
                  screen: DashboardPage.RemainingBalance,
                })
              }
            />
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
                  onPress={() => navigation.navigate('ProductsMain')}>
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
            {(user.kycStatus !== KycStatus.SUCCESS ||
              !(user.ethAddresses?.length > 0)) && (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('Dashboard', {
                    screen: DashboardPage.PreparingInvestment,
                  })
                }
                style={{
                  marginBottom: 25,
                  width: '100%',
                  borderRadius: 10,
                  backgroundColor: '#fff',
                  shadowColor: '#3679B540',
                  shadowOffset: { width: 1, height: 1 },
                  shadowOpacity: 0.8,
                  shadowRadius: 8,
                  elevation: 6,
                }}>
                <Image
                  style={{
                    width: '100%',
                    height: 416,
                    alignSelf: 'center',
                    borderRadius: 10,
                  }}
                  source={require('./images/promotion.png')}
                />
                <P1Text
                  style={{ position: 'absolute', top: 30, left: 25 }}
                  label={i18n.t('dashboard.connect_wallet')}
                />
                <H2Text
                  style={{ position: 'absolute', top: 50, left: 25 }}
                  label={i18n.t('dashboard.get_EL')}
                />
              </TouchableOpacity>
            )}
            {user.kycStatus === KycStatus.SUCCESS &&
              user.ethAddresses?.length > 0 &&
              ownerships.length === 0 && (
                <>
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate('Dashboard', {
                        screen: DashboardPage.PreparingInvestment,
                      })
                    }
                    style={{
                      marginBottom: 25,
                      width: '100%',
                      height: 100,
                      backgroundColor: '#fff',
                      borderRadius: 10,
                      shadowColor: '#3679B540',
                      shadowOffset: { width: 1, height: 1 },
                      shadowOpacity: 0.8,
                      shadowRadius: 8,
                      elevation: 8,
                    }}>
                    <Image
                      style={{
                        width: 80,
                        height: 90,
                        position: 'absolute',
                        right: 10,
                        top: 5,
                      }}
                      source={require('./images/promotion.png')}
                    />
                    <P1Text
                      style={{ position: 'absolute', top: 25, left: 25 }}
                      label={i18n.t('dashboard.connect_wallet')}
                    />
                    <H2Text
                      style={{ position: 'absolute', top: 45, left: 25 }}
                      label={i18n.t('dashboard.get_EL')}
                    />
                  </TouchableOpacity>
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
                    <P1Text
                      style={{ position: 'absolute', top: 30, left: 25 }}
                      label={i18n.t('dashboard.with_elysia')}
                    />
                    <H2Text
                      style={{ position: 'absolute', top: 50, left: 25 }}
                      label={i18n.t('dashboard.investment_guide')}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => navigation.navigate('ProductsMain')}
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
                    <P1Text
                      style={{ position: 'absolute', top: 30, left: 25 }}
                      label={i18n.t('dashboard.right_now')}
                    />
                    <H2Text
                      style={{
                        position: 'absolute',
                        top: 50,
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
