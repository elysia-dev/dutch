import React, { FunctionComponent } from 'react';
import { View, Dimensions, Text } from 'react-native';
import styled from 'styled-components/native';
import { StackedBarChart } from 'react-native-chart-kit';
import {
  BarChart,
  Grid,
  LineChart,
  YAxis,
  XAxis,
} from 'react-native-svg-charts';
import { Circle } from 'react-native-svg';
import i18n from '../../../i18n/i18n';
import { SummaryReportResponse } from '../../../types/SummaryReport';

const H1Text = styled.Text`
  color: #1c1c1c;
  font-size: 15px;
  text-align: left;
  margin-bottom: 10px;
  padding-left: 5px;
  font-family: 'Roboto_400Regular';
`;

interface Props {
  content: SummaryReportResponse['content'];
}

export const AssetGraphCard: FunctionComponent<Props> = (props) => {
  const fill = '#E6ECF2';
  const today = new Date().getDay();
  const dayFormatter = (day: number) => {
    if (day >= 0) {
      return day;
    } else {
      return day + 7;
    }
  };
  const day = [
    dayFormatter(today - 6),
    dayFormatter(today - 5),
    dayFormatter(today - 4),
    dayFormatter(today - 3),
    dayFormatter(today - 2),
    dayFormatter(today - 1),
    dayFormatter(today),
  ];
  const translatedDay = day.map((value, index) => (
    <Text
      allowFontScaling={false}
      key={index}
      style={{ color: '#A7A7A7', fontSize: 12, textAlign: 'center' }}>
      {i18n.t(`day.${value}`)}
    </Text>
  ));

  const profit = [
    { value: parseFloat(props.content.day0.dailyProfits) },
    { value: parseFloat(props.content.day1.dailyProfits) },
    { value: parseFloat(props.content.day2.dailyProfits) },
    { value: parseFloat(props.content.day3.dailyProfits) },
    { value: parseFloat(props.content.day4.dailyProfits) },
    { value: parseFloat(props.content.day5.dailyProfits) },
    {
      value: parseFloat(props.content.day6.dailyProfits),
      svg: {
        fill: '#3679B5',
      },
    },
  ];

  const minProfit = profit
    .map((day, index) => day.value)
    .reduce((min, current) => {
      return Math.min(min, current);
    }, 0);

  const maxProfit = profit
    .map((day, index) => day.value)
    .reduce((max, current) => {
      return Math.max(max, current);
    }, 0);

  const value = [
    parseFloat(props.content.day0.dailyValue),
    parseFloat(props.content.day1.dailyValue),
    parseFloat(props.content.day2.dailyValue),
    parseFloat(props.content.day3.dailyValue),
    parseFloat(props.content.day4.dailyValue),
    parseFloat(props.content.day5.dailyValue),
    parseFloat(props.content.day6.dailyValue),
  ];

  const minValue = value.reduce((min, currentValue) => {
    return Math.min(min, currentValue);
  }, 0);

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

  const graphLegend = (color: string, text: string) => (
    <View
      style={{
        flexDirection: 'row',
        marginTop: 4,
        marginBottom: 4,
        alignItems: 'center',
      }}>
      <View
        style={{
          backgroundColor: color,
          width: 14,
          height: 14,
          borderRadius: 7,
        }}></View>
      <Text
        allowFontScaling={false}
        style={{
          marginLeft: 5,
          fontSize: 15,
          color: '#4E4E4E',
          textAlign: 'left',
        }}>
        {text}
      </Text>
    </View>
  );

  return (
    <View
      style={{
        backgroundColor: '#fff',
        width: '99%',
        height: 390,
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
      <H1Text allowFontScaling={false}>
        {i18n.t('dashboard_label.asset_graph')}
      </H1Text>
      <View
        style={{
          height: 200,
          flexDirection: 'row',
        }}>
        <YAxis
          min={0}
          max={maxProfit * 1.25}
          style={{ flex: 1.5, height: 200, top: 0 }}
          data={profit}
          yAccessor={({ item }) => item.value}
          contentInset={{ top: 20, bottom: 10 }}
          svg={{
            fill: '#A7A7A7',
            fontSize: 10,
          }}
          numberOfTicks={3}
          formatLabel={(value) => `$ ${parseInt(value, 10)}`}
        />
        <View style={{ flex: 8 }}>
          <BarChart
            yMin={0}
            yMax={maxProfit * 1.25}
            yAccessor={({ item }) => item.value}
            style={{ marginLeft: 0, marginRight: 0, height: 200 }}
            spacingInner={0.7}
            spacingOuter={0}
            data={profit}
            svg={{ fill: '#E6ECF2' }}
            contentInset={{ top: 20, bottom: 10, left: 5, right: 10 }}
            numberOfTicks={3}>
            <Grid svg={{ stroke: '#f5f5f5', strokeWidth: 1.5 }} />
          </BarChart>
          <LineChart
            yMin={0}
            yMax={maxValue * 1.25}
            style={{ marginLeft: 0, marginRight: 0, height: 185, top: -185 }}
            data={value}
            svg={{
              stroke: '#0F4C81',
              strokeWidth: 1.5,
              strokeLinejoin: 'round',
            }}
            contentInset={{ top: 20, bottom: 10, left: 10, right: 15 }}
            numberOfTicks={3}>
            <Decorator />
          </LineChart>
        </View>
        <YAxis
          min={0}
          max={maxValue * 1.25}
          style={{
            flex: 1.5,
            height: 185,
            top: 15,
          }}
          data={value}
          contentInset={{ top: 20, bottom: 10 }}
          svg={{
            fill: '#A7A7A7',
            fontSize: 10,
          }}
          numberOfTicks={3}
          formatLabel={(value) => `$ ${parseInt(value, 10)}`}
        />
      </View>
      <View
        style={{
          width: ((Dimensions.get('window').width - 50) * 8) / 11,
          marginHorizontal: (Dimensions.get('window').width - 40) / 11,
          paddingHorizontal: 15,
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        {translatedDay}
      </View>
      <View
        style={{
          width: '100%',
          top: 20,
          padding: 20,
          borderRadius: 10,
          borderWidth: 1,
          borderColor: '#F1F1F1',
        }}>
        {graphLegend('#E6ECF2', 'Daily Rewards')}
        {graphLegend('#0F4C81', 'Total Value')}
      </View>
    </View>
  );
};
