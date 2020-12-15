import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import React, {
  FunctionComponent,
  useContext,
  useEffect,
  useState,
} from 'react';
import { View } from 'react-native';
import styled from 'styled-components/native';
import RootContext from '../../contexts/RootContext';
import { ProductPage } from '../../enums/pageEnum';
import i18n from '../../i18n/i18n';
import { BackButton } from '../../shared/components/BackButton';
import { H1Text, P1Text } from '../../shared/components/Texts';

import { SubmitButton } from '../../shared/components/SubmitButton';
import { OwnershipResponse } from '../../types/Ownership';

type ParamList = {
  InterestWithdraw: {
    ownership: OwnershipResponse;
  };
};

const TextWrapper = styled.View`
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const InterestWithdraw: FunctionComponent = () => {
  const { Server, elPrice, currencyExchange, user } = useContext(RootContext);

  const navigation = useNavigation();
  const route = useRoute<RouteProp<ParamList, 'InterestWithdraw'>>();
  const { ownership } = route.params;
  const elInterest = (parseFloat(ownership.availableProfit) / elPrice).toFixed(
    2,
  );

  const callApi = () => {
    Server.requestTransaction(ownership.product.id, 1, 'interest')
      .then((res) =>
        navigation.navigate('Product', {
          screen: ProductPage.PaymentSelection,
          params: {
            id: res.data.id,
            product: ownership.product,
            tokenCount: 0,
            type: 'interest',
            elInterest,
          },
        }),
      )
      .catch((e) => {
        if (e.response.status === 400) {
          alert(i18n.t('product.transaction_error'));
        } else if (e.response.status === 500) {
          alert(i18n.t('account_errors.server'));
        }
      });
  };

  return (
    <View
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: '#fff',
        padding: 20,
      }}>
      <BackButton
        style={{ marginTop: 20 }}
        handler={() => navigation.goBack()}></BackButton>
      <H1Text
        label={i18n.t('dashboard_label.interest_withdraw')}
        style={{ fontSize: 25 }}></H1Text>
      <View
        style={{
          marginTop: 35,
          padding: 20,
          flexDirection: 'column',
          alignContent: 'space-between',
          width: '100%',
          height: 120,
          backgroundColor: '#F6F6F8',
          borderRadius: 10,
          borderWidth: 1,
          borderColor: '#E5E5E5',
        }}>
        <TextWrapper>
          <P1Text
            label={i18n.t('dashboard_label.token_amount')}
            style={{ color: '#838383', fontSize: 15 }}
          />
          <P1Text
            label={`${ownership.product.tokenName} ${ownership.tokenValue}`}
            style={{ color: '#1C1C1C', fontSize: 15 }}
          />
        </TextWrapper>
        <TextWrapper>
          <P1Text
            label={`${i18n.t('dashboard_label.expected_profit')} (${
              user.currency
            })`}
            style={{ color: '#838383', fontSize: 15 }}
          />
          <P1Text
            label={currencyExchange(parseFloat(ownership.availableProfit), 2)}
            style={{ color: '#1C1C1C', fontSize: 15 }}
          />
        </TextWrapper>
        <TextWrapper>
          <P1Text
            label={`${i18n.t('dashboard_label.expected_profit')} (EL)`}
            style={{ color: '#838383', fontSize: 15 }}
          />
          <P1Text
            label={`EL ${elInterest}`}
            style={{ color: '#1C1C1C', fontSize: 15 }}
          />
        </TextWrapper>
      </View>
      <SubmitButton
        title={i18n.t('account_label.continue')}
        handler={() => {
          callApi();
        }}
        style={{
          position: 'absolute',
          bottom: 30,
          width: '100%',
          alignSelf: 'center',
        }}></SubmitButton>
    </View>
  );
};

export default InterestWithdraw;
