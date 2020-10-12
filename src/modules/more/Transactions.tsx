import React, { FunctionComponent, useCallback, useContext, useEffect, useReducer, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  Image,
  Modal,
  Platform,
  Picker,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ScrollView } from 'react-native-gesture-handler';
import i18n from '../../i18n/i18n';
import { BackButton } from '../../shared/components/BackButton';
import { PText } from '../../shared/components/PText';
import Filter from './components/Filter';
import { Transaction } from '../../types/Transaction';
import { TransactionBox } from '../dashboard/components/TransactionBox';
import { reducer } from '../../hooks/reducers/TransactionFilterReducer';
import { H1Text } from '../../shared/components/H1Text';
import { ProductPicker } from './components/ProductPicker';
import RootContext from '../../contexts/RootContext';


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
  const [productState, setState] = useState({
    iosList: [{ label: '전체', value: '0', key: 0 }],
    andList: [
      <Picker.Item key={0} label={i18n.t('more_label.type_')} value={'0'} />,
    ],
  });

  const { Server } = useContext(RootContext);
  const historyList = state.transactions.map(
    (transaction: Transaction, index: number) => (
      <TransactionBox transaction={transaction} key={index} />
    ),
  );

    const filterTransactions = () => {
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
            type: 'UPDATE_TRANSACTIONS',
            transactions: res.data,
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
          type: 'ADD_TRANSACTIONS',
          transactions: state.transactions.concat(res.data),
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

  const loadProducts = useCallback(() => {
    Server.getAllProductIds()
      .then(res => {
        setState({
          ...productState,
          iosList: productState.iosList.concat(
            res.data.map((product, index) => ({
              label: product.title,
              value: `${product.productId}`,
              key: index + 1,
            })),
          ),
          andList: productState.andList.concat(
            res.data.map((product, index) => (
              <Picker.Item
                key={index + 1}
                label={product.title}
                value={`${product.productId}`}
              />
            )),
          ),
        });
      })
      .catch(e => {
        if (e.response.status === 401) {
          alert(i18n.t('account.need_login'));
        } else if (e.response.status === 500) {
          alert(i18n.t('account_errors.server'));
        }
      });
  }, []);

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
          onPress={() => dispatch({ type: 'MODAL_CONTROL', modal: true })}
          style={{ flexDirection: 'row', alignItems: 'center' }}>
          <PText
            style={{ color: '#838383' }}
            label={`${i18n.t(`more_label.${state.period}_day`)} · ${i18n.t(
              `more_label.type_${state.type}`,
            )} · ${i18n.t('more_label.latest')}`}></PText>
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
                dispatch({ type: 'UPDATE_PAGE', page: state.page + 1 });
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
        <Filter children={ <ProductPicker
        loadProducts={() => loadProducts()}
        productList={productState}
          style={{ marginBottom: 30 }}
          dispatch={dispatch}
          filter={state}
        />
        }
        dispatch={dispatch} filter={state} filterTransactions={() => filterTransactions()}/>
      </Modal>
    </SafeAreaView>
  );
};

export default Transactions;
