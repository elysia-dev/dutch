import React from 'react';
import { useContext } from 'react';
import { View, Text } from 'react-native';
import ChartDataContext from '../../../contexts/ChartDataContext';

interface IChartLine {
  chartLoc: number;
  chartWidth: number;
}

const ClickChartLine: React.FC<IChartLine> = ({ chartLoc, chartWidth }) => {
  const { chartDate, chartToken } = useContext(ChartDataContext);

  return (
    <View
      style={{
        height: 220,
        width: 30,
        top: 12,
        transform: [{ translateX: chartLoc - 15 }],
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <View
        style={{
          height: 35,
          width: 150,
          top: -10,
          transform: [
            {
              translateX:
                chartWidth * 0.1 >= chartLoc
                  ? 70
                  : chartWidth * 0.9 <= chartLoc
                  ? -70
                  : 0,
            },
          ],
          alignItems:
            chartWidth * 0.1 >= chartLoc
              ? 'flex-start'
              : chartWidth * 0.9 <= chartLoc
              ? 'flex-end'
              : 'center',
          justifyContent: 'center',
        }}>
        <Text
          style={{
            fontSize: 10,
            color: '#C3C3C3',
          }}>
          {chartDate}
        </Text>
        <Text
          style={{
            fontSize: 14,
            color: '#848484',
            fontWeight: '700',
          }}>
          {chartToken}
        </Text>
      </View>
      <View
        style={{
          height: 220,
          width: 1,
          bottom: 0,
          backgroundColor: 'black',
        }}></View>
    </View>
  );
};

export default ClickChartLine;
