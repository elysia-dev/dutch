import React, { FunctionComponent } from "react";
import styled from "styled-components/native";

const OptionBtn = styled.TouchableOpacity`
  color: #000;
  width: 48%;
  margin: 0 auto;
  height: 40px;
  background-color: #fff;
  border-radius: 5px;
  border: solid 1px #d0d8df;
  flex-direction: row;
  justify-content: center;
  align-content: center;
`;
const CheckedOptionBtn = styled.TouchableOpacity`
  color: #000;
  width: 48%;
  margin: 0 auto;
  height: 40px;
  background-color: #fff;
  border-radius: 5px;
  border: solid 1px #3679b5;
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
  font-family: 'Roboto_400Regular';
`;
const CheckedOptionBtnText = styled.Text`
  color: #1c1c1c;
  font-size: 14px;
  text-align: center;
  line-height: 40px;
  z-index: 5;
  font-family: 'Roboto_400Regular';
`;
const InputHeaderText = styled.Text`
  color: #a7a7a7;
  margin: 5px 20px;
  font-size: 12px;
  text-align: left;
`;

export const ShortOptionButton: FunctionComponent<{
  check: string;
  title: string;
  // handler: (event: GestureResponderEvent) => void;
  handler: any;
}> = ({ title, handler, check }) => {
  if (check === "checked") {
    return (
      <CheckedOptionBtn onPress={handler}>
        <CheckedOptionBtnText allowFontScaling={false}>{title}</CheckedOptionBtnText>
      </CheckedOptionBtn>
    );
  } else {
    return (
      <OptionBtn onPress={handler}>
        <OptionBtnText allowFontScaling={false}>{title}</OptionBtnText>
      </OptionBtn>
    );
  }
};
