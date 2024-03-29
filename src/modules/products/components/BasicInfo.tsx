import React, { FunctionComponent, useContext } from 'react';
import { View, TouchableOpacity } from 'react-native';
import * as Linking from 'expo-linking';
import { useTranslation } from 'react-i18next';
import Product from '../../../types/product';
import {
  P1Text,
  P2Text,
  H2Text,
  H3Text,
} from '../../../shared/components/Texts';
import ProductStatus from '../../../enums/ProductStatus';
import commaFormatter from '../../../utiles/commaFormatter';
import PreferenceContext from '../../../contexts/PreferenceContext';
import PriceContext from '../../../contexts/PriceContext';
import CryptoType from '../../../enums/CryptoType';
import getTokenLink from '../../../utiles/getTokenLink';
import NetworkType from '../../../enums/NetworkType';
import AppColors from '../../../enums/AppColors';

interface Props {
  product: Product;
}

const BasicInfo: FunctionComponent<Props> = (props: Props) => {
  const { currencyFormatter } = useContext(PreferenceContext);
  const { getCryptoPrice } = useContext(PriceContext);
  const { t } = useTranslation();

  const product = props.product;
  const priceLabel =
    product.paymentMethod === 'none'
      ? currencyFormatter(5, 0)
      : `${commaFormatter(
          (
            product.usdPricePerToken /
            getCryptoPrice(product.paymentMethod.toUpperCase() as CryptoType)
          ).toFixed(2),
        )} ${product.paymentMethod.toUpperCase()} (${currencyFormatter(5, 0)})`;

  return (
    <View
      style={{
        backgroundColor: AppColors.WHITE,
        paddingTop: 20,
        paddingLeft: '5%',
        paddingRight: '5%',
        width: '100%',
        borderBottomColor: AppColors.BACKGROUND_GREY,
        borderBottomWidth: 5,
      }}>
      <View
        style={{
          marginBottom: 13,
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
          }}>
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
                    getTokenLink(
                      product.contractAddress,
                      product.paymentMethod.toUpperCase() === CryptoType.BNB
                        ? NetworkType.BSC
                        : NetworkType.ETH,
                    ),
                  );
                }}
                style={{
                  backgroundColor: AppColors.WHITE,
                  width: 120,
                  height: 31,
                  borderRadius: 5,
                  borderWidth: 1,
                  borderColor: AppColors.MAIN,
                  justifyContent: 'center',
                  alignContent: 'center',
                }}>
                <P1Text
                  label={t('dashboard_label.token_contract')}
                  style={{
                    color: AppColors.MAIN,
                    textAlign: 'center',
                    fontSize: 13,
                  }}
                />
              </TouchableOpacity>
            )}
        </View>
      </View>
      {[
        [t('more_label.product_name'), product.title],
        [t('dashboard_label.product_info'), t('product_label.loan')],
        [
          t('product_label.expected_return'),
          `+ ${product.expectedAnnualReturn}%`,
        ],
        [
          t('product_label.available_token'),
          `${commaFormatter(props.product.presentValue)} / ${commaFormatter(
            props.product.totalValue,
          )}`,
        ],
        [t('product_label.price_per_token'), priceLabel],
      ].map(([leftContent, rightContent], index) => {
        // Finance Type 이 loan인 경우만 "product_label.loan"을 보여주어야 함
        // Finance Type 이 fund인 경우는 아무것도 보여주지 않음
        if (product.financeType !== 'loan' && index === 1) {
          return <></>;
        }

        return (
          <View
            key={index}
            style={{
              borderColor: AppColors.GREY,
              borderTopWidth: 1,
              paddingVertical: 20,
              flexDirection: 'row',
              width: '100%',
              justifyContent: 'space-between',
            }}>
            <View style={{ flex: 1 }}>
              <P2Text
                style={{
                  fontSize: 14,
                }}
                label={leftContent}
              />
            </View>
            <View style={{ flex: 1 }}>
              <H3Text
                style={{
                  fontSize: 14,
                  textAlign: 'right',
                }}
                label={rightContent}
              />
            </View>
          </View>
        );
      })}
    </View>
  );
};

export default BasicInfo;
