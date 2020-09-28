import React, { FunctionComponent, useState, useContext } from 'react';
import {
  View,
  ScrollView,
  Image,
  Text,
  SafeAreaView,
  Platform,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import styled from 'styled-components/native';
import i18n from '../../i18n/i18n';
import { BackButton } from '../../shared/components/BackButton';
import WrappedInfo from './components/WrappedInfo';
import Product from '../../types/product';
import UserContext from '../../contexts/UserContext';
import LocaleType from '../../enums/LocaleType';
import { Map } from './components/Map';
import BasicInfo from './components/BasicInfo';
import { SubmitButton } from '../../shared/components/SubmitButton';
import { ProductPage } from '../../enums/pageEnum';

const ProductInfoWrapper = styled.SafeAreaView`
  background-color: #fff;
  padding-top: 25px;
  height: 100%;
  width: 100%;
`;

type ParamList = {
  ProductInfo: {
    product: Product;
  };
};

const ProductBuying: FunctionComponent = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<ParamList, 'ProductInfo'>>();
  const { product } = route.params;

  return (
    <ProductInfoWrapper>
      <ScrollView
        scrollEnabled={true}
        scrollToOverflowEnabled={true}
        style={{ height: '100%', backgroundColor: '#fff' }}>
        <View
          style={{
            top: 0,
            width: '100%',
            height: 293,
            borderBottomLeftRadius: 10,
            borderBottomRightRadius: 10,
          }}>
          <Image
            source={{ uri: product.data.images[0] }}
            style={{
              borderBottomLeftRadius: 10,
              borderBottomRightRadius: 10,
              position: 'absolute',
              top: 0,
              width: '100%',
              height: 293,
              resizeMode: 'cover',
            }}
          />
          <View style={{ position: 'absolute', padding: 20 }}>
            <BackButton handler={() => navigation.goBack()} />
          </View>
        </View>
        <BasicInfo product={product} />
        <View
          style={{
            padding: 20,
            borderBottomColor: '#F6F6F8',
            borderBottomWidth: 5,
            height: 300,
          }}>
          <Map product={product} />
        </View>
        <WrappedInfo product={product} />
      </ScrollView>
      <SubmitButton
        style={{ position: 'absolute', bottom: 0, marginBottom: 15 }}
        handler={() => {
          navigation.navigate(ProductPage.SliderProductBuying, {
            return: product.data.expectedAnnualReturn,
          });
        }}
        title={i18n.t('product_label.invest')}
      />
    </ProductInfoWrapper>
  );
};

export default ProductBuying;
