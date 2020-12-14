import React, { FunctionComponent, useState } from 'react';
import * as ImageManipulator from 'expo-image-manipulator';
import { createStackNavigator } from '@react-navigation/stack';
import StartKYC from './StartKYC';
import SelectID from './SelectID';
import TakeID from './TakeID';
import ConfirmID from './ConfirmID';
import PersonalDataInput from './PersonalDataInput';
import TakeSelfieBefore from './TakeSelfieBefore';
import TakeSelfie from './TakeSelfie';
import ConfirmSelfie from './ConfirmSelfie';
import { KycPage } from '../../enums/pageEnum';
import KycContext from '../../contexts/KycContext';

const Stack = createStackNavigator();

interface KycState {
  idType: string;
  idPhoto: ImageManipulator.ImageResult;
  selfie: ImageManipulator.ImageResult;
}
const defaultState = {
  idType: '',
  idPhoto: {} as ImageManipulator.ImageResult,
  selfie: {} as ImageManipulator.ImageResult,
};

export const Kyc: FunctionComponent<{}> = () => {
  const [state, setState] = useState<KycState>(defaultState);

  return (
    <KycContext.Provider
      value={{
        ...state,
        setIdType: (type: string) => {
          setState({ ...state, idType: type });
        },
        setIdPhoto: (photo: ImageManipulator.ImageResult) => {
          setState({ ...state, idPhoto: photo });
        },
        setSelfie: (photo: ImageManipulator.ImageResult) => {
          setState({ ...state, selfie: photo });
        },
      }}>
      <Stack.Navigator initialRouteName={KycPage.StartKYC} headerMode="none">
        <Stack.Screen name={KycPage.StartKYC} component={StartKYC} />
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
    </KycContext.Provider>
  );
};
