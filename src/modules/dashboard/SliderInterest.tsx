/* eslint-disable radix */
import React, { FunctionComponent, useContext } from 'react';
import { Image, View } from 'react-native';
import styled from 'styled-components/native';
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useTranslation } from 'react-i18next'
import { SubmitButton } from '../../shared/components/SubmitButton';
import { H1Text, P1Text } from '../../shared/components/Texts';
import { OwnershipResponse } from '../../types/Ownership';
import { ProductPage } from '../../enums/pageEnum';
import usePrices from '../../hooks/usePrice';
import FunctionContext from '../../contexts/FunctionContext';
import UserContext from '../../contexts/UserContext';
import PreferenceContext from '../../contexts/PreferenceContext';

interface Props {
  modalHandler: () => void;
  ownership: OwnershipResponse;
}

const TextWrapper = styled.View`
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const SliderInterest: FunctionComponent<Props> = (props) => {
  const { currencyFormatter } = useContext(PreferenceContext)
  const { user } = useContext(UserContext);
  const { Server } = useContext(FunctionContext);
  const { t } = useTranslation();

  const prices = usePrices();
  const navigation = useNavigation();
  const interest = (
    parseFloat(props.ownership.availableProfit) /
    (props.ownership.product.paymentMethod === 'eth'
      ? prices.ethPrice
      : prices.elPrice)
  ).toFixed(props.ownership.product.paymentMethod === 'eth' ? 4 : 2);

  const callApi = () => {
    props.modalHandler();
    Server.requestTransaction(props.ownership.product.id, 1, 'interest')
      .then((res) =>
        navigation.navigate('Product', {
          screen: ProductPage.PaymentSelection,
          params: {
            id: res.data.id,
            product: props.ownership.product,
            tokenCount: 0,
            type: 'interest',
            interest,
          },
        }),
      )
      .catch((e) => {
        if (e.response.status === 400) {
          alert(t('product.transaction_error'));
        } else if (e.response.status === 500) {
          alert(t('account_errors.server'));
        }
      });
  };

  return (
    <View
      style={{
        position: 'absolute',
        bottom: 0,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        paddingLeft: 20,
        paddingRight: 20,
        height: '70%',
        width: '100%',
        backgroundColor: '#fff',
        justifyContent: 'center',
      }}>
      <View style={{ width: '100%', height: '100%' }}>
        <TouchableOpacity
          style={{
            top: 10,
            width: 30,
            height: 30,
            alignSelf: 'center',
          }}
          onPress={props.modalHandler}>
          <Image
            source={require('./images/bluedownarrow.png')}
            style={{
              width: 30,
              height: 30,
            }}
          />
        </TouchableOpacity>
        <H1Text
          label={t('dashboard_label.interest_withdraw')}
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
              label={t('dashboard_label.token_amount')}
              style={{ color: '#838383', fontSize: 15 }}
            />
            <P1Text
              label={`${props.ownership.product.tokenName} ${props.ownership.tokenValue}`}
              style={{ color: '#1C1C1C', fontSize: 15 }}
            />
          </TextWrapper>
          <TextWrapper>
            <P1Text
              label={`${t('dashboard_label.expected_profit')} (${user.currency
                })`}
              style={{ color: '#838383', fontSize: 15 }}
            />
            <P1Text
              label={currencyFormatter(
                parseFloat(props.ownership.availableProfit),
                2,
              )}
              style={{ color: '#1C1C1C', fontSize: 15 }}
            />
          </TextWrapper>
          <TextWrapper>
            <P1Text
              label={`${t(
                'dashboard_label.expected_profit',
              )} (${props.ownership.product.paymentMethod.toUpperCase()})`}
              style={{ color: '#838383', fontSize: 15 }}
            />
            <P1Text
              label={`${props.ownership.product.paymentMethod.toUpperCase()} ${interest}`}
              style={{ color: '#1C1C1C', fontSize: 15 }}
            />
          </TextWrapper>
        </View>
        <SubmitButton
          title={t('account_label.continue')}
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
    </View>
  );
};

export default SliderInterest;
