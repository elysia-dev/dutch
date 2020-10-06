import React, {
  FunctionComponent,
  useContext,
  useEffect,
  useReducer,
} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  Image,
  Modal,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ScrollView } from 'react-native-gesture-handler';
import i18n from '../../i18n/i18n';
import { BackButton } from '../../shared/components/BackButton';
import { PText } from '../../shared/components/PText';
import Filter from './Filter';
import { Transaction } from '../../types/Transaction';
import { TransactionBox } from '../dashboard/components/TransactionBox';
import { reducer } from '../../hooks/useReducer';
import { H1Text } from '../../shared/components/H1Text';
import RootContext from '../../contexts/RootContext';

export interface State {
  page: number;
  start: string;
  end: string;
  period: string;
  type: string;
  modal: boolean;
  productId: number;
  transactions: Transaction[];
}

export const initialState = {
  page: 1,
  start: '',
  end: '',
  type: '',
  period: '30',
  modal: false,
  productId: 0,
  transactions: [],
};

const Transactions: FunctionComponent = () => {
  const navigation = useNavigation();
  const [state, dispatch] = useReducer(reducer, initialState);
  const { Server } = useContext(RootContext);

  const historyList = state.transactions.map(
    (transaction: Transaction, index: number) => (
      <TransactionBox transaction={transaction} key={index} />
    ),
  );

  const loadTransactions = () => {
    Server.getTransactionHistory(
      state.page,
      state.start,
      state.end,
      state.type,
      state.period,
      state.productId,
    )
      .then(res => {
        if (res.data.length === 0 && state.page > 1) {
          return alert(i18n.t('dashboard.last_transaction'));
        }
        dispatch({
          type: 'UPDATE_LIST',
          value: state.transactions.concat(res.data),
        });
      })
      .catch(e => {
        if (e.response.status === 401) {
          alert(i18n.t('account.need_login'));
        } else if (e.response.status === 500) {
          alert(i18n.t('account_errors.server'));
        }
      });
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  return (
    <SafeAreaView
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: '#fff',
      }}>
      <View
        style={{
          paddingHorizontal: 20,
          paddingTop: Platform.OS === 'android' ? 20 : 0,
          paddingBottom: 10,
          borderBottomColor: '#F6F6F8',
          borderBottomWidth: 5,
        }}>
        <BackButton
          handler={() => {
            navigation.goBack();
          }}
          style={{ marginTop: 10, marginBottom: 10 }}
        />
        <H1Text
          style={{ fontSize: 28, fontWeight: 'bold', marginBottom: 25 }}
          label={'TRANSACTIONS'}
        />
        <TouchableOpacity
          onPress={() => dispatch({ type: 'MODAL_CONTROL', value: true })}
          style={{ flexDirection: 'row', alignItems: 'center' }}>
          <PText
            style={{ color: '#838383' }}
            label={`${i18n.t(`more_label.${state.period}_day`)} · ${i18n.t(
              `more_label.type_${state.type}`,
            )} · 최신순`}></PText>
          <Image
            source={require('./images/graydownbutton.png')}
            style={{
              marginLeft: 5,
              width: 8,
              height: 4,
              resizeMode: 'center',
            }}
          />
        </TouchableOpacity>
      </View>
      <ScrollView
        style={{
          width: '100%',
          height: '100%',
          padding: 20,
        }}>
        {historyList.length === 0 ? (
          <View
            style={{
              width: '100%',
              height: '100%',
              paddingTop: '40%',
            }}>
            <Image
              style={{
                width: 50,
                height: 50,
                resizeMode: 'center',
                marginLeft: 'auto',
                marginRight: 'auto',
              }}
              source={require('./images/warning.png')}
            />
            <Text
              style={{
                marginTop: 20,
                marginBottom: 50,
                color: '#A7A7A7',
                textAlign: 'center',
                fontSize: 15,
              }}>
              {i18n.t('more.no_transaction')}
            </Text>
          </View>
        ) : (
          <>
            {historyList}
            <TouchableOpacity
              onPress={() => {
                dispatch({
                  type: 'UPDATE_PAGE',
                  value: state.page + 1,
                });
                loadTransactions();
              }}
              style={{
                width: '100%',
                height: 50,
                borderRadius: 5,
                borderWidth: 1,
                borderColor: '#A7A7A7',
                justifyContent: 'center',
                alignContent: 'center',
                marginTop: 15,
                marginBottom: 40,
              }}>
              <Text
                style={{
                  color: '#4E4E4E',
                  fontSize: 17,
                  textAlign: 'center',
                }}>
                {i18n.t('dashboard_label.more_transactions')}
              </Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
      {state.modal && (
        <View
          style={{
            backgroundColor: 'rgba(0,0,0,0.5)',
            position: 'absolute',
            width: '100%',
            height: '100%',
          }}></View>
      )}
      <Modal transparent={true} animationType={'slide'} visible={state.modal}>
        <Filter dispatch={dispatch} filter={state} />
      </Modal>
    </SafeAreaView>
  );
};

export default Transactions;
