import React, { FunctionComponent, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput as RNTextInput,
  StyleProp,
  ViewStyle,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import styled from 'styled-components/native';
import i18n from '../../../i18n/i18n';

interface Props {
  type: string;
  eventHandler: (input: string) => void;
  birthday: string;
  style?: StyleProp<ViewStyle>;
}

const InputHeaderText = styled.Text`
  color: #a7a7a7;
  font-size: 12px;
  text-align: left;
  font-family: 'Roboto_400Regular';
`;
const InputTextForm = styled.TextInput`
  height: 25px;
  border-bottom-width: 1px;
  border-bottom-color: #a7a7a7;
`;

export const DateInput: FunctionComponent<Props> = (props) => {
  const currentDate = new Date();

  return (
    <View style={props.style}>
      <InputHeaderText allowFontScaling={false}>{props.type}</InputHeaderText>
      <DateTimePicker
        value={props.birthday ? new Date(props.birthday) : currentDate}
        display="spinner"
        mode="date"
        onChange={(_event, date) =>
          props.eventHandler(i18n.strftime(date, '%Y-%m-%d'))
        }
        minimumDate={new Date(1900, 1, 1)}
        maximumDate={currentDate}
      />
    </View>
  );
};
