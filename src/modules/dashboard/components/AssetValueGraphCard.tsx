import React, { FunctionComponent } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import styled from 'styled-components/native';
// import { PieChart } from 'react-native-chart-kit';
import { PieChart } from 'react-native-svg-charts';
import i18n from '../../../i18n/i18n';
import { SummaryReportResponse } from '../../../types/SummaryReport';

interface Props {
  ownerships: SummaryReportResponse['content']['ownerships'];
}

const H1Text = styled.Text`
  color: #1c1c1c;
  font-size: 15px;
  text-align: left;
  margin-bottom: 20px;
`;
const data = [
  {
    name: 'ELYSIA Asset #1',
    population: 215000,
    color: '#3679B5',
    legendFontColor: '#7F7F7F',
    legendFontSize: 15,
  },
  {
    name: 'ELYSIA Asset #2',
    population: 2800000,
    color: '#AFDCFE',
    legendFontColor: '#7F7F7F',
    legendFontSize: 15,
  },
  {
    name: 'ELYSIA Asset #3',
    population: 527612,
    color: '#2EAFFF',
    legendFontColor: '#7F7F7F',
    legendFontSize: 15,
  },
];

export const AssetValueGraphCard: FunctionComponent<Props> = (props: Props) => {
  // const data = [50, 10, 40, 95, 85, 91, 35, 53];

  const data = props.ownerships.map((value, index) => parseFloat(value[1]));
  console.log(data);

  const color = [
    '#3679B5',
    '#66B8FF',
    '#33ADCC',
    '#30C2B8',
    '#234F75',
    '#3679B5',
    '#66B8FF',
    '#33ADCC',
    '#30C2B8',
    '#234F75',
  ];

  const pieData = data.map((value, index) => ({
    value,
    svg: {
      fill: color[index],
    },
    key: `pie-${index}`,
  }));
  return (
    <View
      style={{
        backgroundColor: '#fff',
        width: '100%',
        height: 430,
        borderRadius: 10,
        shadowOffset: { width: 2, height: 2 },
        shadowColor: '#3679B540',
        shadowOpacity: 0.8,
        shadowRadius: 5,
        padding: 20,
        marginBottom: 20,
      }}>
      <H1Text>{'Asset Value Graph'}</H1Text>
      {/* <PieChart
        // style={{ paddingLeft: 5 }}
        paddingLeft={`${Dimensions.get('window').width * 0.2}`}
        data={data}
        width={Dimensions.get('window').width - 80}
        height={220}
        backgroundColor="transparent"
        accessor="population"
        hasLegend={false}
        chartConfig={{
          //   backgroundColor: "rgba(255,255,255, 0)",
          //   backgroundGradientFrom: "#fff",
          //   backgroundGradientTo: "#fff",
          decimalPlaces: 2, // optional, defaults to 2dp
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(167, 167, 167, ${opacity})`,
          style: {
            borderRadius: 0,
          },
        }}
      /> */}
      <PieChart
        style={{ height: 200 }}
        data={pieData}
        outerRadius={'100%'}
        innerRadius={'70%'}
        padAngle={0}
      />
      <View
        style={{
          width: '100%',
          top: 15,
          height: 140,
          borderRadius: 10,
          borderWidth: 1,
          borderColor: '#F1F1F1',
        }}></View>
    </View>
  );
};
