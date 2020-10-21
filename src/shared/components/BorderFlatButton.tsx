import React, { FunctionComponent } from "react";
import { GestureResponderEvent } from "react-native";
import styled from "styled-components/native";
import { P3Text } from './Texts';

const WhiteBtn = styled.TouchableOpacity`
  border-radius: 5px;
  border-width: 1px;
  border-style: solid;
  border-color: #36a1ff;
  color: #1c1c1c;
  height: 21px;
  padding: 3px 21px;
`;

const FlatBorderButton: FunctionComponent<{
  title: string;
  handler: (event: GestureResponderEvent) => void;
}> = ({ title, handler }) => {
  return (
    <WhiteBtn onPress={handler}>
      <P3Text label={title} style={{
        color: "#1c1c1c",
        textAlign: "center",
        lineHeight: 15,
      }} />
    </WhiteBtn>
  );
};

export default FlatBorderButton;
