import React, { FunctionComponent, useState } from 'react';
import { View, ScrollView, Image, TouchableOpacity, Text } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import styled from 'styled-components/native';
import { BackButton } from '../../shared/components/BackButton';
import { OwnershipResponse } from '../../types/Ownership';
import OwnershipBasicInfo from './components/OwnershipBasicInfo';
import { Transaction } from '../../types/Transaction';
import { TransactionBox } from './components/TransactionBox';
import i18n from '../../i18n/i18n';
import { Api } from '../../api/transactions';

const ProductInfoWrapper = styled.SafeAreaView`
  background-color: #fff;
  padding-top: 25px;
`;

type ParamList = {
  OwnershipDetail: {
    ownership: OwnershipResponse;
    ownershipId: number;
    transaction: Transaction[];
  };
};

const OwnershipDetail: FunctionComponent = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<ParamList, 'OwnershipDetail'>>();
  const { ownership, ownershipId, transaction } = route.params;
  const [state, setState] = useState({
    transactions: transaction,
    transactionCount: 2,
  });
  const transactionList = state.transactions.map((transaction, index) => (
    <TransactionBox transaction={transaction} key={index} />
  ));

  const callTransactionApi = () => {
    Api.getTransaction(ownershipId, state.transactionCount)
      .then(res => {
        if (res.data.length === 0) {
          alert(i18n.t('dashboard.last_transaction'));
        }
        setState({
          ...state,
          transactions: state.transactions.concat(res.data),
          transactionCount: state.transactionCount + 1,
        });
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
  };
  return (
    <ProductInfoWrapper>
      <ScrollView
        scrollEnabled={true}
        scrollToOverflowEnabled={true}
        style={{ height: '100%', backgroundColor: '#fff' }}>
        <View
          style={{
            top: 0,
            width: '100%',
            height: 293,
            borderBottomLeftRadius: 10,
            borderBottomRightRadius: 10,
          }}>
          <Image
            source={{ uri: ownership.product.data.images[0] }}
            style={{
              borderBottomLeftRadius: 10,
              borderBottomRightRadius: 10,
              position: 'absolute',
              top: 0,
              width: '100%',
              height: 293,
              resizeMode: 'cover',
            }}
          />
          <View style={{ position: 'absolute', padding: 20 }}>
            <BackButton handler={() => navigation.goBack()} />
          </View>
        </View>
        <OwnershipBasicInfo ownership={ownership} />
        <View style={{ padding: 20 }}>
          {transactionList}
          <TouchableOpacity
            onPress={() => callTransactionApi()}
            style={{
              width: '100%',
              height: 50,
              borderRadius: 5,
              borderWidth: 1,
              borderColor: '#A7A7A7',
              justifyContent: 'center',
              alignContent: 'center',
              marginTop: 15,
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
        </View>
      </ScrollView>
    </ProductInfoWrapper>
  );
};

export default OwnershipDetail;
