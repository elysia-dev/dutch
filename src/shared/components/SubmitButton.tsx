import React, { FunctionComponent } from 'react';
import styled from 'styled-components/native';
import { StyleProp, ViewStyle, TextStyle } from 'react-native';

type ButtonProps = {
  theme: string;
};

const handleThemeType = (variant: string) => {
  switch (variant) {
    case 'WhiteTheme':
      return 'border: 1px solid #3679B5; background-color: #FFFFFF;';
    case 'GrayTheme':
      return 'border: 0px solid #FFFFFF; background-color: #AAAAAA;';
    default:
      return 'border: 0px solid #FFFFFF; background-color:#3679B5;';
  }
};
const handleThemeWrapperType = (variant: string) => {
  switch (variant) {
    case 'WithFlat':
      return 'margin-bottom: 5px;';
    case 'WhiteTheme':
      return 'margin-bottom: 25px;';
    default:
      return 'margin-bottom: 36px;';
  }
};

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
    props.theme === 'WhiteTheme' ? '#000000' : '#FFFFFF'};
`;
const DuplicateUpperLabel = styled.Text`
  font-size: 14px;
  text-align: left;
  margin-left: 6%;
  color: ${(props: ButtonProps) =>
    props.theme === 'WhiteTheme' ? '#000000' : '#FFFFFF'};
`;
const DuplicateLabel = styled.Text`
  font-size: 16px;
  font-weight: bold;
  text-align: left;
  color: ${(props: ButtonProps) =>
    props.theme === 'WhiteTheme' ? '#000000' : '#FFFFFF'};
`;
interface SubmitButtonProps {
  title: string;
  // handler: (event: GestureResponderEvent) => void;
  handler: any;
  variant?: string; // WhiteTheme를 받으면 하얀색 버튼으로 변경됩니다
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  duplicateTitle?: string;
}

export const SubmitButton: FunctionComponent<SubmitButtonProps> = ({
  title,
  handler,
  variant,
  disabled,
  style,
  textStyle,
  duplicateTitle,
}) => {
  return (
    <Button onPress={handler} theme={variant} disabled={disabled} style={style}>
      {duplicateTitle === undefined ? (
        <ButtonLabel theme={variant} style={textStyle}>
          {title}
        </ButtonLabel>
      ) : (
        <DuplicateUpperLabel theme={variant}>
          {duplicateTitle}
          <DuplicateLabel theme={variant}>
            {'\n'}
            {title}
          </DuplicateLabel>
        </DuplicateUpperLabel>
      )}
    </Button>
  );
};
