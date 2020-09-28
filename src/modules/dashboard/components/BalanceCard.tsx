import React, { FunctionComponent } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';

interface Props {
  balance: string;
  handler: () => void;
}

const H1Text = styled.Text`
  color: #fff;
  font-size: 15px;
  text-align: left;
  margin-bottom: 30px;
`;
const NumText = styled.Text`
  color: #fff;
  font-size: 35px;
  text-align: left;
  font-weight: bold;
`;

export const BalanceCard: FunctionComponent<Props> = props => {
  return (
    <TouchableOpacity onPress={props.handler}>
      <View
        style={{
          backgroundColor: '#3679B5',
          width: '100%',
          height: 200,
          borderRadius: 10,
          shadowOffset: { width: 2, height: 2 },
          shadowColor: '#3679B54D',
          shadowOpacity: 0.8,
          shadowRadius: 6,
          padding: 20,
          marginBottom: 25,
        }}>
        <H1Text>{'Total Profit'}</H1Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View style={{ top: 15 }}>
            <NumText>{props.balance}</NumText>
          </View>
          <View
            style={{
              backgroundColor: '#fff',
              width: 60,
              height: 60,
              borderRadius: 30,
              shadowOffset: { width: 0, height: 3 },
              shadowColor: '#1C1C1C4D',
              shadowOpacity: 0.8,
              shadowRadius: 6,
              justifyContent: 'center',
              alignContent: 'center',
            }}>
            <Image
              style={{
                marginLeft: 'auto',
                marginRight: 'auto',
                width: 25,
                height: 25,
                resizeMode: 'center',
              }}
              source={require('../images/chart.png')}></Image>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};
