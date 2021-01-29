import React, { FunctionComponent, useContext } from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
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
import commaFormatter from '../../../utiles/commaFormatter';
import currencyFormatter from '../../../utiles/currencyFormatter';
import getEnvironment from '../../../utiles/getEnvironment';

interface Props {
  product: Product;
  elPrice: number;
  ethPrice: number;
}

const BasicInfo: FunctionComponent<Props> = (props: Props) => {
  const { user, currencyUnit, currencyRatio } = useContext(RootContext);

  const product = props.product;
  // TODO : Add null guard languages & descrptions
  const productDescription = product.data.descriptions[user.language];
  // TODO : Add null guard languages & descrptions
  const hasChildProduct =
    product?.childProducts && product?.childProducts.length > 0;

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
                currencyUnit,
                currencyRatio,
                parseFloat(product.totalValue) * product.usdPricePerToken,
                0,
              )}
            />
          </View>
        </View>
        {product.status === ProductStatus.SALE && product.contractAddress && (
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
              label={i18n.t('dashboard_label.token_contract')}
              style={{ textAlign: 'center', fontSize: 13 }}
            />
          </TouchableOpacity>
        )}
      </View>
      <View
        style={{
          marginTop: 25,
          width: '100%',
          height: 157,
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
              fontSize: user.language === LocaleType.EN ? 15 : 18,
              borderRightWidth: 1,
              borderColor: '#CCCCCC',
            }}
            label={`${i18n.t('product_label.expected_annual_return', {
              return: product.expectedAnnualReturn,
            })}`}
          />
          <H3Text
            style={{
              paddingLeft: 10,
              marginTop: 4,
              marginLeft: 'auto',
              fontSize: user.language === LocaleType.EN ? 15 : 18,
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
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingHorizontal: 10,
                alignItems: 'center',
              }}>
              <P1Text
                label={i18n.t('product_highlight.type')}
                style={{ color: '#838383' }}
              />
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'flex-end',
                }}>
                <P1Text label={i18n.t('product_label.loan')} />
              </View>
            </View>
          )}
          <View
            style={{
              flex: 1,
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
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingHorizontal: 10,
              alignItems: 'center',
            }}>
            <P1Text
              label={i18n.t('product_label.price_per_token')}
              style={{ color: '#838383', flex: 1.2 }}
            />
            <View
              style={{
                flexDirection: 'row',
                flex: 1,
                justifyContent: 'space-between',
              }}>
              <H3Text
                label={'EL'}
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
                    (product.usdPricePerToken / props.elPrice).toFixed(2),
                  )}`}
                />
                <P1Text
                  label={` (${currencyFormatter(
                    currencyUnit,
                    currencyRatio,
                    5,
                    0,
                  )})`}
                  style={{ color: '#838383' }}
                />
              </View>
            </View>
          </View>
          {hasChildProduct && (
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingHorizontal: 10,
                alignItems: 'center',
              }}>
              <View style={{ flex: 1.2 }} />
              <View
                style={{
                  flexDirection: 'row',
                  flex: 1,
                  justifyContent: 'space-between',
                }}>
                <H3Text
                  label={'ETH'}
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
                    label={`${commaFormatter(
                      (product.usdPricePerToken / props.ethPrice).toFixed(6),
                    )}`}
                  />
                  <P1Text
                    label={` (${currencyFormatter(
                      currencyUnit,
                      currencyRatio,
                      5,
                      0,
                    )})`}
                    style={{ color: '#838383' }}
                  />
                </View>
              </View>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

export default BasicInfo;
