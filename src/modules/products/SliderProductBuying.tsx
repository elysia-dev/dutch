/* eslint-disable radix */
import React, {
  Component,
  useState,
  useContext,
  FunctionComponent,
  useEffect,
} from 'react';
import { View, Image, Text } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import i18n from '../../i18n/i18n';
import { Calculator } from './components/Calculator';
import { SubmitButton } from '../../shared/components/SubmitButton';
import ExchangedValue from './components/ExchangedValue';
import { ProductPage } from '../../enums/pageEnum';
import RootContext from '../../contexts/RootContext';
import Product from '../../types/Product';

interface Props {
  product: Product;
  modalHandler: () => void;
  from?: string;
}

interface State {
  tokenCount: number;
}

const SliderProductBuying: FunctionComponent<Props> = props => {
  const navigation = useNavigation();
  const { Server } = useContext(RootContext);
  const [state, setState] = useState<State>({
    tokenCount: 10,
  });

  const callApi = () => {
    Server.requestTransaction(props.product.id, state.tokenCount, "buying").then(
      res => props.from === "ownershipDetail" ?
        navigation.navigate(
          "Product", {
          screen: ProductPage.PaymentSelection,
          params: {
            id: res.data.id, product: props.product, tokenCount: state.tokenCount, type: "buying",
          },
        }) : navigation.navigate(
          ProductPage.PaymentSelection, {
          id: res.data.id, product: props.product, tokenCount: state.tokenCount, type: "buying",
        }),
    ).catch(e => {
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
      <TouchableOpacity
        style={{
          position: 'relative',
          top: 0,
          width: '100%',
        }}
        onPress={props.modalHandler}>
        <Image
          source={require('./images/bluedownarrow.png')}
          style={{
            width: 30,
            height: 30,
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        />
      </TouchableOpacity>
      <Calculator
        countHandler={(token: number) => {
          setState({ ...state, tokenCount: token });
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
      <SubmitButton
        style={{
          position: 'relative',
          bottom: 0,
          marginBottom: 10,
          width: '100%',
          marginLeft: 'auto',
          marginRight: 'auto',
          marginTop: 10,
        }}
        handler={() => {
          callApi();
          props.modalHandler();
        }}
        title={i18n.t('product_label.purchase_now')}
      />
    </View>
  );
};

export default SliderProductBuying;
