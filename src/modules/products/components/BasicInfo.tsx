import React, {
  FunctionComponent,
  useContext,
  useEffect,
  useState,
} from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import styled from 'styled-components/native';
import * as Linking from 'expo-linking';
import i18n from '../../../i18n/i18n';
import Product from '../../../types/product';
import RootContext from '../../../contexts/RootContext';
import LocaleType from '../../../enums/LocaleType';
import {
  P1Text,
  P2Text,
  H2Text,
  H3Text,
} from '../../../shared/components/Texts';
import ProductStatus from '../../../enums/ProductStatus';

interface Props {
  product: Product;
  elPrice: number;
}

const GText = styled.Text`
  color: #626368;
  font-size: 15px;
  text-align: left;
  font-family: 'Roboto_300Light';
`;

const BasicInfo: FunctionComponent<Props> = (props: Props) => {
  const { user, Server } = useContext(RootContext);

  const product = props.product;
  // TODO : Add null guard languages & descrptions
  const productDescription = product.data.descriptions[user.language];
  // TODO : Add null guard languages & descrptions

  const totalElFormatter = () => {
    const totalEl = `${
      (parseFloat(product.totalValue) * product.usdPricePerToken) /
      props.elPrice
    }`;
    const intTotalEl = totalEl.split('.')[0];
    if (intTotalEl.length > 9) {
      return `EL ${intTotalEl.slice(0, intTotalEl.length - 9)}G`;
    } else if (intTotalEl.length > 6) {
      return `EL ${intTotalEl.slice(0, intTotalEl.length - 6)}M`;
    } else if (intTotalEl.length > 3) {
      return `EL ${intTotalEl.slice(0, intTotalEl.length - 3)}K`;
    }
    return `EL ${intTotalEl}`;
  };

  const commaFormatter = (input: number | string) => {
    if (typeof input === 'number') {
      return input.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    } else if (typeof input === 'string') {
      return input.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
  };

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
          <P2Text
            style={{ color: '#626368' }}
            label={`ELYSIA co.Ltd  |  ${product.title}`}
          />
          <View style={{ flexDirection: 'row' }}>
            <H2Text
              style={{
                marginTop: 7,
                marginBottom: 6,
                zIndex: 3,
              }}
              label={totalElFormatter()}
            />
            <GText
              allowFontScaling={false}
              style={{
                fontSize: 15,
                marginTop: 15,
                marginBottom: 6,
                marginLeft: 7,
                zIndex: 3,
                fontFamily: 'Roboto_400Regular',
              }}>
              {`($ ${commaFormatter(
                parseFloat(product.totalValue) * product.usdPricePerToken,
              )})`}
            </GText>
          </View>
        </View>
        {product.status === ProductStatus.SALE && product.contractAddress && (
          <TouchableOpacity
            onPress={() => {
              Linking.openURL(
                `https://etherscan.io/token/${product.contractAddress}`,
              );
            }}
            style={{
              backgroundColor: '#fff',
              width: 120,
              height: 30,
              borderRadius: 15,
              shadowOffset: { width: 1, height: 1 },
              shadowColor: '#00000029',
              shadowOpacity: 0.8,
              shadowRadius: 4,
              elevation: 4,
              justifyContent: 'center',
              alignContent: 'center',
            }}>
            <P1Text
              label={'Token Contract'}
              style={{ textAlign: 'center', fontSize: 13 }}
            />
          </TouchableOpacity>
        )}
      </View>
      <View
        style={{
          marginTop: 25,
          width: '100%',
          height: 240,
          padding: 10,
          backgroundColor: '#F6F6F8',
          borderRadius: 10,
          borderWidth: 1,
          borderColor: '#F1F1F1',
          flexDirection: 'column',
        }}>
        <View
          style={{
            height: 120,
            flex: 1,
            flexDirection: 'column',
            alignContent: 'space-between',
          }}>
          <View style={{ flex: 0.5 }} />
          <View
            style={{
              flex: 1.5,
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingHorizontal: 10,
              alignItems: 'center',
            }}>
            <P1Text
              label={i18n.t('product_label.available_token')}
              style={{ flex: 2.5, color: '#838383' }}
            />
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'flex-end',
              }}>
              <P1Text label={`${commaFormatter(product.presentValue)}`} />
              <P1Text
                label={` / ${commaFormatter(product.totalValue)}`}
                style={{ color: '#838383' }}
              />
            </View>
          </View>
          <View
            style={{
              flex: 1.5,
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingHorizontal: 10,
              alignItems: 'center',
            }}>
            <P1Text
              label={i18n.t('product_label.minimum_el')}
              style={{ color: '#838383' }}
            />
            <View style={{ flexDirection: 'row' }}>
              <P1Text
                label={`EL ${commaFormatter(
                  (product.usdPricePerToken / props.elPrice).toFixed(2),
                )}`}
              />
              <P1Text label={' ($ 5)'} style={{ color: '#838383' }} />
            </View>
          </View>
          <View style={{ flex: 0.5 }} />
        </View>
        <View
          style={{
            flex: 1,
            height: 120,
            flexDirection: 'row',
            justifyContent: 'space-between',
            borderTopColor: '#F1F1F1',
            borderTopWidth: 1.5,
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
                color: '#626368',
                marginTop: 4,
                zIndex: 3,
                textAlign: 'center',
                fontSize: user.language === LocaleType.EN ? 12 : 15,
              }}
              label={i18n.t('product_label.expected_annual_rate')}
            />
            <H3Text
              style={{
                textAlign: 'center',
                marginTop: 4,
                fontSize: user.language === LocaleType.EN ? 15 : 18,
              }}
              label={`${product.expectedAnnualReturn}%`}
            />
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
                marginTop: 4,
                color: '#626368',
                zIndex: 3,
                textAlign: 'center',
                fontSize: user.language === LocaleType.EN ? 12 : 15,
              }}
              label={i18n.t('product_label.property_type')}
            />
            <H3Text
              style={{
                textAlign: 'center',
                marginTop: 4,
                fontSize: user.language === LocaleType.EN ? 15 : 18,
              }}
              label={productDescription.propertyType}
            />
          </View>
          <View
            style={{
              flex: 1,
              flexDirection: 'column',
              justifyContent: 'center',
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
                color: '#626368',
                marginTop: 4,
                zIndex: 3,
                textAlign: 'center',
                fontSize: user.language === LocaleType.EN ? 12 : 15,
              }}
              label={i18n.t('product_label.rent_distribution')}
            />
            <H3Text
              style={{
                textAlign: 'center',
                marginTop: 4,
                fontSize: user.language === LocaleType.EN ? 15 : 18,
              }}
              label={productDescription.monthlyRentIncomeDistributionCycle}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

export default BasicInfo;
