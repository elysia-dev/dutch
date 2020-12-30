/* eslint-disable radix */
import React, {
  Component,
  useState,
  useContext,
  FunctionComponent,
  useEffect,
} from 'react';
import { View, Image, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import i18n from '../../i18n/i18n';
import { Calculator } from './components/Calculator';
import { SubmitButton } from '../../shared/components/SubmitButton';
import ExchangedValue from './components/ExchangedValue';
import { ProductPage } from '../../enums/pageEnum';
import RootContext from '../../contexts/RootContext';
import Product from '../../types/Product';
import ProductStatus from '../../enums/ProductStatus';
import { P2Text, P3Text } from '../../shared/components/Texts';

interface Props {
  product: Product;
  subscribed?: boolean;
  setSubcribed?: (input: boolean) => void;
  modalHandler: () => void;
  from?: string;
}

interface State {
  tokenCount: number;
}

const SliderProductBuying: FunctionComponent<Props> = (props) => {
  const navigation = useNavigation();
  const { Server } = useContext(RootContext);
  const [state, setState] = useState<State>({
    tokenCount: 10,
  });

  const submitButtonTitle = () => {
    if (
      props.product.status === ProductStatus.SALE ||
      props.from === 'ownershipDetail'
    ) {
      return i18n.t('product_label.purchase_now');
    } else if (props.product.status === ProductStatus.SUBSCRIBING) {
      if (props.subscribed) {
        return i18n.t('product_label.reserved');
      } else {
        return i18n.t('product_label.reserve');
      }
    }
    return i18n.t('product_label.non_purchasable');
  };

  const submitButtonHandler = () => {
    if (
      props.product.status === ProductStatus.SALE ||
      props.from === 'ownershipDetail'
    ) {
      callApi();
    } else if (props.product.status === ProductStatus.SUBSCRIBING) {
      if (!props.subscribed) {
        subscribeProduct();
      }
    }
  };

  const subscribeProduct = () => {
    Server.setProductSubscription(props.product.id)
      .then((_res) => {
        if (props.setSubcribed !== undefined) {
          props.setSubcribed(true);
          alert(i18n.t('product.subscribed'));
        }
      })
      .catch((e) => {
        if (e.response.status === 400) {
          alert(i18n.t('product.subscribed_already'));
        } else if (e.response.status === 404) {
          alert(i18n.t('product.subscribe_fail'));
        } else if (e.response.status === 500) {
          alert(i18n.t('account_errors.server'));
        }
      });
  };

  const callApi = () => {
    Server.requestTransaction(props.product.id, state.tokenCount, 'buying')
      .then((res) => {
        props.modalHandler();
        props.from === 'ownershipDetail'
          ? navigation.navigate('Product', {
            screen: ProductPage.PaymentSelection,
            params: {
              id: res.data.id,
              product: props.product,
              tokenCount: state.tokenCount,
              type: 'buying',
            },
          })
          : navigation.navigate(ProductPage.PaymentSelection, {
            id: res.data.id,
            product: props.product,
            tokenCount: state.tokenCount,
            type: 'buying',
          })
      }).catch((e) => {
        if (e.response.status === 400) {
          alert(i18n.t('product.transaction_error'));
        } else if (e.response.status === 500) {
          alert(i18n.t('account_errors.server'));
        }
      });
  };

  return (
    <View
      style={{
        position: 'absolute',
        bottom: 0,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        paddingLeft: 20,
        paddingRight: 20,
        height: '70%',
        width: '100%',
        backgroundColor: '#fff',
        justifyContent: 'center',
      }}>
      <View style={{ width: '100%', height: '100%' }}>
        <TouchableOpacity
          style={{
            top: 10,
            width: 30,
            height: 30,
            alignSelf: 'center',
          }}
          onPress={props.modalHandler}>
          <Image
            source={require('./images/bluedownarrow.png')}
            style={{
              width: 30,
              height: 30,
            }}
          />
        </TouchableOpacity>
        <Calculator
          sliderHandler={(token: number) => {
            setState({ ...state, tokenCount: token });
          }}
          buttonHandler={(token: number) => {
            if (
              state.tokenCount + token <
              parseInt(props.product.presentValue)
            ) {
              setState({ ...state, tokenCount: state.tokenCount + token });
            } else {
              setState({
                ...state,
                tokenCount: parseInt(props.product.presentValue, 10),
              });
            }
          }}
          tokenName={props.product.tokenName}
          tokenCount={state.tokenCount}
          return={props.product.expectedAnnualReturn}
          max={parseInt(props.product.presentValue, 10)}
        />
        <ExchangedValue
          return={props.product.expectedAnnualReturn}
          tokenCount={state.tokenCount}
          type={'buy'}
        />
        {props.product.status === ProductStatus.SUBSCRIBING && (
          <P3Text label={i18n.t('product.for_subscription')} />
        )}
        <SubmitButton
          disabled={props.subscribed && props.product.status !== ProductStatus.SALE}
          style={{
            position: 'absolute',
            bottom: 15,
            marginBottom: 10,
            width: '100%',
            marginLeft: 'auto',
            marginRight: 'auto',
            marginTop: 10,
            backgroundColor: props.subscribed ? '#D0D8DF' : '#3679B5',
          }}
          handler={submitButtonHandler}
          title={submitButtonTitle()}
        />
      </View>
    </View>
  );
};

export default SliderProductBuying;
