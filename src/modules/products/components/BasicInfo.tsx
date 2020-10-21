import React, { FunctionComponent, useContext, useState } from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import styled from 'styled-components/native';
import * as Linking from 'expo-linking';
import i18n from '../../../i18n/i18n';
import Product from '../../../types/product';
import RootContext from '../../../contexts/RootContext';
import LocaleType from '../../../enums/LocaleType';

interface Props {
  product: Product;
}

const H1Text = styled.Text`
  color: #1c1c1c;
  font-size: 25px;
  font-weight: bold;
  margin-top: 7px;
  margin-bottom: 6px;
  text-align: left;
  z-index: 3;
`;
const GText = styled.Text`
  color: #626368;
  font-size: 15px;
  text-align: left;
  font-weight: 300;
`;
const ValueText = styled.Text`
  color: #1c1c1c;
  font-size: 15px;
  text-align: center;
  margin-top: 4px;
  font-weight: bold;
`;

const BasicInfo: FunctionComponent<Props> = (props: Props) => {
  const { locale } = useContext(RootContext);
  const product = props.product;
  // TODO : Add null guard languages & descrptions
  const productDescription =
    product.data.descriptions[
    product.data.languages.includes(locale) ? locale : LocaleType.EN
    ];
  // TODO : Add null guard languages & descrptions
  return (
    <View
      style={{
        backgroundColor: '#fff',
        padding: 20,
        width: '100%',
        borderBottomColor: '#F6F6F8',
        borderBottomWidth: 5,
      }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <View>
          <GText>{product.title}</GText>
          <H1Text>{`${product.totalValue} ${product.tokenName} Token`}</H1Text>
          <GText
            onPress={() => {
              Linking.openURL(
                `https://etherscan.io/token/${product.contractAddress}`,
              );
            }}
            style={{ fontSize: 12, textDecorationLine: 'underline' }}>
            {product.contractAddress}
          </GText>
        </View>

      </View>
      <View
        style={{
          marginTop: 45,
          width: '100%',
          paddingTop: 10,
          paddingBottom: 10,
          backgroundColor: '#F6F6F8',
          borderRadius: 10,
          borderWidth: 1,
          borderColor: '#F1F1F1',
          flexDirection: 'row',
        }}>
        <View
          style={{
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'center',
            alignContent: 'center',
            borderRightColor: '#F1F1F1',
            borderRightWidth: 1.5,
            paddingTop: 10,
            paddingBottom: 10,
          }}>
          <Image
            style={{
              marginLeft: 'auto',
              marginRight: 'auto',
              width: 27,
              height: 27,
              resizeMode: 'center',
              marginBottom: 6,
            }}
            source={require('../images/expectedreturn.png')}
          />
          <GText style={{ textAlign: 'center' }}>
            {i18n.t('product_label.expected_annual_rate')}
          </GText>
          <ValueText>{`${product.expectedAnnualReturn}%`}</ValueText>
        </View>
        <View
          style={{
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'center',
            borderRightColor: '#F1F1F1',
            borderRightWidth: 1.5,
            paddingTop: 10,
            paddingBottom: 10,
          }}>
          <Image
            style={{
              marginLeft: 'auto',
              marginRight: 'auto',
              width: 27,
              height: 27,
              resizeMode: 'center',
              marginBottom: 6,
            }}
            source={require('../images/building1.png')}
          />
          <GText style={{ textAlign: 'center' }}>
            {i18n.t('product_label.property_type')}
          </GText>
          <ValueText>{productDescription.propertyType}</ValueText>
        </View>
        <View
          style={{
            flex: 1,
            flexDirection: 'column',
            borderRightColor: '#F1F1F1',
            borderRightWidth: 1.5,
            paddingTop: 10,
            paddingBottom: 10,
          }}>
          <Image
            style={{
              marginLeft: 'auto',
              marginRight: 'auto',
              width: 27,
              height: 27,
              resizeMode: 'center',
              marginBottom: 6,
            }}
            source={require('../images/returncycle.png')}
          />
          <GText style={{ textAlign: 'center' }}>
            {i18n.t('product_label.rent_distribution')}
          </GText>
          <ValueText>
            {productDescription.monthlyRentIncomeDistributionCycle}
          </ValueText>
        </View>
      </View>
    </View>
  );
};

export default BasicInfo;
