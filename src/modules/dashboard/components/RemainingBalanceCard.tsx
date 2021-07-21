import React, { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { P1Text, P2Text, H2Text } from '../../../shared/components/Texts';
import AppColors from '../../../enums/AppColors';

interface Props {
  totalBalance: number;
  usd: number;
  el: number;
}

export const RemainingBalanceCard: FunctionComponent<Props> = (props: Props) => {
  const { t } = useTranslation()
  return (
    <View
      style={{
        backgroundColor: AppColors.WHITE,
        width: '99%',
        height: 205,
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
        label={`$ ${(props.totalBalance).toFixed(2)}`}
      />
      <View
        style={{
          borderWidth: 1,
          borderRadius: 10,
          borderColor: '#F1F1F1',
          width: '100%',
          height: 89,
          paddingTop: 20,
          paddingBottom: 20,
          paddingLeft: 16,
          paddingRight: 16,
          flexDirection: 'column',
          alignContent: 'space-between',
        }}>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingBottom: 12,
          }}>
          <P2Text label={t("dashboard_label.remaining_usd")} />
          <P1Text
            style={{ textAlign: 'right' }}
            label={`$ ${(props.usd).toFixed(
              2,
            )}`}
          />
        </View>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <P2Text label={t("dashboard_label.remaining_el")} />
          <P1Text
            style={{ textAlign: 'right' }}
            label={`EL ${(props.el).toFixed(
              3,
            )}`}
          />
        </View>
      </View>
    </View>
  );
};