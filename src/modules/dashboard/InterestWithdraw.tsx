import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import React, { FunctionComponent, useContext, useEffect, useState } from 'react';
import { View } from 'react-native';
import styled from 'styled-components/native';
import RootContext from '../../contexts/RootContext';
import { ProductPage } from '../../enums/pageEnum';
import i18n from '../../i18n/i18n';
import { BackButton } from '../../shared/components/BackButton';
import { H1Text } from '../../shared/components/H1Text';
import { PText } from '../../shared/components/PText';
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
  const [elPrice, setELPrice] = useState(0.003);
  const { Server } = useContext(RootContext);

  useEffect(() => {
    Server.getELPrice().then(res => setELPrice(res.data.elysia.usd)).catch(e =>
      alert(i18n.t('account_errors.server')));
  }, []);

  const navigation = useNavigation();
  const route = useRoute<RouteProp<ParamList, 'InterestWithdraw'>>();
  const { ownership } = route.params;
  const elInterest = (parseFloat(ownership.availableProfit) / elPrice).toFixed(2);

  const callApi = () => {
    Server.requestTransaction(ownership.product.id, 1, "interest").then(
      res => navigation.navigate("Product", {
        screen: ProductPage.PaymentSelection,
        params: {
          id: res.data.id, product: ownership.product, tokenCount: 0, type: "interest", elInterest,
        },
      },
      ),
    ).catch(e => {
      if (e.response.status === 400) {
        alert(i18n.t('product.transaction_error'));
      } else if (e.response.status === 500) {
        alert(i18n.t('account_errors.server'));
      }
    });
  };

  return (
    <View style={{ width: "100%", height: "100%", backgroundColor: "#fff", padding: 20 }}>
      <BackButton style={{ marginTop: 20 }} handler={() => navigation.goBack()}></BackButton>
      <H1Text label={i18n.t('dashboard_label.interest_withdraw')} style={{ fontSize: 25 }}></H1Text>
      <View style={{
        marginTop: 35,
        padding: 20,
        flexDirection: "column",
        alignContent: 'space-between',
        width: "100%",
        height: 120,
        backgroundColor: "#F6F6F8",
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#E5E5E5",
      }}>
        <TextWrapper>
          <PText label={i18n.t('dashboard_label.token_amount')} style={{ color: "#838383", fontSize: 15 }} />
          <PText label={`${ownership.value} ${ownership.product.tokenName} Token`} style={{ color: "#1C1C1C", fontSize: 15 }} />
        </TextWrapper>
        <TextWrapper>
          <PText label={`${i18n.t('dashboard_label.expected_profit')}(USD)`} style={{ color: "#838383", fontSize: 15 }} />
          <PText label={`$ ${ownership.availableProfit}`} style={{ color: "#1C1C1C", fontSize: 15 }} />
        </TextWrapper>
        <TextWrapper>
          <PText label={`${i18n.t('dashboard_label.expected_profit')}(EL)`} style={{ color: "#838383", fontSize: 15 }} />
          <PText label={`EL ${elInterest}`} style={{ color: "#1C1C1C", fontSize: 15 }} />
        </TextWrapper>
      </View>
      <SubmitButton title={i18n.t('dashboard_label.withdraw')} handler={() => { callApi(); }} style={{ position: 'absolute', bottom: 30, width: "100%", alignSelf: 'center' }}></SubmitButton>
    </View>
  );
};

export default InterestWithdraw;
