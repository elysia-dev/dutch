/* eslint-disable radix */
import React, { useState, FunctionComponent, useContext } from 'react';
import Slider from '@react-native-community/slider';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next'
import Product from '../../../types/Product';
import { P2Text, H3Text, P1Text, H2Text } from '../../../shared/components/Texts';
import PreferenceContext from '../../../contexts/PreferenceContext';

interface Props {
  product: Product;
}

interface State {
  tokenCount: number;
}

export const ExpectedReturn: FunctionComponent<Props> = (props) => {
  const { currencyFormatter } = useContext(PreferenceContext)

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
      <H3Text style={{ paddingBottom: 10 }} label={t('dashboard_label.expected_profit')} />
      <P1Text style={{ paddingBottom: 20 }} label={"약 24개월 동안 매일 월세(수익금)가 지급될 예정입니다."} />
      <View style={{ paddingTop: 10 }}>
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
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: 20,
          marginBottom: 5,
        }}>
        <H3Text label={t('product_label.investment')} />
        <H3Text
          label={currencyFormatter(
            state.tokenCount * 5,
            2,
          )}
        />
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: 5,
          marginBottom: 20,
        }}>
        <H3Text 
          style={{
            color: "#3679b5"
          }}
          label={t('product_label.expected_return')} />
        <H3Text
          label={currencyFormatter(
            0.01 *
            parseFloat(props.product.expectedAnnualReturn) *
            5 *
            state.tokenCount,
            2,
          )}
          style={{ color: '#3679b5' }}
        />
      </View>
      
    </View>
  );
};
