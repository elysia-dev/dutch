import React, { FunctionComponent } from "react";
import { StartKYC } from "./StartKYC";
import { SelectID } from "./SelectID";
import { TakeID } from "./TakeID";
import { ConfirmID } from "./ConfirmID";
import { PersonalDataInput } from "./PersonalDataInput";
import { TakeSelfieBefore } from "./TakeSelfieBefore";
import { TakeSelfie } from "./TakeSelfie";
import { ConfirmSelfie } from "./ConfirmSelfie";
import { createStackNavigator } from "@react-navigation/stack";
import { KycPage } from "../../enums/pageEnum";
import { Argos } from "./Argos";

const Stack = createStackNavigator();

export const Kyc: FunctionComponent<{}> = () => {
  return (
    <Stack.Navigator initialRouteName={KycPage.StartKYC} headerMode="none">
      <Stack.Screen name={KycPage.StartKYC} component={StartKYC} />
      <Stack.Screen name={KycPage.Argos} component={Argos} />
      <Stack.Screen name={KycPage.SelectID} component={SelectID} />
      <Stack.Screen name={KycPage.TakeID} component={TakeID} />
      <Stack.Screen name={KycPage.ConfirmID} component={ConfirmID} />
      <Stack.Screen
        name={KycPage.TakeSelfieBefore}
        component={TakeSelfieBefore}
      />
      <Stack.Screen name={KycPage.TakeSelfie} component={TakeSelfie} />
      <Stack.Screen name={KycPage.ConfirmSelfie} component={ConfirmSelfie} />
      <Stack.Screen
        name={KycPage.PersonalDataInput}
        component={PersonalDataInput}
      />
    </Stack.Navigator>
  );
};
