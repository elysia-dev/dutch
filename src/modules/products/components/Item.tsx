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

interface Props {
  story: Story;
  active: boolean;
  activateCard: (pageX: number, pageY: number) => void;
}

export const Item: FunctionComponent<Props> = (props: Props) => {
  const ref = createRef<Image>();

  const setImage = (method: PaymentCryptoType) => {
    switch(method) {
      case PaymentCryptoType.EL :
        return (<Image style={{ width: 17, height: 17, marginRight: 5 }} source={EL} />)
      case PaymentCryptoType.ETH :
        return (<Image style={{ width: 17, height: 17, marginRight: 5 }} source={ETH} />)
      case PaymentCryptoType.BNB :
        return (<Image style={{ width: 17, height: 17, marginRight: 5 }} source={BNB} />)
      default:
        break;
    }
  }

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
            <P1Text label={"투자방식"} style={{ fontSize: 15 }} />
            <H2Text label={
              props.story.investmentMethod === AssetType.Unit ?
              "갯수 기준"
              :
              "원화 기준"
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
            <P1Text label={"투자가능수단"} style={{ fontSize: 15 }} />
            <View style={{
              flexDirection: "row",
              alignItems: "center"
            }}>
              {setImage(props.story.paymentMethod)}
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
