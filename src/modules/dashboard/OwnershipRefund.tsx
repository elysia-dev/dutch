/* eslint-disable radix */
import React, {
  useState,
  useContext,
  FunctionComponent,
} from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import i18n from '../../i18n/i18n';
import { Calculator } from '../products/components/Calculator';
import { SubmitButton } from '../../shared/components/SubmitButton';
import ExchangedValue from '../products/components/ExchangedValue';
import { OwnershipResponse } from '../../types/Ownership';
import RootContext from '../../contexts/RootContext';
import { ProductPage } from '../../enums/pageEnum';

interface Props {
  modalHandler: () => void;
  ownership: OwnershipResponse;
}

const OwnershipRefund: FunctionComponent<Props> = (props) => {
  const [tokenCount, setTokenCount] = useState(1);
  const { Server } = useContext(RootContext);
  const product = props.ownership.product;
  const navigation = useNavigation();

  const callApi = () => {
    Server.requestTransaction(product.id, tokenCount, 'refund')
      .then((res) =>
        navigation.navigate('Product', {
          screen: ProductPage.PaymentSelection,
          params: {
            id: res.data.id,
            product,
            tokenCount,
            type: 'refund',
          },
        }),
      )
      .catch((e) => {
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
          type={'refund'}
          sliderHandler={(token: number) => {
            setTokenCount(token);
          }}
          buttonHandler={(token: number) => {
            if (tokenCount + token < props.ownership.tokenValue) {
              setTokenCount(tokenCount + token);
            } else {
              setTokenCount(props.ownership.tokenValue);
            }
          }}
          tokenName={props.ownership.product.tokenName}
          tokenCount={tokenCount}
          max={props.ownership.tokenValue}
        />
        <ExchangedValue
          tokenCount={tokenCount}
          type={'refund'}
          hasEth={props.ownership.product.paymentMethod === 'eth'}
        />
        <SubmitButton
          style={{
            position: 'absolute',
            bottom: 15,
            marginBottom: 10,
            width: '100%',
            marginLeft: 'auto',
            marginRight: 'auto',
            marginTop: 10,
          }}
          handler={() => {
            props.modalHandler();
            callApi();
          }}
          title={i18n.t('product_label.refund', {
            paymentMethod: props.ownership.product.paymentMethod.toUpperCase(),
          })}
        />
      </View>
    </View>
  );
};

export default OwnershipRefund;
