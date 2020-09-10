import React, { FunctionComponent } from "react"
import { View } from "react-native";
import styled from "styled-components/native";
import WarningImg from "../assets/images/warning.png";

const WarningIconImg = styled.Image`
  margin-top: 1px;
  width: 12px;
  height: 12px;
`;
const WarningText = styled.Text`
  font-size: 12px;
  color: #1c1c1c;
`;


interface Iprops {
  message: string
}

const ValidationMessage: FunctionComponent<Iprops> = ({ message }) => {
  return (
    <View style={{ display: "flex", flexDirection: "row", paddingTop: 5 }}>
      <WarningIconImg source={WarningImg} />
      <WarningText>
        {message}
      </WarningText>
    </View>
  )
}

export default ValidationMessage
