import React, { FunctionComponent, useContext } from 'react';
import { View, TouchableOpacity } from 'react-native';
import * as Linking from 'expo-linking';
import { useTranslation } from 'react-i18next'
import Product from '../../../types/product';
import LocaleType from '../../../enums/LocaleType';
import {
  P1Text,
  P2Text,
  H2Text,
  H3Text,
} from '../../../shared/components/Texts';
import ProductStatus from '../../../enums/ProductStatus';
import commaFormatter from '../../../utiles/commaFormatter';
import getEnvironment from '../../../utiles/getEnvironment';
import PreferenceContext from '../../../contexts/PreferenceContext';
import PriceContext from '../../../contexts/PriceContext';
import CryptoType from '../../../enums/CryptoType';

interface Props {
  product: Product;
}

const BasicInfo: FunctionComponent<Props> = (props: Props) => {
  const { language, currencyFormatter } = useContext(PreferenceContext);
  const { getCryptoPrice } = useContext(PriceContext);
  const { t } = useTranslation();

  const product = props.product;
  // TODO : Add null guard languages & descrptions
  const productDescription = product.data.descriptions[language || LocaleType.EN];
  // TODO : Add null guard languages & descrptions
  const hasChildProduct =
    product?.childProducts && product?.childProducts.length > 0;

  const elProduct = product.childProducts.find(
    (prod, _index) => prod.paymentMethod === 'el',
  );

  const ethProduct = product.childProducts.find(
    (prod, _index) => prod.paymentMethod === 'eth',
  );

  return (
    <View
      style={{
        backgroundColor: '#fff',
        padding: 20,
        paddingLeft: '5%',
        paddingRight: '5%',
        width: '100%',
        borderBottomColor: '#F6F6F8',
        borderBottomWidth: 5,
      }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <View>
          <P2Text style={{ color: '#626368' }} label={product.title} />
          <View style={{ flexDirection: 'row' }}>
            <H2Text
              style={{
                marginTop: 7,
                marginBottom: 6,
                zIndex: 3,
              }}
              label={currencyFormatter(
                parseFloat(product.totalValue) * product.usdPricePerToken,
                0,
              )}
            />
          </View>
        </View>
        {product.status === ProductStatus.SALE &&
          product.contractAddress.length > 0 && (
            <TouchableOpacity
              onPress={() => {
                Linking.openURL(
                  getEnvironment().envName === 'PRODUCTION'
                    ? `https://etherscan.io/token/${product.contractAddress}`
                    : `https://kovan.etherscan.io/token/${product.contractAddress}`,
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
                label={t('dashboard_label.token_contract')}
                style={{ textAlign: 'center', fontSize: 13 }}
              />
            </TouchableOpacity>
          )}
      </View>
      <View
        style={{
          marginTop: 25,
          width: '100%',
          backgroundColor: '#F6F6F8',
          borderRadius: 10,
          borderWidth: 1,
          borderColor: '#F1F1F1',
          flexDirection: 'column',
          padding: 10,
          marginBottom: 10,
        }}>
        <View
          style={{
            flexDirection: 'row',
            padding: 10,
            paddingBottom: 20,
            borderBottomWidth: 1.5,
            borderColor: '#F1F1F1',
          }}>
          <H3Text
            style={{
              marginTop: 4,
              paddingRight: 10,
              fontSize: language === LocaleType.EN ? 15 : 18,
              borderRightWidth: 1,
              borderColor: '#CCCCCC',
            }}
            label={`${t('product_label.expected_annual_return', {
              return: product.expectedAnnualReturn,
            })}`}
          />
          <H3Text
            style={{
              paddingLeft: 10,
              marginTop: 4,
              marginLeft: 'auto',
              fontSize: language === LocaleType.EN ? 15 : 18,
            }}
            label={productDescription.propertyType}
          />
        </View>
        <View
          style={{
            flex: 1,
            flexDirection: 'column',
            alignContent: 'space-between',
            paddingTop: 10,
          }}>
          {product.financeType === 'loan' && (
            <View
              style={{
                marginVertical: 2,
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingHorizontal: 10,
                alignItems: 'center',
              }}>
              <P1Text
                label={t('product_highlight.type')}
                style={{ color: '#838383' }}
              />
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'flex-end',
                }}>
                <P1Text label={t('product_label.loan')} />
              </View>
            </View>
          )}
          <View
            style={{
              marginVertical: 2,
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingHorizontal: 10,
              alignItems: 'center',
            }}>
            <P1Text
              label={t('product_label.available_token')}
              style={{ flex: 1.2, color: '#838383' }}
            />
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'flex-end',
              }}>
              <P1Text
                label={`${commaFormatter(
                  parseFloat(product.presentValue).toFixed(4),
                )}`}
              />
              <P1Text
                label={` / ${commaFormatter(product.totalValue)}`}
                style={{ color: '#838383' }}
              />
            </View>
          </View>
          <View
            style={{
              marginVertical: 2,
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingHorizontal: 10,
              alignItems: 'center',
            }}>
            <P1Text
              label={t('product_label.price_per_token')}
              style={{ color: '#838383', flex: 1.2 }}
            />
            <View
              style={{
                flexDirection: 'row',
                flex: 1,
                justifyContent: 'space-between',
              }}>
              <H3Text
                label={product.paymentMethod.toUpperCase()}
                style={{
                  flex: 1,
                  alignSelf: 'center',
                  fontSize: 15,
                  justifyContent: 'flex-end',
                }}
              />
              <View
                style={{
                  flex: 2,
                  flexDirection: 'row',
                  justifyContent: 'flex-end',
                }}>
                <P1Text
                  label={` ${commaFormatter(
                    (product.usdPricePerToken / getCryptoPrice(product.paymentMethod.toUpperCase() as CryptoType)).toFixed(2),
                  )}`}
                />
                <P1Text
                  label={` (${currencyFormatter(
                    5,
                    0,
                  )})`}
                  style={{ color: '#838383' }}
                />
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default BasicInfo;
