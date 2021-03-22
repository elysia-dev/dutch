import React, { FunctionComponent, useContext } from 'react';
import { View, Dimensions, Text } from 'react-native';
import { BarChart, Grid, YAxis } from 'react-native-svg-charts';
import { useTranslation } from 'react-i18next'
import { SummaryReportResponse } from '../../../types/SummaryReport';
import currencyFormatter from '../../../utiles/currencyFormatter';
import { P1Text } from '../../../shared/components/Texts';
import dayFormatter from '../../../utiles/dayFormatter';
import CurrencyContext from '../../../contexts/CurrencyContext';

interface Props {
  content: SummaryReportResponse['content'];
}

type Profit = {
  value: number;
  svg?: {
    fill?: string;
  };
};

export const AssetProfitCard: FunctionComponent<Props> = (props) => {
  const { currencyUnit, currencyRatio } = useContext(CurrencyContext);
  const today = new Date().getDay();
  const { t } = useTranslation();

  const day = Array(7)
    .fill(0)
    .map((_day, index) => dayFormatter(today - 6 + index));

  const translatedDay = day.map((value, index) => (
    <Text
      allowFontScaling={false}
      key={index}
      style={{ color: '#A7A7A7', fontSize: 12, textAlign: 'center' }}>
      {t(`day.${value}`)}
    </Text>
  ));

  const pastSixDaysProfit: Profit[] = Array(6)
    .fill(0)
    .map((_day, index) => ({
      value: parseFloat(props.content[`day${6 - index}`].dailyProfits),
    }));
  const thisWeekProfit = pastSixDaysProfit.concat({
    value: parseFloat(props.content.day0.dailyProfits),
    svg: {
      fill: '#3679B5',
    },
  });

  const maxProfit = thisWeekProfit
    .map((day, _index) => day.value)
    .reduce((max, current) => {
      return Math.max(max, current);
    }, 0);

  return (
    <View
      style={{
        backgroundColor: '#fff',
        width: '100%',
        height: 280,
        borderRadius: 10,
        shadowOffset: { width: 2, height: 1 },
        shadowColor: '#3679B540',
        shadowOpacity: 0.8,
        shadowRadius: 5,
        paddingVertical: 20,
        paddingHorizontal: 15,
        marginBottom: 20,
        elevation: 1,
        marginLeft: 3,
        marginRight: 3,
      }}>
      <P1Text label={t('dashboard_label.daily_reward')} />
      <View
        style={{
          height: 200,
          flexDirection: 'row',
        }}>
        <YAxis
          min={0}
          max={maxProfit ? maxProfit * 1.5 : 50}
          style={{
            flex: 1.5,
            height: 200,
          }}
          data={thisWeekProfit}
          yAccessor={({ item }) => item.value}
          contentInset={{ top: 20, bottom: 10 }}
          svg={{
            fill: '#A7A7A7',
            fontSize: 10,
          }}
          numberOfTicks={3}
          formatLabel={(value: string) =>
            `${maxProfit > 10
              ? currencyFormatter(
                currencyUnit,
                currencyRatio,
                parseFloat(value),
                0,
              )
              : currencyFormatter(
                currencyUnit,
                currencyRatio,
                parseFloat(value),
                3,
              )
            }`
          }
        />
        <View style={{ flex: 8 }}>
          <BarChart
            yMin={0}
            yMax={maxProfit ? maxProfit * 1.5 : 50}
            yAccessor={({ item }) => item.value}
            style={{ marginLeft: 0, marginRight: 0, height: 200 }}
            spacingInner={0.7}
            spacingOuter={0}
            data={thisWeekProfit}
            svg={{ fill: '#E6ECF2' }}
            contentInset={{ top: 20, bottom: 10, left: 10, right: 10 }}
            numberOfTicks={3}>
            <Grid svg={{ stroke: '#f5f5f5', strokeWidth: 1.5 }} />
          </BarChart>
        </View>
      </View>
      <View
        style={{
          width: ((Dimensions.get('window').width - 50) * 8) / 9 - 20,
          left: 10,
          marginHorizontal: (Dimensions.get('window').width - 40) / 11,
          paddingHorizontal: 15,
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        {translatedDay}
      </View>
    </View>
  );
};
