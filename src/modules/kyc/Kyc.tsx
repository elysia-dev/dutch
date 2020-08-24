import { StatusBar } from "expo-status-bar";
import axios from "axios";
import React, { Component } from "react";
import { StyleSheet, View } from "react-native";
import { StartKYC } from "./StartKYC";
import { SelectID } from "./SelectID";
import { TakeID } from "./TakeID";
import { PersonalDataInput } from "./PersonalDataInput";
import { TakeSelfieBefore } from "./TakeSelfieBefore";
import { TakeSelfie } from "./TakeSelfie";
import { ConfirmSelfie } from "./ConfirmSelfie";

interface props {}
interface state {
  stage: string;
}

export class Kyc extends Component<props, state> {
  constructor(props: props) {
    super(props);
    this.state = { stage: "ConfirmSelfie" };
  }

  render() {
    return (
      <View>
        {this.state.stage === "StartKYC" && <StartKYC handler={() => {}} />}
        {this.state.stage === "SelectID" && <SelectID />}
        {this.state.stage === "TakeID" && <TakeID />}
        {this.state.stage === "PersonalDataInput" && <PersonalDataInput />}
        {this.state.stage === "TakeSelfieBefore" && <TakeSelfieBefore />}
        {this.state.stage === "TakeSelfie" && <TakeSelfie />}
        {this.state.stage === "ConfirmSelfie" && <ConfirmSelfie />}
      </View>
    );
  }
}
