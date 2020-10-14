import React, { FunctionComponent, useContext, useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  Text,
  Modal,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import styled from 'styled-components/native';
import { BackButton } from '../../shared/components/BackButton';
import { defaultOwnershipResponse, OwnershipResponse } from '../../types/Ownership';
import OwnershipBasicInfo from './components/OwnershipBasicInfo';
import { Transaction } from '../../types/Transaction';
import { TransactionBox } from './components/TransactionBox';
import i18n from '../../i18n/i18n';
import RootContext from '../../contexts/RootContext';
import OwnershipRefund from './OwnershipRefund';
import OptionButtons from './components/OptionButtons';
import LegacyOptionButtons from './components/LegacyOptionButtons';
import SliderProductBuying from '../products/SliderProductBuying';
import LegacyOwnershipRefund from './LagacyOwnershipRefund';
import LegacyRefundStatus from '../../enums/LegacyRefundStatus';

const ProductInfoWrapper = styled.SafeAreaView`
  background-color: #fff;
  padding-top: 25px;
`;

type ParamList = {
  OwnershipDetail: {
    ownershipId: number;
  };
};

const OwnershipDetail: FunctionComponent = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<ParamList, 'OwnershipDetail'>>();
  const { Server } = useContext(RootContext);
  const { ownershipId } = route.params;
  const [state, setState] = useState({
    ownership: defaultOwnershipResponse,
    transactions: [] as Transaction[],
    transactionCount: 1,
    refundModalVisible: false,
    legacyRefundModalVisible: false,
    purchaseModalVisible: false,
  });
  const transactionList = state.transactions.map((transaction, index) => (
    <TransactionBox transaction={transaction} key={index} />
  ));

  const callTransactionApi = () => {
    Server.getTransaction(ownershipId, state.transactionCount)
      .then(res => {
        if (res.data.length === 0 && state.transactionCount > 1) {
          alert(i18n.t('dashboard.last_transaction'));
        } else {
          setState({
            ...state,
            transactions: state.transactions.concat(res.data),
            transactionCount: state.transactionCount + 1,
          });
        }
      })
      .catch(e => {
        if (e.response.status === 400) {
          alert(i18n.t('dashboard.ownership_error'));
        } else if (e.response.status === 500) {
          alert(i18n.t('account_errors.server'));
        }
      });
  };

  const callOwnershipApi = async (id: number) => {
    Server.ownershipDetail(id)
      .then((res) => {
        setState({ ...state, ownership: res.data });
      })
      .catch((e) => {
        if (e.response.status === 400) {
          alert(i18n.t('dashboard.ownership_error'));
        } else if (e.response.status === 500) {
          alert(i18n.t('account_errors.server'));
        }
      });
  };

  const callLegacyRefundApi = () => {
    Server.ownershipLegacyRefund(ownershipId)
      .then(() => {
        setState({
          ...state,
          ownership: {
            ...state.ownership,
            legacyRefundStatus: LegacyRefundStatus.PENDING,
          },
          legacyRefundModalVisible: false,
        });
      })
      .catch(e => {
        if (e.response.status === 404) {
          alert(i18n.t('dashboard.ownership_error'));
        } else if (e.response.status === 500) {
          alert(i18n.t('account_errors.server'));
        }
      });
  };

  useEffect(() => { callTransactionApi(); callOwnershipApi(ownershipId); }, []);

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
            source={{ uri: state.ownership.product.data.images[0] }}
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
        <OwnershipBasicInfo
          ownership={state.ownership}
        >
          {
            state.ownership.isLegacy ?
              <LegacyOptionButtons
                ownership={state.ownership}
                refundHandler={() => {
                  setState({ ...state, legacyRefundModalVisible: !state.legacyRefundModalVisible });
                }}
              /> :
              (<OptionButtons
                productId={state.ownership.product.id}
                refundHandler={() =>
                  setState({ ...state, refundModalVisible: !state.refundModalVisible })
                }
                purchaseHandler={() =>
                  setState({ ...state, purchaseModalVisible: !state.purchaseModalVisible })
                }
              />
              )
          }
        </OwnershipBasicInfo>
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
      {(state.purchaseModalVisible ||
        state.refundModalVisible ||
        state.legacyRefundModalVisible) && (
          <View
            style={{
              backgroundColor: 'rgba(0,0,0,0.5)',
              position: 'absolute',
              width: '100%',
              height: '100%',
            }}></View>
        )}
      <Modal
        transparent={true}
        animationType={'slide'}
        visible={state.refundModalVisible}>
        <OwnershipRefund
          modalHandler={() => setState({ ...state, refundModalVisible: false })}
        />
      </Modal>
      <Modal
        transparent={true}
        animationType={'slide'}
        visible={state.purchaseModalVisible}>
        <SliderProductBuying
          return={
            state.ownership.product ? state.ownership.product.data.expectedAnnualReturn : ''
          }
          modalHandler={() => setState({ ...state, purchaseModalVisible: false })}
        />
      </Modal>
      <Modal
        transparent={true}
        animationType={'slide'}
        visible={state.legacyRefundModalVisible}>
        <LegacyOwnershipRefund
          modalHandler={() => setState({ ...state, legacyRefundModalVisible: false })}
          submitHandler={() => callLegacyRefundApi()}
        />
      </Modal>
    </ProductInfoWrapper>
  );
};

export default OwnershipDetail;
