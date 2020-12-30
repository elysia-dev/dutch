import React, {
  FunctionComponent,
  useContext,
  useEffect,
  useState,
} from 'react';
import { View, Image } from 'react-native';
import styled from 'styled-components/native';
import RootContext from '../../../contexts/RootContext';
import i18n from '../../../i18n/i18n';
import { H1Text } from '../../../shared/components/Texts';
import Product from '../../../types/Product';
import currencyFormatter from '../../../utiles/currencyFormatter';

const GrayBox = styled.View`
  display: flex;
  flex-direction: column;
  align-content: space-between;
  width: 100%;
  height: 175px;
  padding: 10px;
  border-radius: 10px;
  background-color: #f6f6f8;
  border-width: 1px;
  border-color: #e5e5e5;
  margin-left: auto;
  margin-right: auto;
`;

const WhiteBox = styled.View`
  width: 100%;
  height: 65px;
  border-radius: 10px;
  background-color: #fff;
  padding: 10px;
  display: flex;
  flex-direction: column;
  align-content: space-between;
`;
const GrayText = styled.Text`
  font-size: 13px;
  text-align: center;
  align-items: center;
  color: #626368;
`;

const BlackText = styled.Text`
  font-size: 13px;
  text-align: center;
  align-items: center;
  color: #1c1c1c;
`;

const TextWrapper = styled.View`
  flex: 1;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

type Props = {
  product: Product;
  tokenCount: number;
};

const BuyingSummary: FunctionComponent<Props> = (props: Props) => {
  const { elPrice, currencyUnit, currencyRatio } = useContext(RootContext);

  const expectedUsdValue =
    (props.tokenCount || 0) * parseFloat(`${props.product.usdPricePerToken}`);
  const expectedElValue = expectedUsdValue / elPrice;

  const expectedProfit = (
    parseFloat(props.product.expectedAnnualReturn) *
    0.01 *
    expectedUsdValue
  ).toFixed(2);

  return (
    <View style={{ paddingTop: 20 }}>
      <GrayBox>
        <WhiteBox>
          <TextWrapper>
            <GrayText
              allowFontScaling={false}
              style={{ flex: 1, textAlign: 'left' }}>
              {i18n.t("product.from")}
            </GrayText>
            <GrayText allowFontScaling={false} style={{ flex: 1 }}>
              {i18n.t("product.to")}
            </GrayText>
            <GrayText
              allowFontScaling={false}
              style={{ flex: 3, textAlign: 'right' }}>
              {i18n.t("product.value")}
            </GrayText>
          </TextWrapper>
          <View style={{ flex: 1 }}>
            <View
              style={{
                position: 'relative',
                top: '50%',
                width: '100%',
                height: 1,
                backgroundColor: '#E5E5E5',
              }}></View>
          </View>
          <TextWrapper>
            <BlackText
              allowFontScaling={false}
              style={{ flex: 1, textAlign: 'left' }}>
              {i18n.t("product.you")}
            </BlackText>
            <BlackText allowFontScaling={false} style={{ flex: 1 }}>
              {i18n.t("product.elysia")}
            </BlackText>
            <View
              style={{
                flexDirection: 'row',
                flex: 3,
                justifyContent: 'flex-end',
              }}>
              <BlackText
                allowFontScaling={false}
                style={{ textAlign: 'right' }}>
                {i18n.t("product.el")}
              </BlackText>
              <BlackText
                allowFontScaling={false}
                style={{ fontWeight: 'bold', textAlign: 'right' }}>
                {' ' + expectedElValue.toFixed(2)}
              </BlackText>
            </View>
          </TextWrapper>
        </WhiteBox>
        <View
          style={{
            width: 30,
            height: 21,
            marginLeft: 'auto',
            marginRight: 'auto',
            padding: 7,
          }}>
          <Image
            style={{ marginLeft: 'auto', marginRight: 'auto' }}
            source={require('../images/downbutton.png')}
          />
        </View>
        <WhiteBox>
          <TextWrapper>
            <GrayText
              allowFontScaling={false}
              style={{ flex: 1, textAlign: 'left' }}>
              {i18n.t("product.from")}
            </GrayText>
            <GrayText allowFontScaling={false} style={{ flex: 1 }}>
              {i18n.t("product.to")}
            </GrayText>
            <GrayText
              allowFontScaling={false}
              style={{ flex: 3, textAlign: 'right' }}>
              {i18n.t("product.value")}
            </GrayText>
          </TextWrapper>
          <View style={{ flex: 1 }}>
            <View
              style={{
                position: 'relative',
                top: '50%',
                width: '100%',
                height: 1,
                backgroundColor: '#E5E5E5',
              }}></View>
          </View>
          <TextWrapper>
            <BlackText
              allowFontScaling={false}
              style={{ flex: 1, textAlign: 'left' }}>
              {i18n.t("product.elysia")}
            </BlackText>
            <BlackText allowFontScaling={false} style={{ flex: 1 }}>
              {i18n.t("product.you")}
            </BlackText>
            <View
              style={{
                flexDirection: 'row',
                flex: 3,
                justifyContent: 'flex-end',
              }}>
              <BlackText
                allowFontScaling={false}
                style={{ textAlign: 'right' }}>
                {props.product.tokenName}
              </BlackText>
              <BlackText
                allowFontScaling={false}
                style={{ fontWeight: 'bold', textAlign: 'right' }}>
                {' ' + props.tokenCount}
              </BlackText>
            </View>
          </TextWrapper>
        </WhiteBox>
      </GrayBox>
      <View
        style={{
          paddingHorizontal: 10,
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: 15,
        }}>
        <H1Text
          style={{ fontSize: 15 }}
          label={i18n.t('product_label.expected_return')}></H1Text>
        <H1Text
          style={{ fontSize: 15 }}
          label={currencyFormatter(
            currencyUnit,
            currencyRatio,
            parseFloat(expectedProfit),
            2,
          )}
        />
      </View>
    </View>
  );
};

export default BuyingSummary;
