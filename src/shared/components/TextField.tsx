import React, { FunctionComponent, useState } from 'react';
import { StyleSheet, View, StyleProp, ViewStyle } from 'react-native';
import styled from 'styled-components/native';
import WarningImg from '../assets/images/warning.png';

interface Props {
  label: string;
  value?: string;
  editable?: boolean;
  eventHandler: (text: string) => void;
  secure?: boolean;
  autoFocus?: boolean;
  placeHolder?: string;
  style?: StyleProp<ViewStyle>;
  helperText?: string;
  helperIcon?: string;
}
const LabelText = styled.Text`
  color: #a7a7a7;
  font-size: 12px;
  text-align: left;
`;
const TextInput = styled.TextInput`
  width: 100%;
  height: 30px;
  border-bottom-width: 1px;
`;
const HelperWrapper = styled.View`
  flex-direction: row-reverse;
  padding-top: 5px;
  height: 30px;
`;
const HelperIcon = styled.Image`
  margin-top: 1px;
  width: 12px;
  height: 12px;
  margin-right: 2px;
`;
const HelperLabel = styled.Text`
  font-size: 12px;
  color: #1c1c1c;
`;
export const TextField: FunctionComponent<Props> = (
  props,
  { onFocused = false, autocapitalize = 'none' },
) => {
  const [focusing, setFocus] = useState(onFocused);
  const [state, setState] = useState({
    editable: true,
    secure: false,
  });
  // const [VaildationImage, setVaildationImage] = useState(props.helperIcon);

  return (
    <View style={props.style}>
      <LabelText
        style={{
          color:
            // eslint-disable-next-line no-nested-ternary
            props.helperText !== undefined
              ? '#C91725'
              : focusing === true
              ? '#2C6190'
              : '#A7A7A7',
        }}>
        {props.label}
      </LabelText>
      <TextInput
        style={{
          borderBottomColor:
            // eslint-disable-next-line no-nested-ternary
            props.helperText !== undefined
              ? '#C91725'
              : focusing === true
              ? '#2C6190'
              : '#A7A7A7',
          marginBottom: props.helperText !== undefined ? 0 : 20,
          color: props.editable === false ? '#A7A7A7' : '#1C1C1C',
        }}
        defaultValue={props.value}
        editable={props.editable}
        onChangeText={text => props.eventHandler(text)}
        enablesReturnKeyAutomatically={true}
        secureTextEntry={props.secure}
        maxLength={30}
        autoCapitalize={autocapitalize}
        onBlur={() => setFocus(false)}
        placeholder={props.placeHolder}
        onFocus={() => setFocus(true)}
      />
      {props.helperText !== undefined && (
        <HelperWrapper>
          <HelperLabel>{props.helperText}</HelperLabel>
          {(() => {
            switch (props.helperIcon) {
              case 'Error':
                return <HelperIcon source={WarningImg} />;
                break;
              case 'Info':
                // <HelperIcon source={InfoImg} />
                break;
              default:
            }
          })()}
        </HelperWrapper>
      )}
    </View>
  );
};

const styles = StyleSheet.create({});
