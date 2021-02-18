import React, { FunctionComponent } from 'react';
import {
  StyleSheet,
  View,
  StyleProp,
  ViewStyle,
} from 'react-native';
import styled from 'styled-components/native';
import { Picker } from '@react-native-community/picker';
import nations from './argos.json';

const InputHeaderText = styled.Text`
  color: #a7a7a7;
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

export const NationInput: FunctionComponent<Props> = (props) => {
  const nationList = nations.map((nation, Key) => (
    <Picker.Item key={Key} label={nation.Nationality} value={nation.Argos} />
  ));

  return (
    <View style={props.style}>
      <InputHeaderText style={{ marginBottom: 10 }} allowFontScaling={false}>
        {props.type}
      </InputHeaderText>
      <View style={pickerSelectStyles.inputAndroid}>
        <Picker
          accessibilityLabel={'nationalinput'}
          selectedValue={props.nationality}
          onValueChange={(itemValue, _itenIndex) => {
            props.eventHandler(itemValue.toString());
          }}>
          {nationList}
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
    paddingVertical: 0,
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
