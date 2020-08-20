import React, { Component, FunctionComponent } from "react";
import { StyleSheet, Text, View, Picker, PickerIOS } from "react-native";
import styled from "styled-components/native";
import i18n from "../../../i18n/i18n";
import nations from "./argos.json";

import RNPickerSelect from "react-native-picker-select";

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
  background-color: #fff;
  font-size: 7px;
  border: solid 1px #d0d8df;
  border-radius: 5px;
`;

interface props {
  type: string;
}

interface state {
  nationality: string;
}

export class NationInput extends Component<props, state> {
  constructor(props: props) {
    super(props);
    this.state = {
      nationality: "",
    };
  }

  NationList = nations.map((nation, Key) =>
    //   <Picker.Item label={nation.Nationality} value={nation.Argos} />

    ({ label: nation.Nationality, value: nation.Argos })
  );

  render() {
    return (
      <View>
        <InputHeaderText>{this.props.type}</InputHeaderText>
        {/* <DropDownPicker
          items={this.NationList}
          defaultValue={this.state.nationality}
          containerStyle={{ height: 40 }}
          style={{
            backgroundColor: "#fff",
          }}
          itemStyle={{
            justifyContent: "flex-start",
          }}
          dropDownStyle={{ backgroundColor: "#fff" }}
          onChangeItem={(item: any) => {
            this.setState({
              nationality: item.value,
            });
            console.log(this.state.nationality);
          }}

        /> */}
        <RNPickerSelect
          onValueChange={(item: any) =>
            this.setState({ nationality: item.value })
          }
          items={this.NationList}
        />
      </View>
    );
  }
}
