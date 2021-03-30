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
  StatusBar,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import ViewPager from '@react-native-community/viewpager';
import styled from 'styled-components/native';
import { useTranslation } from 'react-i18next'
import { BackButton } from '../../shared/components/BackButton';
import WrappedInfo from './components/WrappedInfo';
import Product from '../../types/Product';
import BasicInfo from './components/BasicInfo';
import { SubmitButton } from '../../shared/components/SubmitButton';
import { Map } from './components/Map';
import { ExpectedReturn } from './components/ExpectedReturn';
import ProductStatus from '../../enums/ProductStatus';
import CachedImage from '../../shared/components/CachedImage';
import { MorePage, ProductPage } from '../../enums/pageEnum';
import ProviderType from '../../enums/ProviderType';
import UserContext from '../../contexts/UserContext';
import CryptoType from '../../enums/CryptoType';
import PreferenceContext from '../../contexts/PreferenceContext';
import PriceContext from '../../contexts/PriceContext';

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
  subscribed: boolean;
  product?: Product;
  loaded: boolean;
  selectedImage: number;
}

const ProductBuying: FunctionComponent = () => {
  const [state, setState] = useState<State>({
    subscribed: false,
    loaded: false,
    selectedImage: 0,
  });
  const navigation = useNavigation();
  const route = useRoute<RouteProp<ParamList, 'ProductBuying'>>();
  const { productId } = route.params;
  const viewPager = useRef<ViewPager>(null);
  const { user, isWalletUser, Server } = useContext(UserContext);
  const { t } = useTranslation();
  const { language } = useContext(PreferenceContext);
  const { elPrice, ethPrice } = useContext(PriceContext);

  const shortNationality = user.nationality
    ? user.nationality.split(', ')[1]
    : '';
  const purchasability = isWalletUser || user.ethAddresses?.length > 0;
  const isBnbProductAndCannotPurchase = !isWalletUser && state.product?.paymentMethod.toUpperCase() === CryptoType.BNB

  const submitButtonTitle = () => {
    if (state.product?.status === ProductStatus.TERMINATED) {
      return 'Sold Out';
    } else if (user.provider === ProviderType.GUEST && !purchasability) {
      return t('product_label.need_wallet');
    } else if (user.provider === ProviderType.EMAIL && !purchasability) {
      return t('product_label.non_purchasable');
    } else if (isBnbProductAndCannotPurchase) {
      return t('product_label.required_eth_wallet');
    } else if (state.product?.restrictedCountries?.includes(shortNationality)) {
      return t('product_label.restricted_country');
    } else if (state.product?.status === ProductStatus.SALE) {
      return t('product_label.invest');
    }
    return '';
  };

  const submitButtonHandler = () => {
    if (ProviderType.GUEST && !purchasability) {
      return Alert.alert(
        t('product_label.need_wallet'),
        t('product.connect_wallet_confirm'),
        [
          {
            text: 'Cancel',
            onPress: () => { },
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
    } else if (isBnbProductAndCannotPurchase) {
      return alert(t('product.required_eth_wallet'));
    } else if (user.provider === ProviderType.EMAIL && !purchasability) {
      if (state.product?.restrictedCountries.includes(shortNationality)) {
        return alert(t('product.restricted_country'));
      }
      return alert(t('product.non_purchasable'));
    } else {
      navigation.navigate(ProductPage.Purchase, {
        from: {
          type: state.product?.paymentMethod.toUpperCase() as CryptoType,
          unit: state.product?.paymentMethod.toUpperCase() as CryptoType,
          title: state.product?.paymentMethod.toUpperCase(),
        },
        to: {
          type: CryptoType.ELA,
          title: state.product?.tokenName,
        },
        toMax: state.product?.presentValue,
        contractAddress: state.product?.contractAddress,
        productId: state.product?.id,
      })
    }
  };

  const loadProduct = async () => {
    try {
      const product = await Server.productInfo(productId);
      setState({
        ...state,
        product: {
          ...product.data,
        },
        loaded: true,
      });
    } catch (e) {
      alert(t('account_errors.server'));
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
    loadProduct();
  }, [language, productId]);

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
              elPrice={elPrice}
              ethPrice={ethPrice}
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

        {!elPrice && (
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
      </ProductInfoWrapper>
    </>
  );
};

export default ProductBuying;
