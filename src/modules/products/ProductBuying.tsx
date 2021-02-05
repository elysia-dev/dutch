import React, {
  FunctionComponent,
  useState,
  useEffect,
  useContext,
  useRef,
} from 'react';
import {
  View,
  ScrollView,
  Image,
  StatusBar,
  Modal,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import ViewPager from '@react-native-community/viewpager';
import styled from 'styled-components/native';
import i18n from '../../i18n/i18n';
import { BackButton } from '../../shared/components/BackButton';
import WrappedInfo from './components/WrappedInfo';
import Product, { defaultProduct } from '../../types/Product';
import BasicInfo from './components/BasicInfo';
import { SubmitButton } from '../../shared/components/SubmitButton';
import { Map } from './components/Map';
import { ExpectedReturn } from './components/ExpectedReturn';
import RootContext from '../../contexts/RootContext';
import SliderProductBuying from './SliderProductBuying';
import { KycStatus } from '../../enums/KycStatus';
import ProductStatus from '../../enums/ProductStatus';
import CachedImage from '../../shared/components/CachedImage';
import { SignInStatus } from '../../enums/SignInStatus';
import { MorePage } from '../../enums/pageEnum';
import ProviderType from '../../enums/ProviderType';
import { PostItem } from './components/PostItem';

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
  ethPrice: number;
  elPrice: number;
  selectedImage: number;
}

const ProductBuying: FunctionComponent = () => {
  const [state, setState] = useState<State>({
    modalVisible: false,
    subscribed: false,
    loaded: false,
    elPrice: 0,
    ethPrice: 0,
    selectedImage: 0,
  });
  const navigation = useNavigation();
  const route = useRoute<RouteProp<ParamList, 'ProductBuying'>>();
  const { productId } = route.params;
  const viewPager = useRef<ViewPager>(null);
  const { Server, user } = useContext(RootContext);
  const shortNationality = user.nationality
    ? user.nationality.split(', ')[1]
    : '';
  const purchasability =
    user.kycStatus === KycStatus.SUCCESS && user.ethAddresses?.length > 0;

  const submitButtonTitle = () => {
    if (state.product?.status === ProductStatus.TERMINATED) {
      return 'Sold Out';
    } else if (user.provider === ProviderType.GUEST) {
      return i18n.t('product_label.need_wallet');
    } else if (user.provider === ProviderType.EMAIL && !purchasability) {
      return i18n.t('product_label.non_purchasable');
    } else if (state.product?.restrictedCountries?.includes(shortNationality)) {
      return i18n.t('product_label.restricted_country');
    } else if (state.product?.status === ProductStatus.SALE) {
      return i18n.t('product_label.invest');
    }
    return '';
  };

  const submitButtonHandler = () => {
    if (user.provider === ProviderType.GUEST) {
      return Alert.alert(
        i18n.t('product_label.need_wallet'),
        i18n.t('product.connect_wallet_confirm'),
        [
          {
            text: 'Cancel',
            onPress: () => {},
            style: 'cancel',
          },
          {
            text: 'OK',
            onPress: () =>
              navigation.navigate('More', {
                screen: MorePage.RegisterEthAddress,
              }),
            style: 'default',
          },
        ],
        { cancelable: false },
      );
    } else if (user.provider === ProviderType.EMAIL && !purchasability) {
      if (state.product?.restrictedCountries.includes(shortNationality)) {
        return alert(i18n.t('product.restricted_country'));
      }
      return alert(i18n.t('product.non_purchasable'));
    } else {
      setState({ ...state, modalVisible: true });
    }
  };

  const loadProductAndSubscription = async () => {
    try {
      const product = await Server.productInfo(productId);
      // const subscription = await Server.getProductSubscription(productId);
      const elPrice = await Server.getCurrency('el');
      const ethPrice = await Server.coinPrice();
      // const totalSupply = getErc20Contract(product.data.contractAddress)
      setState({
        ...state,
        product: product.data,
        // subscribed: subscription.status === 200,
        loaded: true,
        elPrice: elPrice.data.rate,
        ethPrice: ethPrice.data.ethereum.usd,
      });
    } catch (e) {
      if (e.response.status === 500) {
        alert(i18n.t('account_errors.server'));
      } else if (e.response.status) {
        if (e.response.status === 404) {
          const product = await Server.productInfo(productId);
          const elPrice = await Server.getCurrency('el');
          const ethPrice = await Server.coinPrice();
          setState({
            ...state,
            product: product.data,
            subscribed: false,
            loaded: true,
            elPrice: elPrice.data.rate,
            ethPrice: ethPrice.data.ethereum.usd,
          });
        }
      }
    }
  };

  const imageList = state.product?.data.images.map((image, index) => {
    return (
      <CachedImage
        key={index}
        source={{ uri: image }}
        cacheKey={image.replace(/\//g, '_')}
        style={{
          borderBottomLeftRadius: 10,
          borderBottomRightRadius: 10,
          resizeMode: 'cover',
        }}
      />
    );
  });

  const buttonList = Array(imageList?.length)
    .fill(0)
    .map((_x, index) => {
      return (
        <TouchableOpacity
          key={index}
          onPress={() => {
            viewPager.current?.setPage(index);
          }}>
          <View
            style={{
              width: 10,
              height: 10,
              borderRadius: 5,
              margin: 10,
              backgroundColor:
                state.selectedImage === index ? '#3679B5' : '#BDD3E6',
            }}
          />
        </TouchableOpacity>
      );
    });

  useEffect(() => {
    loadProductAndSubscription();
  }, [user.language, productId]);

  return (
    <>
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
            <ViewPager
              style={{
                position: 'absolute',
                top: 0,
                width: '100%',
                height: 293,
              }}
              initialPage={0}
              ref={viewPager}
              onPageSelected={(e) => {
                setState({ ...state, selectedImage: e.nativeEvent.position });
              }}>
              {imageList}
            </ViewPager>
            <View
              style={{
                position: 'relative',
                top: 250,
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'row',
                bottom: '20%',
              }}>
              {buttonList}
            </View>
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
            <BasicInfo
              product={state.product}
              elPrice={state.elPrice}
              ethPrice={state.ethPrice}
            />
          )}
          {state.product && state.product?.status !== ProductStatus.TERMINATED && (
            <View
              style={{
                padding: 20,
                borderBottomColor: '#F6F6F8',
                borderBottomWidth: 5,
                height: 136,
              }}>
              <ExpectedReturn product={state.product} />
            </View>
          )}
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
                ? '#1c1c1c'
                : user.provider === ProviderType.ETH || purchasability
                ? '#3679B5'
                : '#D0D8DF',
          }}
          disabled={state.product?.status === ProductStatus.TERMINATED}
          handler={submitButtonHandler}
          title={submitButtonTitle()}
        />

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
    </>
  );
};

export default ProductBuying;
