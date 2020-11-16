import { createContext } from 'react';
import * as ImageManipulator from 'expo-image-manipulator';

type KycContextType = {
  idType: string;
  idPhoto: ImageManipulator.ImageResult;
  hashedIdPhoto: string;
  selfie: ImageManipulator.ImageResult;
  hashedSelfie: string;
  setIdType: (type: string) => void;
  setIdPhoto: (photo: ImageManipulator.ImageResult) => void;
  setHashedIdPhoto: (hash: string) => void;
  setSelfie: (photo: ImageManipulator.ImageResult) => void;
  setHashedSelfie: (hash: string) => void;
};

const KycContext = createContext<KycContextType>({
  idType: '',
  idPhoto: {} as ImageManipulator.ImageResult,
  hashedIdPhoto: '',
  selfie: {} as ImageManipulator.ImageResult,
  hashedSelfie: '',
  setIdType: (_type: string) => {},
  setIdPhoto: (_photo: ImageManipulator.ImageResult) => {},
  setHashedIdPhoto: (_hash: string) => {},
  setSelfie: (_photo: ImageManipulator.ImageResult) => {},
  setHashedSelfie: (_hash: string) => {},
});

export default KycContext;
