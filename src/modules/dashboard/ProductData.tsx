import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import React, { FunctionComponent } from 'react';
import { ScrollView, View, Text } from 'react-native';
import { BackButton } from '../../shared/components/BackButton';
import { DocsResponse } from '../../types/Docs';
import Product from '../../types/product';
import { Map } from '../products/components/Map';
import Documents from './components/Documents';
import OwnershipWrappedInfo from './components/OwnershipWrappedInfo';

type ParamList = {
  OwnershipProduct: {
    product: Product;
    docs: DocsResponse;
  };
};

const ProductData: FunctionComponent = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<ParamList, 'OwnershipProduct'>>();
  const { product, docs } = route.params;
  return (
    <ScrollView
      style={{
        backgroundColor: '#FAFCFF',
        width: '100%',
        height: '100%',
      }}>
      <View style={{ padding: 15 }}>
        <BackButton
          handler={() => navigation.goBack()}
          style={{ marginTop: 20 }}
        />
        <Text
          style={{
            color: '#1C1C1C',
            textAlign: 'left',
            fontSize: 28,
            fontWeight: 'bold',
          }}>
          {'DOCUMENT'}
        </Text>
        <View
          style={{
            marginTop: 40,
            padding: 15,
            paddingTop: 20,
            width: '100%',
            height: 290,
            borderRadius: 10,
            backgroundColor: '#fff',
            shadowColor: '#3679B538',
            shadowOffset: { width: 1, height: 1 },
            shadowOpacity: 0.6,
            shadowRadius: 7,
          }}>
          <Map product={product} />
        </View>
        <Documents docs={docs} />
      </View>
      <View style={{ backgroundColor: '#fff', height: '100%' }}>
        <OwnershipWrappedInfo product={product} />
      </View>
    </ScrollView>
  );
};

export default ProductData;
