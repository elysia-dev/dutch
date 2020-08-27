import React, { Component, FunctionComponent } from "react";
import {
  StyleSheet,
  Text,
  View,
  Picker,
  PickerIOS,
  Platform,
} from "react-native";
import styled from "styled-components/native";
import i18n from "../../../i18n/i18n";
import nations from "./argos.json";

import RNPickerSelect, { Item } from "react-native-picker-select";
import DropDownPicker from "react-native-dropdown-picker";

const InputHeaderText = styled.Text`
  color: #a7a7a7;
  margin: 5px 20px;
  font-size: 12px;
  text-align: left;
`;
const InputTextForm = styled.TextInput`
  width: 90%;
  margin: 8px auto;
  height: 25px;
  border-bottom-width: 1px;
  border-bottom-color: #a7a7a7;
`;
const InputPicker = styled.Picker`
  width: 90%;
  margin: 8px 10px;
  padding: 5px;
  font-size: 7px;
  border: solid 1px #d0d8df;
  border-radius: 5px;
`;

interface props {
  type: string;
  nationality: string;
  eventHandler: (input: string) => void;
}

interface state {}

interface placeholder {
  label: string;
  value: string;
  color: string;
}

export class NationInput extends Component<props, state> {
  constructor(props: props) {
    super(props);
    this.state = {
      nationality: "",
    };
  }

  NationList_ios = nations.map((nation, Key) => ({
    label: nation.Nationality,
    value: nation.Argos,
  }));

  NationList_and = nations.map((nation, Key) => (
    <Picker.Item
      key={nation.Key}
      label={nation.Nationality}
      value={nation.Argos}
    />
  ));

  render() {
    const placeholder: placeholder = {
      label: "Select your nationality",
      value: "",
      color: "#1C1C1C",
    };

    return (
      <View>
        <InputHeaderText>{this.props.type}</InputHeaderText>
        {Platform.OS === "android" ? (
          <Picker
            // mode="dropdown"
            selectedValue={this.props.nationality}
            onValueChange={this.props.eventHandler}
          >
            {this.NationList_and}
          </Picker>
        ) : (
          <RNPickerSelect
            onValueChange={this.props.eventHandler}
            items={this.NationList_ios}
            style={pickerSelectStyles}
            placeholder={placeholder}
          />
        )}
      </View>
    );
  }
}

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    width: "90%",
    backgroundColor: "#fff",
    fontSize: 14,
    marginVertical: 8,
    marginHorizontal: 10,
    paddingVertical: 12,
    paddingHorizontal: 5,
    borderWidth: 1,
    borderColor: "#d0d8df",
    borderRadius: 5,
    color: "#1C1C1C",
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    width: "90%",
    backgroundColor: "#fff",
    fontSize: 14,
    marginVertical: 8,
    marginHorizontal: 10,
    paddingVertical: 12,
    paddingHorizontal: 5,
    borderWidth: 1,
    borderColor: "#d0d8df",
    borderRadius: 5,
    color: "#1C1C1C",
    paddingRight: 30, // to ensure the text is never behind the icon
  },
});

//<DropDownPicker
//     items={this.NationList}
//     defaultValue={this.state.nationality}
//     containerStyle={{ height: 40 }}
//     style={{
//       backgroundColor: "#fff",
//     }}
//     itemStyle={{
//       justifyContent: "flex-start",
//     }}
//     dropDownStyle={{ backgroundColor: "#fff" }}
//     onChangeItem={(item: any) => {
//       this.setState({
//         nationality: item.value,
//       });
//       console.log(this.state.nationality);
//     }}
//   />
