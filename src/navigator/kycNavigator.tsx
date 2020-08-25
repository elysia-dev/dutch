import { createStackNavigator } from "@react-navigation/stack";
import { withNavigation } from "react-navigation";
import { Kyc } from "../modules/kyc/kyc";
import { PersonalDataInput } from "../modules/kyc/PersonalDataInput";
import { ConfirmSelfie } from "../modules/kyc/ConfirmSelfie";
import { SelectID } from "../modules/kyc/SelectID";
import { StartKYC } from "../modules/kyc/StartKYC";
import { TakeID } from "../modules/kyc/TakeID";
import { TakeSelfie } from "../modules/kyc/TakeSelfie";
import { TakeSelfieBefore } from "../modules/kyc/TakeSelfieBefore";

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

// export default withNavigation(kycNavigator);
