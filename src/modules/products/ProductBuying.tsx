import React, {
  FunctionComponent,
  useState,
  useEffect,
  useContext,
} from 'react';
import {
  View,
  ScrollView,
  Image,
  StatusBar,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import styled from 'styled-components/native';
import { SafeAreaView } from 'react-navigation';
import i18n from '../../i18n/i18n';
import { BackButton } from '../../shared/components/BackButton';
import WrappedInfo from './components/WrappedInfo';
import Product, { defaultProduct } from '../../types/Product';
import BasicInfo from './components/BasicInfo';
import { SubmitButton } from '../../shared/components/SubmitButton';
import { ProductPage } from '../../enums/pageEnum';
import { Map } from './components/Map';
import { ExpectedReturn } from './components/ExpectedReturn';
import RootContext from '../../contexts/RootContext';
import SliderProductBuying from './SliderProductBuying';
import { KycStatus } from '../../enums/KycStatus';
import ProductStatus from '../../enums/ProductStatus';

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
  modalVisible: boolean;
  subscribed: boolean;
  product?: Product;
  loaded: boolean;
  elPrice: number;
}

const ProductBuying: FunctionComponent = () => {
  const [state, setState] = useState<State>({
    modalVisible: false,
    subscribed: false,
    loaded: false,
    elPrice: 0,
  });
  const navigation = useNavigation();
  const route = useRoute<RouteProp<ParamList, 'ProductBuying'>>();
  const { productId } = route.params;
  const { Server, user } = useContext(RootContext);
  const shortNationality = user.nationality
    ? user.nationality.split(', ')[1]
    : '';
  const purchasability =
    user.kycStatus === KycStatus.SUCCESS &&
    user.ethAddresses?.length > 0 &&
    !state.product?.restrictedCountries?.includes(shortNationality);

  const submitButtonTitle = () => {
    if (state.product?.status === ProductStatus.TERMINATED) {
      return 'Closed';
    }
    if (!purchasability) {
      return i18n.t('product_label.non_purchasable');
    } else if (state.product?.status === ProductStatus.SALE) {
      return i18n.t('product_label.invest');
    } else if (state.product?.status === ProductStatus.SUBSCRIBING) {
      if (state.subscribed) {
        return i18n.t('product_label.reserved');
      } else {
        return i18n.t('product_label.reserve');
      }
    }
  };

  const loadProductAndSubscription = async () => {
    try {
      const product = await Server.productInfo(productId);
      const subscription = await Server.getProductSubscription(productId);
      const elPrice = await Server.getELPrice();
      setState({
        ...state,
        product: product.data,
        subscribed: subscription.status === 200,
        loaded: true,
        elPrice: elPrice.data.elysia.usd,
      });
    } catch (e) {
      if (e.response.status === 500) {
        alert(i18n.t('account_errors.server'));
      } else if (e.response.status) {
        if (e.response.status === 404) {
          const product = await Server.productInfo(productId);
          const elPrice = await Server.getELPrice();
          setState({
            ...state,
            product: product.data,
            subscribed: false,
            loaded: true,
            elPrice: elPrice.data.elysia.usd,
          });
        }
      }
    }
  };

  useEffect(() => {
    loadProductAndSubscription();
  }, [user.language, productId]);

  return (
    <ProductInfoWrapper>
      <ScrollView
        scrollEnabled={true}
        scrollToOverflowEnabled={true}
        style={{
          height: '100%',
          backgroundColor: '#fff',
        }}>
        <View
          style={{
            top: 0,
            width: '100%',
            height: 293,
            borderBottomLeftRadius: 10,
            borderBottomRightRadius: 10,
            paddingBottom: 35,
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
        {state.product && (
          <BasicInfo product={state.product} elPrice={state.elPrice} />
        )}
        <View
          style={{
            padding: 20,
            borderBottomColor: '#F6F6F8',
            borderBottomWidth: 5,
            height: 136,
          }}>
          {state.product && <ExpectedReturn product={state.product} />}
        </View>
        <View
          style={{
            padding: 20,
            borderBottomColor: '#F6F6F8',
            borderBottomWidth: 5,
            height: 320,
          }}>
          {state.product && <Map product={state.product} />}
        </View>
        {state.product && <WrappedInfo product={state.product} />}
      </ScrollView>
      <SubmitButton
        style={{
          position: 'absolute',
          bottom: 0,
          marginBottom: 15,
          backgroundColor:
            // eslint-disable-next-line no-nested-ternary
            state.product?.status === ProductStatus.TERMINATED
              ? '#767577'
              : purchasability
              ? '#3679B5'
              : '#D0D8DF',
        }}
        disabled={state.product?.status === ProductStatus.TERMINATED}
        handler={() => {
          if (!purchasability) {
            if (state.product?.restrictedCountries.includes(shortNationality)) {
              return alert(i18n.t('product.restricted_country'));
            }
            return alert(i18n.t('product.non_purchasable'));
          } else {
            setState({ ...state, modalVisible: true });
          }
        }}
        title={submitButtonTitle()}
      />
      {state.modalVisible && (
        <View
          style={{
            backgroundColor: 'rgba(0,0,0,0.5)',
            position: 'absolute',
            width: '100%',
            height: '100%',
          }}
        />
      )}
      {!state.elPrice && (
        <View
          style={{
            backgroundColor: '#fff',
            position: 'absolute',
            width: '100%',
            height: '100%',
            justifyContent: 'center',
            alignContent: 'center',
          }}>
          <ActivityIndicator size="large" color="#3679B5" />
        </View>
      )}
      <Modal
        transparent={true}
        animationType={'slide'}
        visible={state.modalVisible}
        onRequestClose={() => setState({ ...state, modalVisible: false })}>
        <SliderProductBuying
          product={state.product ? state.product : defaultProduct}
          subscribed={state.subscribed}
          setSubcribed={(input: boolean) =>
            setState({ ...state, subscribed: input })
          }
          modalHandler={() => setState({ ...state, modalVisible: false })}
        />
      </Modal>
    </ProductInfoWrapper>
  );
};

export default ProductBuying;
