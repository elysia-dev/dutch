import axios from "axios";
import React, { FunctionComponent } from "react";
import { View } from "react-native";
import { StartKYC } from "./StartKYC";
import { SelectID } from "./SelectID";
import { TakeID } from "./TakeID";
import { ConfirmID } from "./ConfirmID";
import { PersonalDataInput } from "./PersonalDataInput";
import { TakeSelfieBefore } from "./TakeSelfieBefore";
import { TakeSelfie } from "./TakeSelfie";
import { ConfirmSelfie } from "./ConfirmSelfie";
import { createStackNavigator } from "@react-navigation/stack";

export enum page {
  StartKYC = "StartKYC",
  SelectID = "SelectID",
  TakeID = "TakeID",
  ConfirmID = "ConfirmID",
  TakeSelfieBefore = "TakeSelfieBefore",
  TakeSelfie = "TakeSelfie",
  ConfirmSelfie = "ConfirmSelfie",
  PersonalDataInput = "PersonalDataInput",
}

const Stack = createStackNavigator();

interface props {}

interface state {
  stage: string;
  idType: string;
}

export const Kyc: FunctionComponent<props> = () => {
  return (
    <Stack.Navigator initialRouteName={page.StartKYC} headerMode="none">
      <Stack.Screen name={page.StartKYC} component={StartKYC} />
      <Stack.Screen name={page.SelectID} component={SelectID} />
      <Stack.Screen name={page.TakeID} component={TakeID} />
      <Stack.Screen name={page.ConfirmID} component={ConfirmID} />
      <Stack.Screen name={page.TakeSelfieBefore} component={TakeSelfieBefore} />
      <Stack.Screen name={page.TakeSelfie} component={TakeSelfie} />
      <Stack.Screen name={page.ConfirmSelfie} component={ConfirmSelfie} />
      <Stack.Screen
        name={page.PersonalDataInput}
        component={PersonalDataInput}
      />
    </Stack.Navigator>
  );
};
