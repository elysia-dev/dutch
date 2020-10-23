import React, { FunctionComponent, useContext, useState } from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import styled from 'styled-components/native';
import * as Linking from 'expo-linking';
import i18n from '../../../i18n/i18n';
import Product from '../../../types/product';
import RootContext from '../../../contexts/RootContext';
import LocaleType from '../../../enums/LocaleType';
import { P1Text, P2Text, H2Text, H3Text } from '../../../shared/components/Texts';

interface Props {
  product: Product;
}

const GText = styled.Text`
  color: #626368;
  font-size: 15px;
  text-align: left;
  font-family: 'Roboto_300Light';
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
          <P2Text style={{ color: "#626368" }} label={product.title} />
          <H2Text
            style={{
              marginTop: 7,
              marginBottom: 6,
              zIndex: 3,
            }}
            label={`${product.totalValue} ${product.tokenName} Token`} />
          <GText
            allowFontScaling={false}
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
              marginBottom: 6,
            }}
            source={require('../images/expectedreturn.png')}
          />
          <P1Text
            style={{
              marginTop: 7,
              marginBottom: 6,
              zIndex: 3,
              textAlign: 'center',
            }}
            label={i18n.t('product_label.expected_annual_rate')} />
          <H3Text
            style={{
              textAlign: "center",
              marginTop: 4,
            }}
            label={`${product.expectedAnnualReturn}%`} />
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
              marginBottom: 6,
            }}
            source={require('../images/building1.png')}
          />
          <P1Text
            style={{
              marginTop: 7,
              marginBottom: 6,
              zIndex: 3,
              textAlign: 'center',
            }}
            label={i18n.t('product_label.property_type')} />
          <H3Text
            style={{
              textAlign: "center",
              marginTop: 4,
            }}
            label={productDescription.propertyType} />
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
              marginBottom: 6,
            }}
            source={require('../images/returncycle.png')}
          />
          <P1Text
            style={{
              marginTop: 7,
              marginBottom: 6,
              zIndex: 3,
              textAlign: 'center',
            }}
            label={i18n.t('product_label.rent_distribution')} />
          <H3Text
            style={{
              textAlign: "center",
              marginTop: 4,
            }}
            label={productDescription.monthlyRentIncomeDistributionCycle} />
        </View>
      </View>
    </View>
  );
};

export default BasicInfo;
