import React, { FunctionComponent } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  GestureResponderEvent,
  Text,
} from "react-native";
import styled, { css } from "styled-components/native";

interface SubmitButtonProps {
  title: string;
  // handler: (event: GestureResponderEvent) => void;
  handler: any;
  ButtonTheme?: string; // WhiteTheme를 받으면 하얀색 버튼으로 변경됩니다
}

export const SubmitButton: FunctionComponent<SubmitButtonProps> = ({
  title,
  handler,
  ButtonTheme,
}) => {
<<<<<<< HEAD
  const handleThemeType = (BtnTheme) => {
    switch (BtnTheme) {
      case "WhiteTheme":
        return "border: 1px solid #3679B5; background-color: #FFFFFF;";
      case "GrayTheme":
        return "border: 0px solid #FFFFFF; background-color: #AAAAAA;";
      default:
        return "border: 0px solid #FFFFFF; background-color: #2c6190;";
    }
  };
  const handleThemeWrapperType = (BtnTheme) => {
    switch (BtnTheme) {
      case "WithFlat":
        return "margin-bottom: 5px;";
      case "WhiteTheme":
        return "margin-bottom: 25px;";
      default:
        return "margin-bottom: 36px;";
    }
  };
  const WhiteBtnWrapper = styled.View`
    flex: ${(props) => (props.BtnTheme == "WhiteTheme" ? "4" : "1")};
    justify-content: flex-end;
    ${({ BtnTheme }) => handleThemeWrapperType(BtnTheme)};
=======
  const WhiteBtnWrapper = styled.View`
    flex: ${(props) => (props.BtnTheme == "WhiteTheme" ? "4" : "1")};
    justify-content: flex-end;
    margin-bottom: ${(props) =>
      props.BtnTheme == "WhiteTheme" ? "25px" : "36px"};
>>>>>>> origin/master
  `;
  const WhiteBtn = styled.TouchableOpacity`
    width: 90%;
    margin-left: 5%;
    margin-right: 5%;
    height: 40px;
    border-radius: 5px;
    position: absolute;
    bottom: 0;

<<<<<<< HEAD
    ${({ BtnTheme }) => handleThemeType(BtnTheme)};
=======
    border: 1px solid
      ${(props) => (props.BtnTheme == "WhiteTheme" ? "#3679B5" : "#FFFFFF")};
    background-color: ${(props) =>
      props.BtnTheme == "WhiteTheme" ? "#FFFFFF" : "#2c6190"};
>>>>>>> origin/master
  `;
  const WhiteBtnText = styled.Text`
    font-size: 14px;
    text-align: center;
    line-height: 40px;

    color: ${(props) =>
      props.BtnTheme == "WhiteTheme" ? "#000000" : "#FFFFFF"};
  `;
  return (
    <WhiteBtnWrapper BtnTheme={ButtonTheme}>
      <WhiteBtn onPress={handler} BtnTheme={ButtonTheme}>
        <WhiteBtnText BtnTheme={ButtonTheme}>{title}</WhiteBtnText>
      </WhiteBtn>
    </WhiteBtnWrapper>
  );
};
