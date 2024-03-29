/* eslint-disable radix */
import React, { useState, FunctionComponent, useContext } from 'react';
import Slider from '@react-native-community/slider';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import Product from '../../../types/Product';
import {
  P2Text,
  H3Text,
  P1Text,
  H2Text,
} from '../../../shared/components/Texts';
import PreferenceContext from '../../../contexts/PreferenceContext';
import AppColors from '../../../enums/AppColors';

interface Props {
  product: Product;
}

interface State {
  tokenCount: number;
}

export const ExpectedReturn: FunctionComponent<Props> = (props) => {
  const { currencyFormatter } = useContext(PreferenceContext);

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
      <H3Text
        style={{ paddingBottom: 20 }}
        label={t('dashboard_label.expected_profit')}
      />
      <View style={{ paddingTop: 10 }}>
        <Slider
          minimumValue={0}
          maximumValue={parseInt(props.product.presentValue, 10)}
          minimumTrackTintColor={AppColors.MAIN}
          maximumTrackTintColor={AppColors.BLACK2}
          thumbTintColor={AppColors.MAIN}
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
        <P1Text label={t('product_label.investment')} />
        <P1Text label={currencyFormatter(state.tokenCount * 5, 2)} />
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: 5,
          marginBottom: 20,
        }}>
        <P1Text
          style={{
            color: AppColors.MAIN,
          }}
          label={t('product_label.expected_return')}
        />
        <P1Text
          label={currencyFormatter(
            0.01 *
              parseFloat(props.product.expectedAnnualReturn) *
              5 *
              state.tokenCount,
            2,
          )}
          style={{ color: AppColors.MAIN }}
        />
      </View>
    </View>
  );
};
