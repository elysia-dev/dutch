import React, {
  FunctionComponent,
  useState,
  useEffect,
  useContext,
} from 'react';
import { View, ScrollView, StatusBar, Alert } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { BackButton } from '../../shared/components/BackButton';
import WrappedInfo from './components/WrappedInfo';
import Product from '../../types/Product';
import BasicInfo from './components/BasicInfo';
import { SubmitButton } from '../../shared/components/SubmitButton';
import { Map } from './components/Map';
import { ExpectedReturn } from './components/ExpectedReturn';
import ProductStatus from '../../enums/ProductStatus';
import { MorePage, ProductPage } from '../../enums/pageEnum';
import ProviderType from '../../enums/ProviderType';
import UserContext from '../../contexts/UserContext';
import CryptoType from '../../enums/CryptoType';
import PreferenceContext from '../../contexts/PreferenceContext';
import ProductImageCarousel from '../../shared/components/ProductImageCarousel';
import AppColors from '../../enums/AppColors';

type ParamList = {
  ProductBuying: {
    productId: number;
  };
};

interface State {
  subscribed: boolean;
  product?: Product;
  loaded: boolean;
}

const ProductBuying: FunctionComponent = () => {
  const [state, setState] = useState<State>({
    subscribed: false,
    loaded: false,
  });
  const navigation = useNavigation();
  const route = useRoute<RouteProp<ParamList, 'ProductBuying'>>();
  const { productId } = route.params;
  const { user, isWalletUser, Server } = useContext(UserContext);
  const { t } = useTranslation();
  const { language } = useContext(PreferenceContext);
  const insets = useSafeAreaInsets();

  const shortNationality = user.nationality
    ? user.nationality.split(', ')[1]
    : '';
  const purchasability = isWalletUser || user.ethAddresses?.length > 0;
  const isBnbProductAndCannotPurchase =
    !isWalletUser &&
    state.product?.paymentMethod.toUpperCase() === CryptoType.BNB;

  const submitButtonTitle = () => {
    if (state.product?.status === ProductStatus.TERMINATED) {
      return 'Sold Out';
    } else if (user.provider === ProviderType.GUEST && !purchasability) {
      return t('product_label.need_wallet');
    } else if (user.provider === ProviderType.EMAIL && !purchasability) {
      return t('product_label.non_purchasable');
    }
    // else if (isBnbProductAndCannotPurchase) {
    //   return t('product_label.required_eth_wallet');
    // }
    else if (state.product?.restrictedCountries?.includes(shortNationality)) {
      return t('product_label.restricted_country');
    } else if (state.product?.status === ProductStatus.SALE) {
      return t('assets.purchase');
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
    }
    // else if (isBnbProductAndCannotPurchase) {
    //   return alert(t('product.required_eth_wallet'));
    // }
    else if (user.provider === ProviderType.EMAIL && !purchasability) {
      if (state.product?.restrictedCountries.includes(shortNationality)) {
        return alert(t('product.restricted_country'));
      }
      return alert(t('product.non_purchasable'));
    } else {
      navigation.navigate(ProductPage.Purchase, {
        assetInCrypto: { // 이거랑 to가 Asset 타입이어야 함!!!! 내 자산에서 살 때랑 똑같이
          type: state.product?.paymentMethod.toUpperCase() as CryptoType,
          unit: state.product?.paymentMethod.toUpperCase() as CryptoType,
          title: state.product?.paymentMethod.toUpperCase(),
          value: state.product?.totalValue, // 이것도 필요하던가... 아니 근데 이걸 나중에 잔고로 쓰기도 함....?ㅠㅠ
        },
        assetInToken: {
          type: CryptoType.ELA,
          unit: state.product?.tokenName,
          title: state.product?.tokenName,
          value: state.product?.totalValue,
        },
        remainingSupplyInToken: parseFloat(state.product?.presentValue || '0'),
        contractAddress: state.product?.contractAddress,
        productId: state.product?.id,
      });
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

  useEffect(() => {
    loadProduct();
  }, [language, productId]);

  return (
    <>
      <View
        style={{
          backgroundColor: AppColors.WHITE,
          height: '100%',
          width: '100%',
        }}
      >
        <ScrollView
          scrollEnabled={true}
          scrollToOverflowEnabled={true}
          style={{
            height: '100%',
            backgroundColor: AppColors.WHITE,
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
            <ProductImageCarousel images={state.product?.data.images || []} />
            <View style={{ position: 'absolute', padding: 20 }}>
              <View
                style={{
                  position: 'absolute',
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  backgroundColor: 'rgba(255,255,255,0.5)',
                  marginLeft: 12,
                  marginTop: 32,
                }}
              />
              <BackButton
                handler={() => {
                  StatusBar.setHidden(true);
                  navigation.goBack();
                }}
              />
            </View>
          </View>
          {state.product && <BasicInfo product={state.product} />}
          {state.product && state.product?.status !== ProductStatus.TERMINATED && (
            <View
              style={{
                padding: 20,
                borderBottomColor: '#F6F6F8',
                borderBottomWidth: 5,
                height: 198,
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
            bottom: insets.bottom || 10,
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
      </View>
    </>
  );
};

export default ProductBuying;
