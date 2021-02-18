import React, {
  FunctionComponent,
  useContext,
  useEffect,
  useState,
} from 'react';
import {
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  Modal,
} from 'react-native';
import {
  useNavigation,
  useRoute,
  RouteProp,
} from '@react-navigation/native';
import styled from 'styled-components/native';
import { BackButton } from '../../shared/components/BackButton';
import {
  defaultOwnershipResponse,
} from '../../types/Ownership';
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
import { defaultProduct } from '../../types/Product';
import { H3Text, P1Text } from '../../shared/components/Texts';
import SliderInterest from './SliderInterest';

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
    interestModalVisible: false,
  });
  const transactionList = state.transactions.map((transaction, index) => (
    <TransactionBox transaction={transaction} key={index} />
  ));

  const callTransactionApi = () => {
    Server.getTransaction(ownershipId, state.transactionCount)
      .then((res) => {
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
      .catch((e) => {
        if (e.response.status === 404) {
          alert(i18n.t('dashboard.ownership_error'));
        } else if (e.response.status === 500) {
          alert(i18n.t('account_errors.server'));
        }
      });
  };

  const loadOwnership = async () => {
    try {
      const transactions = await Server.getTransaction(
        ownershipId,
        state.transactionCount,
      );
      const ownership = await Server.ownershipDetail(ownershipId);
      setState({
        ...state,
        transactions: transactions.data,
        transactionCount: state.transactionCount + 1,
        ownership: ownership.data,
      });
    } catch (e) {
      if (e.response.status === 400) {
        alert(i18n.t('dashboard.ownership_error'));
      } else if (e.response.status === 500) {
        alert(i18n.t('account_errors.server'));
      }
    }
  };

  useEffect(() => {
    loadOwnership();
  }, [ownershipId]);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadOwnership();
    });

    return unsubscribe;
  }, [navigation]);

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
        <OwnershipBasicInfo ownership={state.ownership}>
          {state.ownership.isLegacy ? (
            <LegacyOptionButtons
              ownership={state.ownership}
              refundHandler={() => {
                setState({
                  ...state,
                  legacyRefundModalVisible: !state.legacyRefundModalVisible,
                });
              }}
            />
          ) : (
              <OptionButtons
                interestAvailability={
                  parseFloat(state.ownership.availableProfit) > 0
                }
                paymentMethod={state.ownership.product.paymentMethod}
                productId={state.ownership.product.id}
                refundHandler={() =>
                  setState({
                    ...state,
                    refundModalVisible: !state.refundModalVisible,
                  })
                }
                purchaseHandler={() =>
                  setState({
                    ...state,
                    purchaseModalVisible: !state.purchaseModalVisible,
                  })
                }
                interestHandler={() =>
                  setState({
                    ...state,
                    interestModalVisible: !state.interestModalVisible,
                  })
                }
              />
            )}
        </OwnershipBasicInfo>
        <View style={{ padding: 20 }}>
          <H3Text
            label={i18n.t('dashboard_label.transaction')}
            style={{ marginTop: 5, marginBottom: 20 }}
          />
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
            <P1Text
              style={{
                color: '#4E4E4E',
                fontSize: 17,
                textAlign: 'center',
              }}
              label={i18n.t('dashboard_label.more_transactions')}
            />
          </TouchableOpacity>
        </View>
      </ScrollView>
      {(state.purchaseModalVisible ||
        state.refundModalVisible ||
        state.legacyRefundModalVisible ||
        state.interestModalVisible) && (
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
        visible={state.refundModalVisible}
        onRequestClose={() =>
          setState({ ...state, refundModalVisible: false })
        }>
        <OwnershipRefund
          modalHandler={() => setState({ ...state, refundModalVisible: false })}
          ownership={state.ownership}
        />
      </Modal>
      <Modal
        transparent={true}
        animationType={'slide'}
        visible={state.interestModalVisible}
        onRequestClose={() =>
          setState({ ...state, interestModalVisible: false })
        }>
        <SliderInterest
          ownership={state.ownership}
          modalHandler={() =>
            setState({ ...state, interestModalVisible: false })
          }
        />
      </Modal>
      <Modal
        transparent={true}
        animationType={'slide'}
        visible={state.purchaseModalVisible}
        onRequestClose={() =>
          setState({ ...state, purchaseModalVisible: false })
        }>
        <SliderProductBuying
          from={'ownershipDetail'}
          product={
            state.ownership.product ? state.ownership.product : defaultProduct
          }
          modalHandler={() =>
            setState({ ...state, purchaseModalVisible: false })
          }
        />
      </Modal>
      <Modal
        transparent={true}
        animationType={'slide'}
        visible={state.legacyRefundModalVisible}
        onRequestClose={() =>
          setState({ ...state, legacyRefundModalVisible: false })
        }>
        <LegacyOwnershipRefund
          modalHandler={() =>
            setState({ ...state, legacyRefundModalVisible: false })
          }
          submitHandler={() => callLegacyRefundApi()}
        />
      </Modal>
    </ProductInfoWrapper>
  );
};

export default OwnershipDetail;
