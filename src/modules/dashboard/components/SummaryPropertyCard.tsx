import React, { FunctionComponent, useContext } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next'
import { SummaryReportResponse } from '../../../types/SummaryReport';
import { P1Text, P2Text, H2Text } from '../../../shared/components/Texts';
import PreferenceContext from '../../../contexts/PreferenceContext';

interface Props {
  summary: SummaryReportResponse['summary'];
}

export const SummaryPropertyCard: FunctionComponent<Props> = (props: Props) => {
  const { currencyFormatter } = useContext(PreferenceContext)
  const { t } = useTranslation();

  return (
    <View
      style={{
        backgroundColor: '#fff',
        width: '99%',
        height: 265,
        borderRadius: 10,
        shadowOffset: { width: 2, height: 2 },
        shadowColor: '#3679B540',
        shadowOpacity: 0.8,
        shadowRadius: 5,
        padding: 20,
        marginBottom: 20,
        elevation: 1,
        marginLeft: 3,
        marginRight: 3,
      }}>
      <P1Text
        label={t('dashboard_label.total_balance')}
        style={{ marginBottom: 10 }}
      />
      <H2Text
        style={{ marginBottom: 18 }}
        label={currencyFormatter(
          parseFloat(props.summary.totalBalance),
          4,
        )}
      />
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
          <P2Text label={t('dashboard_label.total_property')} />
          <P1Text
            style={{ textAlign: 'right' }}
            label={currencyFormatter(
              parseFloat(props.summary.totalRealEstateValue),
              4,
            )}
          />
        </View>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <P2Text label={t('dashboard_label.total_interest')} />
          <P1Text
            style={{ textAlign: 'right' }}
            label={currencyFormatter(
              parseFloat(props.summary.totalInterest),
              4,
            )}
          />
        </View>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <P2Text label={t('dashboard_label.withdrawn_interest')} />
          <P1Text
            style={{ textAlign: 'right' }}
            label={currencyFormatter(
              parseFloat(props.summary.withdrawnInterest),
              4,
            )}
          />
        </View>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <P2Text label={t('dashboard_label.available_interest')} />
          <P1Text
            style={{ textAlign: 'right' }}
            label={currencyFormatter(
              parseFloat(props.summary.withdrawableInterest),
              4,
            )}
          />
        </View>
      </View>
    </View>
  );
};
