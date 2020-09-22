import React, { FunctionComponent } from "react";
import styled from "styled-components/native";
import { StyleProp, ViewStyle } from "react-native";

type ButtonProps = {
  theme: string;
};

const handleThemeType = (variant: string) => {
  switch (variant) {
    case "WhiteTheme":
      return "border: 1px solid #3679B5; background-color: #FFFFFF;";
    case "GrayTheme":
      return "border: 0px solid #FFFFFF; background-color: #AAAAAA;";
    default:
      return "border: 0px solid #FFFFFF; background-color: #2c6190;";
  }
};
const handleThemeWrapperType = (variant: string) => {
  switch (variant) {
    case "WithFlat":
      return "margin-bottom: 5px;";
    case "WhiteTheme":
      return "margin-bottom: 25px;";
    default:
      return "margin-bottom: 36px;";
  }
};

const WhiteBtnWrapper = styled.View`
  flex: ${(props: ButtonProps) => (props.theme === "WhiteTheme" ? "4" : "1")};
  justify-content: flex-end;
  ${(props: ButtonProps) => handleThemeWrapperType(props.theme)};
`;

const Button = styled.TouchableOpacity`
  width: 90%;
  margin-left: 5%;
  margin-right: 5%;
  height: 40px;
  border-radius: 5px;
  justify-content: center;
  align-content: center;

  ${(props: ButtonProps) => handleThemeType(props.theme)};
`;
const ButtonLabel = styled.Text`
  font-size: 14px;
  text-align: center;
  line-height: 40px;

  color: ${(props: ButtonProps) =>
    props.theme === "WhiteTheme" ? "#000000" : "#FFFFFF"};
`;

interface SubmitButtonProps {
  title: string;
  // handler: (event: GestureResponderEvent) => void;
  handler: any;
  variant?: string; // WhiteTheme를 받으면 하얀색 버튼으로 변경됩니다
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const SubmitButton: FunctionComponent<SubmitButtonProps> = ({
  title,
  handler,
  variant,
  disabled,
  style,
}) => {
  return (
    <Button onPress={handler} theme={variant} disabled={disabled} style={style}>
      <ButtonLabel theme={variant}>{title}</ButtonLabel>
    </Button>
  );
};
