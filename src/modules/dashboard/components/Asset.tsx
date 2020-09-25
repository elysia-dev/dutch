import React, { FunctionComponent } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import Dash from 'react-native-dash';

interface Props {
  ownership: {
    id: number;
    title: string;
    productType: string;
    value: number;
    profit: number;
  };

  handler: () => void;
}

const TitleText = styled.Text`
  flex: 2;
  color: #fff;
  font-size: 15px;
  text-align: left;
`;

const NumText = styled.Text`
  color: #fff;
  font-size: 30px;
  font-weight: bold;
  text-align: left;
  margin-bottom: 10px;
`;
const ProfitText = styled.Text`
  margin-top: 10px;
  color: #fff;
  font-size: 18px;
  text-align: left;
`;
export const Asset: FunctionComponent<Props> = (props: Props) => {
  return (
    <TouchableOpacity onPress={props.handler}>
      <View
        style={{
          backgroundColor:
            props.ownership.productType === 'commercial'
              ? '#33ADCC'
              : '#30C2B8',
          width: '47%',
          height: 200,
          borderRadius: 10,
          shadowOffset: { width: 2, height: 2 },
          shadowColor: '#1C1C1C4D',
          shadowOpacity: 0.8,
          shadowRadius: 7,
          padding: 15,
          paddingTop: 23,
          marginBottom: 25,
          flexDirection: 'column',
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignContent: 'center',
            alignItems: 'center',
            marginBottom: 20,
          }}>
          <Image
            style={{ flex: 1, resizeMode: 'center', width: 40, height: 40 }}
            source={
              props.ownership.productType === 'commercial'
                ? require('../images/commercial.png')
                : require('../images/residential.png')
            }
          />
          <TitleText>{props.ownership.title}</TitleText>
        </View>
        <NumText>{`$ ${parseFloat(`${props.ownership.value}`).toFixed(
          2,
        )}`}</NumText>
        <Dash
          dashGap={4}
          dashLength={2}
          dashThickness={2}
          dashColor={'rgba(255, 255, 255, 0.6)'}
          style={{ width: '100%', height: 1 }}
          dashStyle={{
            borderRadius: 100,
            overflow: 'hidden',
          }}></Dash>
        <ProfitText>{`$ ${parseFloat(`${props.ownership.profit}`).toFixed(
          2,
        )}`}</ProfitText>
      </View>
    </TouchableOpacity>
  );
};
