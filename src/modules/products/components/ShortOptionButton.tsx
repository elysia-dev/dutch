import React, { FunctionComponent } from 'react';
import styled from 'styled-components/native';

const OptionBtn = styled.TouchableOpacity`
  width: 40%;
  margin: 0 auto;
  height: 40px;
  background-color: #fff;
  border-radius: 5px;
  border: solid 1px #d0d8df;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-content: center;
`;
const CheckedOptionBtn = styled.TouchableOpacity`
  width: 40%;
  margin: 0 auto;
  height: 40px;
  background-color: #fff;
  border-radius: 5px;
  border: solid 1px #3679b5;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-content: center;
`;
const OptionBtnText = styled.Text`
  color: #a7a7a7;
  font-size: 14px;
  text-align: center;
  line-height: 40px;
  z-index: 5;
`;
const CheckedOptionBtnText = styled.Text`
  color: #1c1c1c;
  font-size: 14px;
  text-align: center;
  line-height: 40px;
  z-index: 5;
`;

export const ShortOptionButton: FunctionComponent<{
  check: string;
  title: string;
  // handler: (event: GestureResponderEvent) => void;
  handler: any;
}> = ({ title, handler, check }) => {
  if (check === 'checked') {
    return (
      <CheckedOptionBtn onPress={handler}>
        <CheckedOptionBtnText>{title}</CheckedOptionBtnText>
      </CheckedOptionBtn>
    );
  } else {
    return (
      <OptionBtn onPress={handler}>
        <OptionBtnText>{title}</OptionBtnText>
      </OptionBtn>
    );
  }
};
