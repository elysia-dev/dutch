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
import { Calculator } from './components/Calculator';
import WrappedInfo from './components/WrappedInfo';
import Product from '../../types/product';
import UserContext from '../../contexts/UserContext';
import LocaleType from '../../enums/LocaleType';
import { Map } from './components/Map';
import BasicInfo from './components/BasicInfo';
import { SubmitButton } from '../../shared/components/SubmitButton';
import { ProductPage } from '../../enums/pageEnum';

const H1Text = styled.Text`
  color: #1c1c1c;
  font-size: 25px;
  font-weight: bold;
  margin-top: 7px;
  margin-bottom: 6px;
  text-align: left;
  z-index: 3;
`;
const WText = styled.Text`
  margin-top: 30px;
  color: #fff;
  font-size: 14px;
  line-height: 30px;
`;
const GText = styled.Text`
  color: #626368;
  font-size: 15px;
  text-align: left;
  font-weight: 300;
`;
const PText = styled.Text`
  color: #1c1c1c;
  font-size: 12px;
  font-weight: 300;
`;
const DesView = styled.View`
  margin-top: 18px;
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
`;
const Method = styled.Image`
  width: 16px;
  height: 16px;
  margin-left: 14px;
`;
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
  const [state, setState] = useState({
    investment: 20,
    financial: false,
    highlight: false,
    abstract: false,
  });

  const navigation = useNavigation();
  const route = useRoute<RouteProp<ParamList, 'ProductInfo'>>();
  const { locale } = useContext(UserContext);
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
        <Map product={product} />
        <WrappedInfo product={product} />
      </ScrollView>
      <SubmitButton
        style={{ position: 'absolute', bottom: 0, marginBottom: 10 }}
        handler={() => {
          navigation.navigate(ProductPage.PaymentSelection);
        }}
        title={i18n.t('product_label.invest')}
      />
    </ProductInfoWrapper>
  );
};

export default ProductBuying;
