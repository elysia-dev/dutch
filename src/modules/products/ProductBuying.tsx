import React, {
  FunctionComponent,
  useState,
  useEffect,
  useContext,
} from 'react';
import { View, ScrollView, Image, StatusBar, Modal } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import styled from 'styled-components/native';
import i18n from '../../i18n/i18n';
import { BackButton } from '../../shared/components/BackButton';
import WrappedInfo from './components/WrappedInfo';
import Product from '../../types/product';
import BasicInfo from './components/BasicInfo';
import { SubmitButton } from '../../shared/components/SubmitButton';
import { ProductPage } from '../../enums/pageEnum';
import { Map } from './components/Map';
import RootContext from '../../contexts/RootContext';
import SliderProductBuying from './SliderProductBuying';

const ProductInfoWrapper = styled.SafeAreaView`
  background-color: #fff;
  padding-top: 25px;
  height: 100%;
  width: 100%;
`;

type ParamList = {
  ProductBuying: {
    productId: number;
  };
};

interface State {
  product?: Product;
  modalVisible: boolean;
}

const ProductBuying: FunctionComponent = () => {
  const [state, setState] = useState<State>({
    modalVisible: false,
  });
  const navigation = useNavigation();
  const route = useRoute<RouteProp<ParamList, 'ProductBuying'>>();
  const { productId } = route.params;
  const { Server } = useContext(RootContext);

  useEffect(() => {
    Server.productInfo(productId)
      .then(res => {
        setState({ ...state, product: res.data });
      })
      .catch(e => {
        if (e.response.status === 500) {
          alert(i18n.t('account_errors.server'));
        }
      });
  }, []);

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
            source={{ uri: state.product && state.product.data.images[0] }}
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
            <BackButton
              handler={() => {
                StatusBar.setHidden(true);
                navigation.goBack();
              }}
            />
          </View>
        </View>
        {state.product && <BasicInfo product={state.product} />}
        <View
          style={{
            padding: 20,
            borderBottomColor: '#F6F6F8',
            borderBottomWidth: 5,
            height: 300,
          }}>
          {state.product && <Map product={state.product} />}
        </View>
        {state.product && <WrappedInfo product={state.product} />}
      </ScrollView>
      <SubmitButton
        style={{ position: 'absolute', bottom: 0, marginBottom: 15 }}
        handler={() => {
          setState({ ...state, modalVisible: true });
        }}
        title={i18n.t('product_label.invest')}
      />
      {state.modalVisible && (
        <View
          style={{
            backgroundColor: 'rgba(0,0,0,0.5)',
            position: 'absolute',
            width: '100%',
            height: '100%',
          }}></View>
      )}
      <Modal
        transparent={true}
        animationType={'slide'}
        visible={state.modalVisible}>
        <SliderProductBuying
          return={state.product ? state.product.data.expectedAnnualReturn : ''}
          modalHandler={() => setState({ ...state, modalVisible: false })}
        />
      </Modal>
    </ProductInfoWrapper>
  );
};

export default ProductBuying;
