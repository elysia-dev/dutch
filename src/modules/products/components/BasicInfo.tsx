import React, { FunctionComponent, useContext } from 'react';
import { View, TouchableOpacity } from 'react-native';
import * as Linking from 'expo-linking';
import { useTranslation } from 'react-i18next'
import Product from '../../../types/product';
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
  const { currencyFormatter } = useContext(PreferenceContext);
  const { getCryptoPrice } = useContext(PriceContext);
  const { t } = useTranslation();

  const product = props.product;
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
        paddingTop: 20,
        paddingLeft: '5%',
        paddingRight: '5%',
        width: '100%',
        borderBottomColor: '#F6F6F8',
        borderBottomWidth: 5,
      }}>
      <View
        style={{
          marginBottom: 13
        }}>
        <H3Text style={{
          color: '#3679B5',
          display: product.status === ProductStatus.SALE ? "flex" : "none"
        }}
          label={"FUNDING"} />
        <View style={{ flexDirection: 'row', justifyContent: "space-between", alignItems: "center", width: "100%" }}>
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
                  height: 31,
                  borderRadius: 5,
                  borderWidth: 1,
                  borderColor: "#3679B5",
                  justifyContent: 'center',
                  alignContent: 'center',
                }}>
                <P1Text
                  label={t('dashboard_label.token_contract')}
                  style={{ color: "#3679B5", textAlign: 'center', fontSize: 13 }}
                />
              </TouchableOpacity>
            )}
        </View>
      </View>
      {
        [
          [t('more_label.product_name'), product.title],
          [t('dashboard_label.product_info'), t('product_label.loan')],
          [t('product_label.expected_return'), "+ " + product.expectedAnnualReturn + "%"],
          [t('product_label.available_token'),
          commaFormatter(
            elProduct?.presentValue
              ? elProduct?.presentValue
              : props.product.presentValue,
          ) + " / " +
          commaFormatter(
            ethProduct?.totalValue
              ? ethProduct?.totalValue
              : props.product.totalValue)],
          [t('product_label.price_per_token'),
          commaFormatter((product.usdPricePerToken / getCryptoPrice(product.paymentMethod.toUpperCase() as CryptoType)).toFixed(2)) + product.paymentMethod.toUpperCase() + ` (${currencyFormatter(5, 0)})`],
        ].map(([leftContent, rightContent], index) => {
          return (
            <View
              style={{
                borderColor: "#f1f1f1",
                borderTopWidth: 1,
                paddingVertical: 20,
                flexDirection: "row",
                width: "100%",
                justifyContent: "space-between"
              }}>
              <View style={{ flex: 1 }} >
                <P2Text
                  style={{
                    fontSize: 14
                  }}
                  label={leftContent}
                />
              </View>
              <View style={{ flex: 1 }} >
                <H3Text
                  style={{
                    fontSize: 14,
                    textAlign: 'right'
                  }}
                  label={rightContent}
                />
              </View>
            </View>
          );
        })
      }
    </View>
  );
};

export default BasicInfo;
