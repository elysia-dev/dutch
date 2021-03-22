import { useNavigation } from '@react-navigation/native';
import React, {
  FunctionComponent,
  useContext,
  useEffect,
  useState,
} from 'react';
import { ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next'
import { BackButton } from '../../shared/components/BackButton';
import { defaultSummaryReportResponse } from '../../types/SummaryReport';
import { AssetValueCard } from './components/AssetValueCard';
import { AssetProfitCard } from './components/AssetProfitCard';
import { AssetRatioCard } from './components/AssetRatioCard';
import { AverageReturnCard } from './components/AverageReturnCard';
import { SummaryPropertyCard } from './components/SummaryPropertyCard';
import { TitleText } from '../../shared/components/Texts';
import FunctionContext from '../../contexts/FunctionContext';

export const SummaryReport: FunctionComponent<{}> = () => {
  const navigation = useNavigation();
  const { Server } = useContext(FunctionContext);
  const [report, setReport] = useState(defaultSummaryReportResponse);
  const { t } = useTranslation();

  const callSummaryApi = () => {
    Server.getSummaryReport()
      .then((res) => {
        setReport(res.data);
      })
      .catch((e) => {
        if (e.response.status === 500) {
          alert(t('account_errors.server'));
        }
      });
  };

  useEffect(() => {
    callSummaryApi();
  }, []);

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

      <TitleText
        style={{ marginTop: 10, marginBottom: 30 }}
        label={t('dashboard_label.asset_report')}
      />
      <SummaryPropertyCard summary={report.summary} />
      <AverageReturnCard return={report.summary.averageAnnualReturn} />
      <AssetValueCard content={report.content} />
      <AssetProfitCard content={report.content} />
      <AssetRatioCard ownerships={report.content.ownerships} />
    </ScrollView>
  );
};
