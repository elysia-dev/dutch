import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import React, { Component, FunctionComponent } from 'react';
import { StyleSheet, View, Text, ScrollView, Image } from 'react-native';
import styled from 'styled-components/native';
import i18n from '../../i18n/i18n';
import { BackButton } from '../../shared/components/BackButton';
import { SummaryReportResponse } from '../../types/SummaryReport';
import { AssetGraphCard } from './components/AssetGraphCard';
import { AssetValueGraphCard } from './components/AssetValueGraphCard';
import { AverageReturnCard } from './components/AverageReturnCard';
import { SummaryPropertyCard } from './components/SummaryPropertyCard';

const H1Text = styled.Text`
  color: #1c1c1c;
  font-size: 28px;
  text-align: left;
  font-weight: bold;
  margin-top: 10px;
  margin-bottom: 30px;
`;

type ParamList = {
  SummaryReport: {
    report: SummaryReportResponse;
  };
};

export const SummaryReport: FunctionComponent<{}> = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<ParamList, 'SummaryReport'>>();
  const { report } = route.params;
  // const [state, setState] = useState({
  //   transactions: transaction,
  //   transactionCount: 2,
  // });

  return (
    <ScrollView
      style={{
        width: '100%',
        height: '100%',
        top: 0,
        backgroundColor: '#FAFCFF',
        padding: 20,
      }}>
      <BackButton
        style={{ marginTop: 30 }}
        handler={() => navigation.goBack()}
      />

      <H1Text>{i18n.t('dashboard_label.asset_report')}</H1Text>
      <SummaryPropertyCard summary={report.summary} />
      <AverageReturnCard return={report.summary.averageAnnualReturn} />
      <AssetGraphCard content={report.content} />
      <AssetValueGraphCard ownerships={report.content.ownerships} />
    </ScrollView>
  );
};
