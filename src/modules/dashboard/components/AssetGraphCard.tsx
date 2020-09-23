import React, { FunctionComponent } from 'react';
import { View, Dimensions } from 'react-native';
import styled from 'styled-components/native';
import { BarChart, StackedBarChart } from 'react-native-chart-kit';
import i18n from '../../../i18n/i18n';

const H1Text = styled.Text`
  color: #1c1c1c;
  font-size: 15px;
  text-align: left;
  margin-bottom: 10px;
`;

export const AssetGraphCard: FunctionComponent<{}> = (props) => {
  return (
    <View
      style={{
        backgroundColor: '#fff',
        width: '100%',
        height: 240,
        borderRadius: 10,
        shadowOffset: { width: 2, height: 1 },
        shadowColor: '#3679B540',
        shadowOpacity: 0.8,
        shadowRadius: 5,
        padding: 20,
        marginBottom: 20,
      }}>
      <H1Text>{'Asset Graph'}</H1Text>

      <StackedBarChart
        style={{ paddingLeft: 5 }}
        showLegend={false}
        data={{
          legend: [],
          labels: ['월', '화', '수', '목', '금', '토', '일'],
          data: [[60], [70], [80], [20], [50], [40], [100]],
          barColors: ['#3679B5'],
        }}
        width={Dimensions.get('window').width - 80}
        height={170}
        yAxisLabel="$"
        chartConfig={{
          backgroundColor: 'rgba(255,255,255, 0)',
          backgroundGradientFrom: '#fff',
          backgroundGradientTo: '#fff',
          decimalPlaces: 2, // optional, defaults to 2dp
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(167, 167, 167, ${opacity})`,
          style: {
            borderRadius: 0,
          },
        }}
      />
    </View>
  );
};
