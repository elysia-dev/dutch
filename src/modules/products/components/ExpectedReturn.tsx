/* eslint-disable radix */
import React, { useState, FunctionComponent, useContext } from 'react';
import Slider from '@react-native-community/slider';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next'
import Product from '../../../types/Product';
import { P2Text, H3Text } from '../../../shared/components/Texts';
import currencyFormatter from '../../../utiles/currencyFormatter';
import CurrencyContext from '../../../contexts/CurrencyContext';

interface Props {
  product: Product;
}

interface State {
  tokenCount: number;
}

export const ExpectedReturn: FunctionComponent<Props> = (props) => {
  const { currencyUnit, currencyRatio } = useContext(CurrencyContext);
  const { t } = useTranslation();

  const [state, setState] = useState<State>({
    tokenCount: 10,
  });
  return (
    <View
      style={{
        width: '100%',
        borderRadius: 5,
      }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginBottom: 5,
        }}>
        <P2Text label={t('product_label.investment')} />
        <P2Text label={t('product_label.expected_return')} />
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginBottom: 5,
        }}>
        <H3Text
          label={currencyFormatter(
            currencyUnit,
            currencyRatio,
            state.tokenCount * 5,
            2,
          )}
        />
        <H3Text
          label={currencyFormatter(
            currencyUnit,
            currencyRatio,
            0.01 *
            parseFloat(props.product.expectedAnnualReturn) *
            5 *
            state.tokenCount,
            2,
          )}
          style={{ color: '#3679b5' }}
        />
      </View>
      <View style={{ paddingTop: 10, height: '100%' }}>
        <Slider
          minimumValue={0}
          maximumValue={parseInt(props.product.presentValue, 10)}
          minimumTrackTintColor={'#3679B5'}
          maximumTrackTintColor={'#626368'}
          thumbTintColor={'#3679B5'}
          value={state.tokenCount}
          step={1}
          onValueChange={(token: number) => {
            setState({ ...state, tokenCount: token });
          }}
        />
      </View>
    </View>
  );
};
