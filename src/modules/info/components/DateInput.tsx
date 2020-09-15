import React, { Component, FunctionComponent, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput as RNTextInput,
  Image,
} from "react-native";
import DatePicker from "react-native-datepicker";
import i18n from "../../../i18n/i18n";

interface props {
  date: string;
  minDate?: string;
  maxDate?: string;
  eventHandler: (input: string) => void;
}

interface state {
  date: string;
}

export class DateInput extends Component<props, state> {
  constructor(props: props) {
    super(props);
    this.state = { date: "" };
  }
  currentTime = new Date();

  render() {
    return (
      <View>
        <DatePicker
          style={{ width: "100%", height: 35 }}
          date={this.props.date}
          onDateChange={(date) => {
            this.props.eventHandler(date);
          }}
          mode="date"
          androidMode="spinner"
          placeholder={i18n.strftime(this.currentTime, "%Y-%m-%d")}
          format="YYYY-MM-DD"
          minDate={this.props.minDate ? this.props.minDate : "2000-01-01"}
          maxDate={this.props.maxDate ? this.props.maxDate : this.currentTime}
          confirmBtnText="Confirm"
          cancelBtnText="Cancel"
          iconSource={require("../images/calender.png")}
          customStyles={{
            btnTextConfirm: {
              color: "#2C6190",
            },
            dateIcon: {
              width: 13.75,
              height: 12.5,
              opacity: 1,
              position: "relative",
              marginLeft: "-20%",
            },
            dateInput: {
              borderRadius: 5,
              borderWidth: 1,
              borderColor: "#D0D8DF",
            },
          }}
        />
      </View>
    );
  }
}
