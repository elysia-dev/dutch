import React, { FunctionComponent } from 'react';
import { StyleProp, TextStyle } from 'react-native';
import styled from 'styled-components/native';

const SubTitle = styled.Text`
  color: #1c1c1c;
  font-size: 15px;
  text-align: left;
  line-height: 20px;
`;

export const SubTitleText: FunctionComponent<{
  label: string;
  style?: StyleProp<TextStyle>;
  // handler: (event: GestureResponderEvent) => void;
}> = ({ label, style }) => {
  return (
    <>
        <SubTitle style={style}>{label}</SubTitle>
    </>
  );
};
