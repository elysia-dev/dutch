import { createContext } from 'react';
import * as ImageManipulator from 'expo-image-manipulator';

type KycContextType = {
  idType: string;
  idPhoto: ImageManipulator.ImageResult;
  selfie: ImageManipulator.ImageResult;
  setIdType: (type: string) => void;
  setIdPhoto: (photo: ImageManipulator.ImageResult) => void;
  setSelfie: (photo: ImageManipulator.ImageResult) => void;
};

const KycContext = createContext<KycContextType>({
  idType: '',
  idPhoto: {} as ImageManipulator.ImageResult,
  selfie: {} as ImageManipulator.ImageResult,
  setIdType: (_type: string) => {},
  setIdPhoto: (_photo: ImageManipulator.ImageResult) => {},
  setSelfie: (_photo: ImageManipulator.ImageResult) => {},
});

export default KycContext;
