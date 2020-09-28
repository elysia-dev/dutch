import React, { FunctionComponent } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import i18n from '../../../i18n/i18n';

interface Props {
  return: string;
}

const H1Text = styled.Text`
  color: #1c1c1c;
  font-size: 15px;
  text-align: left;
  margin-bottom: 10px;
`;
const NumText = styled.Text`
  color: #1c1c1c;
  font-size: 25px;
  text-align: left;
  font-weight: bold;
  margin-bottom: 18px;
`;
const PText = styled.Text`
  color: #838383;
  font-size: 15px;
  text-align: left;
`;
const NumText2 = styled.Text`
  color: #1c1c1c;
  font-size: 15px;
  text-align: right;
`;
export const AverageReturnCard: FunctionComponent<Props> = (props: Props) => {
  return (
    <View
      style={{
        backgroundColor: '#fff',
        width: '100%',
        height: 98,
        borderRadius: 10,
        shadowOffset: { width: 2, height: 2 },
        shadowColor: '#3679B540',
        shadowOpacity: 0.8,
        shadowRadius: 5,
        padding: 20,
        marginBottom: 20,
      }}>
      <H1Text>{'Average Return'}</H1Text>
      <NumText>{`${props.return} %`}</NumText>
    </View>
  );
};
