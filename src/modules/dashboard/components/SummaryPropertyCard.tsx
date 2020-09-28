import React, { FunctionComponent } from 'react';
import styled from 'styled-components/native';

import { View } from 'react-native';
import i18n from '../../../i18n/i18n';
import { SummaryReportResponse } from '../../../types/SummaryReport';

interface Props {
  summary: SummaryReportResponse['summary'];
}

const H1Text = styled.Text`
  color: #1c1c1c;
  font-size: 15px;
  text-align: left;
  margin-bottom: 10px;
`;
const NumText = styled.Text`
  color: #1c1c1c;
  font-size: 25px;
  text-align: left;
  font-weight: bold;
  margin-bottom: 18px;
`;
const PText = styled.Text`
  color: #838383;
  font-size: 15px;
  text-align: left;
`;
const NumText2 = styled.Text`
  color: #1c1c1c;
  font-size: 15px;
  text-align: right;
`;
export const SummaryPropertyCard: FunctionComponent<Props> = (props: Props) => {
  return (
    <View
      style={{
        backgroundColor: '#fff',
        width: '100%',
        height: 265,
        borderRadius: 10,
        shadowOffset: { width: 2, height: 2 },
        shadowColor: '#3679B540',
        shadowOpacity: 0.8,
        shadowRadius: 5,
        padding: 20,
        marginBottom: 20,
      }}>
      <H1Text>{'Total Balance'}</H1Text>
      <NumText>{`$ ${parseFloat(props.summary.totalBalance).toFixed(
        2,
      )}`}</NumText>
      <View
        style={{
          borderWidth: 1,
          borderRadius: 10,
          borderColor: '#F1F1F1',
          width: '100%',
          height: 150,
          padding: 20,
          flexDirection: 'column',
          alignContent: 'space-between',
        }}>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <PText>{i18n.t('dashboard_label.total_property')}</PText>
          <NumText2>{`$ ${parseFloat(
            props.summary.totalRealEstateValue,
          ).toFixed(2)}`}</NumText2>
        </View>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <PText>{i18n.t('dashboard_label.total_interest')}</PText>
          <NumText2>{`$ ${parseFloat(props.summary.totalInterest).toFixed(
            2,
          )}`}</NumText2>
        </View>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <PText>{i18n.t('dashboard_label.withdrawn_interest')}</PText>
          <NumText2>{`$ ${parseFloat(props.summary.withdrawnInterest).toFixed(
            2,
          )}`}</NumText2>
        </View>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <PText>{i18n.t('dashboard_label.available_interest')}</PText>
          <NumText2>{`$ ${parseFloat(
            props.summary.withdrawableInterest,
          ).toFixed(2)}`}</NumText2>
        </View>
      </View>
    </View>
  );
};
