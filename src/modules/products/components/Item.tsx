import React, { createRef, FunctionComponent, useEffect, useState } from 'react';
import { View, Image, Animated, TouchableWithoutFeedback } from 'react-native';
import AssetType from '../../../enums/AssetType';
import PaymentCryptoType from '../../../enums/PaymentCryptoType';
import CachedImage from '../../../shared/components/CachedImage';

import { H1Text, H2Text, P1Text, P2Text } from '../../../shared/components/Texts';
import { Story } from '../../../types/product';

import EL from '../../../../src/shared/assets/images/el.png';
import ETH from '../../../../src/shared/assets/images/eth.png';
import BNB from '../../../../src/shared/assets/images/bnb.png';
import { useTranslation } from 'react-i18next';

interface Props {
  story: Story;
  active: boolean;
  activateCard: (pageX: number, pageY: number) => void;
}

export const Item: FunctionComponent<Props> = (props: Props) => {
  const ref = createRef<Image>();
  const { t } = useTranslation();

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        if (ref.current) {
          ref.current.measure((_x, _y, _width, _height, pageX, pageY) => {
            props.activateCard(pageX, pageY);
          });
        }
      }}>
      <Animated.View
        style={{
          backgroundColor: '#fff',
          elevation: 3,
          height: 516,
          marginLeft: 3,
          marginRight: 3,
          borderRadius: 10,
          shadowOffset: { width: 2, height: 2 },
          shadowColor: '#00000033',
          shadowOpacity: 0.8,
          shadowRadius: 5,
          marginTop: 15,
          marginBottom: 15,
          opacity: props.active ? 0 : 1,
        }}>
        <CachedImage
          ref={ref}
          cacheKey={props.story.image.replace(/\//g, '_')}
          source={{ uri: props.story.image }}
          style={{
            width: '100%',
            height: 416,
            resizeMode: 'cover',
            borderRadius: 10,
          }}
        />
        <View style={{
          marginHorizontal: "5%"
        }}>
          <View style={{
            height: 50,
            flexDirection: "row",
            justifyContent: "space-between",
            borderBottomColor: "#F1F1F1",
            borderBottomWidth: 1,
            alignItems: "center"
          }}>
            <P1Text label={t("product_label.investment_method")} style={{ fontSize: 15 }} />
            <H2Text label={
              props.story.investmentMethod === AssetType.Unit ?
              t("product_label.unit_method")
              :
              t("product_label.usd_method")
            } style={{ fontSize: 15 }} />
          </View>
          <View style={{
            height: 50,
            flexDirection: "row",
            justifyContent: "space-between",
            borderBottomColor: "#F1F1F1",
            borderBottomWidth: 1,
            alignItems: "center"
          }}>
            <P1Text label={t("product_label.payment_method")} style={{ fontSize: 15 }} />
            <View style={{
              flexDirection: "row",
              alignItems: "center"
            }}>
              <Image 
                style={{ width: 17, height: 17, marginRight: 5 }} 
                source={props.story.paymentMethod === PaymentCryptoType.EL ?
                  EL
                  :
                    props.story.paymentMethod === PaymentCryptoType.ETH ? 
                    ETH 
                    : 
                    BNB
                } 
              />
              <H2Text label={props.story.paymentMethod.toUpperCase()} style={{ fontSize: 15 }} />
            </View>
          </View>
        </View>
        <View
          style={{
            position: 'absolute',
            flexDirection: 'column',
            marginTop: 20,
            marginLeft: 20,
          }}>
          <P1Text label={props.story.subTitle} />
          <H2Text label={props.story.title} style={{ marginTop: 10 }} />
        </View>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};
