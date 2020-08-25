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
import { createStackNavigator } from "@react-navigation/stack";

import { NavigationContainer } from "@react-navigation/native";
// import { kycNavigator, page } from "../../../src/navigator/kycNavigator";

export enum page {
  StartKYC = "StartKYC",
  SelectID = "SelectID",
  TakeID = "TakeID",
  PersonalDataInput = "PersonalDataInput",
  TakeSelfieBefore = "TakeSelfieBefore",
  TakeSelfie = "TakeSelfie",
  ConfirmSelfie = "ConfirmSelfie",
}

const Stack = createStackNavigator();

export function kycNavigator() {
  return (
    <Stack.Navigator initialRouteName={page.StartKYC}>
      <Stack.Screen
        name={page.StartKYC}
        component={StartKYC}
        // props={navigator}
      />
      <Stack.Screen name={page.SelectID} component={SelectID} />
      <Stack.Screen name={page.TakeID} component={TakeID} />
      <Stack.Screen
        name={page.PersonalDataInput}
        component={PersonalDataInput}
      />
      <Stack.Screen name={page.TakeSelfieBefore} component={TakeSelfieBefore} />
      <Stack.Screen name={page.TakeSelfie} component={TakeSelfie} />
      <Stack.Screen name={page.ConfirmSelfie} component={ConfirmSelfie} />
    </Stack.Navigator>
  );
}

interface props {}
interface state {
  stage: string;
  idType: string;
}

export class Kyc extends Component<props, state> {
  constructor(props: props) {
    super(props);
    this.state = { stage: "ConfirmSelfie" };
  }

  render() {
    return (
      <View
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
          top: 0,
          backgroundColor: "#fff",
        }}
      >
        <NavigationContainer>
          <Stack.Navigator initialRouteName={page.StartKYC} headerMode="none">
            <Stack.Screen
              name={page.StartKYC}
              component={StartKYC}
              // props={navigator}
            />
            <Stack.Screen name={page.SelectID} component={SelectID} />
            <Stack.Screen name={page.TakeID} component={TakeID} />
            <Stack.Screen
              name={page.PersonalDataInput}
              component={PersonalDataInput}
            />
            <Stack.Screen
              name={page.TakeSelfieBefore}
              component={TakeSelfieBefore}
            />
            <Stack.Screen name={page.TakeSelfie} component={TakeSelfie} />
            <Stack.Screen name={page.ConfirmSelfie} component={ConfirmSelfie} />
          </Stack.Navigator>

          {/* {this.state.stage === "StartKYC" && <StartKYC handler={() => {}} />}
          {this.state.stage === "SelectID" && (
            <SelectID
              setIdHandler={() => this.setID}
              idType={this.state.idType}
            />
          )}
          {this.state.stage === "TakeID" && (
            <TakeID idType={this.state.idType} />
          )}
          {this.state.stage === "PersonalDataInput" && <PersonalDataInput />}
          {this.state.stage === "TakeSelfieBefore" && <TakeSelfieBefore />}
          {this.state.stage === "TakeSelfie" && <TakeSelfie />}
          {this.state.stage === "ConfirmSelfie" && <ConfirmSelfie />} */}
        </NavigationContainer>
      </View>
    );
  }
}
