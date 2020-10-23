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
import Product, { defaultProduct } from '../../types/Product';
import BasicInfo from './components/BasicInfo';
import { SubmitButton } from '../../shared/components/SubmitButton';
import { ProductPage } from '../../enums/pageEnum';
import { Map } from './components/Map';
import RootContext from '../../contexts/RootContext';
import SliderProductBuying from './SliderProductBuying';
import { KycStatus } from '../../enums/KycStatus';

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

const ProductBuying: FunctionComponent = () => {
  const [state, setState] = useState({
    modalVisible: false,
    product: defaultProduct,
  });
  const navigation = useNavigation();
  const route = useRoute<RouteProp<ParamList, 'ProductBuying'>>();
  const { productId } = route.params;
  const { Server, user } = useContext(RootContext);
  const shortNationality = user.nationality ? user.nationality.split(", ")[1] : "";
  const purchasability =
    (user.kycStatus === KycStatus.SUCCESS
      && user.ethAddresses?.length > 0
      && !(state.product?.restrictedCountries.includes(shortNationality)));

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
        style={{ position: 'absolute', bottom: 0, marginBottom: 15, backgroundColor: purchasability ? "#3679B5" : "#D0D8DF" }}
        handler={() => {
          if (!purchasability) {
            if (state.product?.restrictedCountries.includes(shortNationality)) {
              return (alert(i18n.t('product.restricted_country')));
            }
            return (alert(i18n.t('product.non_purchasable')));
          } else { setState({ ...state, modalVisible: true }); }
        }}
        title={purchasability ? i18n.t('product_label.invest') : i18n.t('product_label.non_purchasable')}
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
          product={state.product ? state.product : defaultProduct}
          modalHandler={() => setState({ ...state, modalVisible: false })}
        />
      </Modal>
    </ProductInfoWrapper>
  );
};

export default ProductBuying;
