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
`;

interface Props {
  content: SummaryReportResponse['content'];
}

export const AssetGraphCard: FunctionComponent<Props> = props => {
  const fill = '#E6ECF2';
  const today = new Date().getDay();
  const dayFormatter = (day: number) => {
    if (day > 0) {
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
  const translatedDay = day.map((value, index) => i18n.t(`day.${value}`));

  // const data = [
  //   parseFloat(props.content.day1.dailyProfits),
  //   parseFloat(props.content.day2.dailyProfits),
  //   parseFloat(props.content.day3.dailyProfits),
  //   parseFloat(props.content.day4.dailyProfits),
  //   parseFloat(props.content.day5.dailyProfits),
  //   parseFloat(props.content.day6.dailyProfits),
  //   parseFloat(props.content.day7.dailyProfits),
  // ];

  const data = [50, 10, 40, 95, 85, 35, 53];

  const contentInset = { top: 20, bottom: 20 };
  const Decorator = ({ x, y, data }) => {
    return data.map((value: any, index: string | number | undefined) => (
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
        height: 260,
        borderRadius: 10,
        shadowOffset: { width: 2, height: 1 },
        shadowColor: '#3679B540',
        shadowOpacity: 0.8,
        shadowRadius: 5,
        padding: 20,
        marginBottom: 20,
      }}>
      <H1Text>{'Asset Graph'}</H1Text>
      <View
        style={{
          height: 200,
          flexDirection: 'row',
        }}>
        <View style={{ flex: 1, height: 200 }}>
          <YAxis
            data={data}
            contentInset={contentInset}
            svg={{
              fill: '#A7A7A7',
              fontSize: 10,
            }}
            numberOfTicks={10}
            formatLabel={value => `$ ${parseFloat(value).toFixed(2)}`}
          />
        </View>
        <View style={{ flex: 10 }}>
          <BarChart
            spacingInner={0.7}
            spacingOuter={0.4}
            style={{ height: 200 }}
            data={data}
            svg={{ fill }}
            contentInset={{ top: 30, bottom: 30 }}>
            <Grid />
          </BarChart>
          <LineChart
            style={{ height: 200, top: -200 }}
            data={data}
            svg={{
              stroke: '#0F4C81',
              strokeWidth: 1.5,
              strokeLinejoin: 'round',
            }}
            contentInset={{ top: 30, bottom: 30 }}>
            <Decorator />
          </LineChart>
        </View>
      </View>
      <XAxis
        spacingInner={0.7}
        spacingOuter={0.4}
        style={{ marginHorizontal: -10 }}
        data={day}
        formatLabel={(value, index) => value}
        contentInset={{ left: 10, right: 10 }}
        svg={{ fontSize: 12, fill: '#A7A7A7' }}
      />

      {/* <StackedBarChart
        style={{ paddingLeft: 5 }}
        showLegend={false}
        data={{
          labels: ['월', '화', '수', '목', '금', '토', '일'],
          data: [[60], [70], [80], [20], [50], [40], [100]],
          barColors: ['#3679B5'],
        }}
        width={Dimensions.get('window').width - 80}
        height={170}
        yAxisLabel="$"
        chartConfig={{
          backgroundColor: 'rgba(255,255,255, 0)',
          backgroundGradientFrom: 'rgba(255,255,255, 0)',
          backgroundGradientTo: 'rgba(255,255,255, 0)',
          decimalPlaces: 2, // optional, defaults to 2dp
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(167, 167, 167, ${opacity})`,
          style: {
            borderRadius: 0,
          },
        }}
      />
      <LineChart
        bgColor={'transparent'}
        style={{
          paddingLeft: 5,
          position: 'relative',
          top: 0,
          backgroundColor: 'transparent',
        }}
        data={{
          labels: ['월', '화', '수', '목', '금', '토', '일'],
          datasets: [{ data: [60, 70, 80, 20, 50, 40, 100] }],
        }}
        width={Dimensions.get('window').width - 80}
        height={170}
        yAxisLabel="$"
        chartConfig={{
          backgroundColor: 'rgba(255,255,255, 0)',
          // backgroundGradientFrom: 'rgba(255,255,255, 0)',
          // backgroundGradientTo: 'rgba(255,255,255, 0)',
          decimalPlaces: 2, // optional, defaults to 2dp
          color: (opacity = 1) => `rgba(15, 76, 129, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(167, 167, 167, ${opacity})`,
          style: {
            borderRadius: 0,
          },
        }}
      /> */}
    </View>
  );
};
