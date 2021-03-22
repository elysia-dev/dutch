import React, { FunctionComponent, useContext } from 'react';
import { View, Dimensions, Text } from 'react-native';
import { Grid, LineChart, YAxis } from 'react-native-svg-charts';
import { Circle } from 'react-native-svg';
import { useTranslation } from 'react-i18next'
import { SummaryReportResponse } from '../../../types/SummaryReport';
import { P1Text } from '../../../shared/components/Texts';
import dayFormatter from '../../../utiles/dayFormatter';
import PreferenceContext from '../../../contexts/PreferenceContext';

type Props = {
  content: SummaryReportResponse['content'];
};

export const AssetValueCard: FunctionComponent<Props> = (props) => {
  const { currencyFormatter } = useContext(PreferenceContext)

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

  const value = Array(7)
    .fill(0)
    .map((_day, index) =>
      parseFloat(props.content[`day${6 - index}`].dailyValue),
    );

  const maxValue = value.reduce((max, currentValue) => {
    return Math.max(max, currentValue);
  }, 0);

  const Decorator = ({ x, y }) => {
    return value.map((value: number, index: number) => (
      <Circle
        key={index}
        cx={x(index)}
        cy={y(value)}
        r={4}
        stroke={'#0F4C81'}
        strokeWidth={1.5}
        fill={'white'}
      />
    ));
  };

  return (
    <View
      style={{
        backgroundColor: '#fff',
        width: '100%',
        height: 270,
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
      <P1Text label={t('dashboard_label.total_property')} />
      <View
        style={{
          height: 200,
          flexDirection: 'row',
        }}>
        <YAxis
          min={0}
          max={maxValue ? maxValue * 1.5 : 100}
          style={{
            flex: 1.5,
            height: 185,
            top: 0,
            flexDirection: 'row',
          }}
          data={value}
          contentInset={{ top: 20, bottom: 10 }}
          svg={{
            fill: '#A7A7A7',
            fontSize: 10,
          }}
          numberOfTicks={4}
          formatLabel={(value) =>
            `${maxValue > 10
              ? currencyFormatter(
                parseFloat(value),
                0,
              )
              : currencyFormatter(
                parseFloat(value),
                3,
              )
            }`
          }
        />
        <View style={{ flex: 8 }}>
          <LineChart
            yMin={0}
            yMax={maxValue * 1.5}
            style={{ marginLeft: 0, marginRight: 0, height: 185, top: 0 }}
            data={value}
            svg={{
              stroke: '#0F4C81',
              strokeWidth: 1.5,
              strokeLinejoin: 'round',
            }}
            contentInset={{ top: 20, bottom: 10, left: 10, right: 10 }}
            numberOfTicks={4}>
            <Grid svg={{ stroke: '#f5f5f5', strokeWidth: 1.5 }} />
            <Decorator />
          </LineChart>
        </View>
      </View>
      <View
        style={{
          width: ((Dimensions.get('window').width - 50) * 8) / 9.5,
          left: 10,
          top: -10,
          marginHorizontal: (Dimensions.get('window').width - 40) / 11,
          paddingHorizontal: 13,
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        {translatedDay}
      </View>
    </View>
  );
};
