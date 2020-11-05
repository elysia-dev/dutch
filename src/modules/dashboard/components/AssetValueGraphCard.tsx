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
import { P1Text } from '../../../shared/components/Texts';

interface Props {
  ownerships: SummaryReportResponse['content']['ownerships'];
}

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
  const [state, setState] = React.useState({ profit: true });

  const data = props.ownerships.map((value, index) => parseFloat(value[1]));
  const totalValue = data.reduce((accumulator, currentValue) => {
    return accumulator + currentValue;
  }, 0);

  const color = [
    '#3679B5',
    '#66B8FF',
    '#33ADCC',
    '#30C2B8',
    '#234F75',
    '#335CCC',
    '#3679B5',
    '#66B8FF',
    '#33ADCC',
    '#30C2B8',
    '#234F75',
    '#335CCC',
    '#3679B5',
    '#66B8FF',
    '#33ADCC',
    '#30C2B8',
    '#234F75',
    '#335CCC',
    '#3679B5',
    '#66B8FF',
    '#33ADCC',
    '#30C2B8',
    '#234F75',
    '#335CCC',
  ];

  const pieData = data.map((value, index) => ({
    value,
    svg: {
      fill: color[index],
    },
    key: `pie-${index}`,
  }));

  const assetProfitLabel = props.ownerships.map((value, index) => (
    <View
      key={index}
      style={{
        flexDirection: 'row',
        marginTop: 4,
        marginBottom: 4,
        alignItems: 'center',
      }}>
      <View
        style={{
          flex: 1,
          backgroundColor: color[index],
          width: 14,
          height: 14,
          borderRadius: 7,
        }}></View>
      <P1Text
        style={{
          flex: 8,
          marginLeft: 5,
          color: '#4E4E4E',
        }}
        label={value[0]}
      />
      <P1Text
        style={{
          flex: 8,
          textAlign: 'right',
        }}
        label={`$ ${parseFloat(value[1]).toFixed(4)}`}
      />
    </View>
  ));

  const assetPercentLabel = props.ownerships.map((value, index) => (
    <View
      key={index}
      style={{
        flexDirection: 'row',
        marginTop: 4,
        marginBottom: 4,
        alignItems: 'center',
      }}>
      <View
        style={{
          flex: 1,
          backgroundColor: color[index],
          width: 14,
          height: 14,
          borderRadius: 7,
        }}></View>
      <P1Text
        style={{
          flex: 8,
          marginLeft: 5,
          color: '#4E4E4E',
        }}
        label={value[0]}
      />
      <P1Text
        style={{
          flex: 8,
          textAlign: 'right',
        }}
        label={`${parseFloat(
          `${(100 * parseFloat(value[1])) / totalValue}}`,
        ).toFixed(4)} %`}
      />
    </View>
  ));
  return (
    <View
      style={{
        backgroundColor: '#fff',
        width: '99%',
        borderRadius: 10,
        shadowOffset: { width: 2, height: 2 },
        shadowColor: '#3679B540',
        shadowOpacity: 0.8,
        shadowRadius: 5,
        padding: 20,
        paddingBottom: 40,
        marginBottom: 50,
        elevation: 1,
        marginLeft: 3,
        marginRight: 3,
      }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <P1Text
          style={{ marginBottom: 20 }}
          label={i18n.t('dashboard_label.asset_value_graph')}
        />
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-end',
            alignItems: 'center',
          }}>
          <TouchableOpacity
            onPress={() => setState({ ...state, profit: true })}
            style={{ width: 50, height: 50, marginRight: -5, marginTop: -5 }}>
            <Image
              source={
                state.profit
                  ? require('../images/dollorblackbutton.png')
                  : require('../images/dollorgraybutton.png')
              }
              style={{ width: 50, height: 50 }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setState({ ...state, profit: false })}
            style={{ width: 50, height: 50, marginRight: -10, marginTop: -5 }}>
            <Image
              source={
                state.profit
                  ? require('../images/percentgraybutton.png')
                  : require('../images/percentblackbutton.png')
              }
              style={{ width: 50, height: 50 }}
            />
          </TouchableOpacity>
        </View>
      </View>
      {!totalValue ? (
        <>
          <Image
            source={require('../images/noownership.png')}
            style={{ width: '85%', height: 200 }}
          />
          <P1Text
            style={{ marginTop: 25, textAlign: 'center' }}
            label={i18n.t('dashboard.no_ownership')}
          />
        </>
      ) : (
          <>
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
                top: 20,
                padding: 20,
                borderRadius: 10,
                borderWidth: 1,
                borderColor: '#F1F1F1',
              }}>
              {state.profit ? assetProfitLabel : assetPercentLabel}
            </View>
          </>
        )}
    </View>
  );
};
