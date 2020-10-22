import React, { Component, FunctionComponent } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Platform,
  StyleProp,
  ViewStyle,
} from 'react-native';
import styled from 'styled-components/native';
import { Picker } from '@react-native-community/picker';
import DropDownPicker from 'react-native-dropdown-picker';
import i18n from '../../../i18n/i18n';
import nations from './argos.json';


const InputHeaderText = styled.Text`
  color: #A7A7A7;
  font-size: 12px;
  text-align: left;
  font-family: 'Roboto_400Regular';
`;

interface Props {
  type?: string;
  nationality?: string;
  eventHandler: (input: string) => void;
  style?: StyleProp<ViewStyle>;
}

interface Placeholder {
  label: string;
  value: string;
  color: string;
}

export const NationInput: FunctionComponent<Props> = (props) => {
  const NationListIos = nations.map((nation, Key) => ({
    label: nation.Nationality,
    value: nation.Argos,
    key: Key,
  }));

  const NationListAnd = nations.map((nation, Key) => (
    <Picker.Item key={Key} label={nation.Nationality} value={nation.Argos} />
  ));

  const placeholder: Placeholder = {
    label: 'Select your nationality',
    value: '',
    color: '#1C1C1C',
  };

  return (
    <View style={props.style}>
      <InputHeaderText style={{ marginBottom: 10 }} allowFontScaling={false}>
        {props.type}
      </InputHeaderText>
      <View style={pickerSelectStyles.inputAndroid}>
        <Picker
          // mode="dropdown"
          accessibilityLabel={'nationalinput'}
          selectedValue={props.nationality}
          onValueChange={(itemValue, itenIndex) => {
            props.eventHandler(itemValue.toString())
          }}>
          {NationListAnd}
        </Picker>
      </View>
    </View>
  );
};

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    backgroundColor: '#fff',
    fontSize: 14,
    paddingVertical: 12,
    paddingHorizontal: 15,
    height: 45,
    borderWidth: 1,
    borderColor: '#d0d8df',
    borderRadius: 5,
    color: '#1C1C1C',
    paddingRight: 30,
    fontFamily: 'Roboto_400Regular',
    textAlign: 'center',
  },
  inputAndroid: {
    backgroundColor: '#fff',
    fontSize: 14,
    paddingVertical: 12,
    paddingHorizontal: 5,
    borderWidth: 1,
    borderColor: '#d0d8df',
    borderRadius: 5,
    color: '#1C1C1C',
    paddingRight: 30,
    fontFamily: 'Roboto_400Regular',
    textAlign: 'center',
  },
});
