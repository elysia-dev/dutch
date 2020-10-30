import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import React, { Component, FunctionComponent, useContext, useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Image } from 'react-native';
import styled from 'styled-components/native';
import RootContext from '../../contexts/RootContext';
import i18n from '../../i18n/i18n';
import { BackButton } from '../../shared/components/BackButton';
import { defaultSummaryReportResponse, SummaryReportResponse } from '../../types/SummaryReport';
import { AssetGraphCard } from './components/AssetGraphCard';
import { AssetValueGraphCard } from './components/AssetValueGraphCard';
import { AverageReturnCard } from './components/AverageReturnCard';
import { SummaryPropertyCard } from './components/SummaryPropertyCard';
import { TitleText } from '../../shared/components/Texts';


export const SummaryReport: FunctionComponent<{}> = () => {
  const navigation = useNavigation();
  const { Server } = useContext(RootContext);
  const [report, setReport] = useState(defaultSummaryReportResponse);

  const callSummaryApi = () => {
    Server.getSummaryReport()
      .then((res) => {
        setReport(res.data);
      })
      .catch((e) => {
        if (e.response.status === 500) {
          alert(i18n.t('account_errors.server'));
        }
      });
  };

  useEffect(() => { callSummaryApi(); }, []);

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
        style={{ marginTop: 10 }}
        handler={() => navigation.goBack()}
      />

      <TitleText style={{ marginTop: 10, marginBottom: 30 }} label={i18n.t('dashboard_label.asset_report')} />
      <SummaryPropertyCard summary={report.summary} />
      <AverageReturnCard return={report.summary.averageAnnualReturn} />
      <AssetGraphCard content={report.content} />
      <AssetValueGraphCard ownerships={report.content.ownerships} />
    </ScrollView>
  );
};
