import React, { Component, FunctionComponent } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Picker,
  Platform,
  StyleProp,
  ViewStyle,
} from 'react-native';
import styled from 'styled-components/native';
import RNPickerSelect, { Item } from 'react-native-picker-select';
import DropDownPicker from 'react-native-dropdown-picker';
import i18n from '../../../i18n/i18n';
import nations from './argos.json';


const InputHeaderText = styled.Text`
  color: #a7a7a7;
  font-size: 12px;
  text-align: left;
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

export const NationInput: FunctionComponent<props> = (props) => {
  const NationListIos = nations.map((nation, Key) => ({
    label: nation.Nationality,
    value: nation.Argos,
    key: Key,
  }));

  const NationListAnd = nations.map((nation, Key) => (
    <Picker.Item key={Key} label={nation.Nationality} value={nation.Argos} />
  ));

  const placeholder: placeholder = {
    label: 'Select your nationality',
    value: '',
    color: '#1C1C1C',
  };

  return (
    <View style={props.style}>
      <InputHeaderText style={{ marginBottom: 10 }}>
        {props.type}
      </InputHeaderText>
      {Platform.OS === 'android' ? (
        <Picker
          // mode="dropdown"
          selectedValue={props.nationality}
          onValueChange={props.eventHandler}>
          {NationListAnd}
        </Picker>
      ) : (
        <RNPickerSelect
          onValueChange={props.eventHandler}
          items={NationListIos}
          style={pickerSelectStyles}
          placeholder={placeholder}
        />
      )}
    </View>
  );
};

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    backgroundColor: '#fff',
    fontSize: 14,
    paddingVertical: 12,
    paddingHorizontal: 5,
    borderWidth: 1,
    borderColor: '#d0d8df',
    borderRadius: 5,
    color: '#1C1C1C',
    paddingRight: 30,
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
  },
});
