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
  idType: string;
}

export class Kyc extends Component<props, state> {
  constructor(props: props) {
    super(props);
    this.state = { stage: "TakeID", idType: "passport" };
    this.setID = this.setID.bind(this);
  }

  setID(text: string) {
    this.state.idType != text
      ? this.setState({ idType: text })
      : this.setState({ idType: "" });
  }

  render() {
    return (
      <View style={{ width: "100%", height: "100%" }}>
        {this.state.stage === "StartKYC" && <StartKYC handler={() => {}} />}
        {this.state.stage === "SelectID" && (
          <SelectID setIdHandler={this.setID} idType={this.state.idType} />
        )}
        {this.state.stage === "TakeID" && <TakeID idType={this.state.idType} />}
        {this.state.stage === "PersonalDataInput" && <PersonalDataInput />}
        {this.state.stage === "TakeSelfieBefore" && <TakeSelfieBefore />}
        {this.state.stage === "TakeSelfie" && <TakeSelfie />}
        {this.state.stage === "ConfirmSelfie" && <ConfirmSelfie />}
      </View>
    );
  }
}
