import React, { Component, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput as RNTextInput,
  Image,
} from "react-native";
import DatePicker from "react-native-datepicker";
import styled from "styled-components/native";

interface props {
  eventHandler: () => void;
}
interface state {}

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

export class DateInput extends Component<props, state> {
  constructor(props: props) {
    super(props);
    this.state = {};
  }
  currentTime = new Date();

  render() {
    return (
      <View>
        <DatePicker
          style={{ width: "90%" }}
          date={this.currentTime}
          // onDateChange={(date) => {
          //   this.setState({ birthday: date });
          //   this.props.eventHandler(this.state.birthday);
          // }}
          onDateChange={this.props.eventHandler}
          mode="date"
          androidMode="spinner"
          placeholder="select date"
          format="YYYY-MM-DD"
          minDate="1900-01-01"
          maxDate="2020-01-01"
          confirmBtnText="Confirm"
          cancelBtnText="Cancel"
          iconComponent={<Image source={require("../images/calender.png")} />}
          customStyles={{
            btnTextConfirm: {
              color: "#2C6190",
            },
            dateIcon: {
              opacity: 0,
              position: "relative",
              left: -10,
              top: 4,
              marginLeft: -10,
            },
            dateInput: {
              marginLeft: 8,
              borderRadius: 5,
              borderWidth: 1,
              borderColor: "#D0D8DF",
            },
            // ... You can check the source to find the other keys.
          }}
        />
      </View>
    );
  }
}
