import React, { FunctionComponent } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';

interface Props {
  name: string;
  investment: string;
  profit: string;
  handler: () => void;
}

const H1Text = styled.Text`
  color: #1c1c1c;
  font-size: 15px;
  text-align: right;
  margin-bottom: 15px;
`;

const NumText = styled.Text`
  font-size: 15px;
  font-weight: bold;
  text-align: right;
`;
export const Asset: FunctionComponent<Props> = (props: Props) => {
  return (
    <View
      style={{
        flex: 4,
        backgroundColor: '#fff',
        height: 120,
        borderRadius: 10,
        shadowOffset: { width: 2, height: 2 },
        shadowColor: '#3679B540',
        shadowOpacity: 0.8,
        shadowRadius: 5,
        padding: 20,
        marginBottom: 25,
      }}>
      <TouchableOpacity onPress={props.handler}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View style={{ paddingTop: 10 }}>
            <Image
              style={{ resizeMode: 'center', width: 50, height: 50 }}
              source={require('../images/type.png')}
            />
          </View>
          <View style={{ flexDirection: 'column' }}>
            <H1Text>{props.name}</H1Text>
            <NumText>{props.investment}</NumText>
            <NumText style={{ color: '#3679B5' }}>{props.profit}</NumText>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};
