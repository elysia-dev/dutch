/* eslint-disable @typescript-eslint/camelcase */
import React, {
  FunctionComponent,
  useContext,
  useEffect,
  useState,
} from 'react';
import { View, TouchableOpacity, Modal, ActivityIndicator } from 'react-native';
import styled from 'styled-components/native';
import { useNavigation, useIsFocused } from '@react-navigation/native';

import { Camera } from 'expo-camera';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import * as ImageManipulator from 'expo-image-manipulator';
import { Ionicons } from '@expo/vector-icons';

import { BackButton } from '../../shared/components/BackButton';
import ReversePng from './images/reverse.png';
import RecordPng from './images/recordbutton.png';
import i18n from '../../i18n/i18n';
import { KycPage } from '../../enums/pageEnum';
import WrapperLayout from '../../shared/components/WrapperLayout';
import { H1Text, P1Text } from '../../shared/components/Texts';
import CameraPermissionPng from './images/cameraPermission.png';
import { SubmitButton } from '../../shared/components/SubmitButton';
import { LoadingStatus } from '../../enums/LoadingStatus';
import KycContext from '../../contexts/KycContext';

const ButtonImg = styled.Image`
  width: 47px;
  height: 47px;
`;
const CameraPermissionImg = styled.Image`
  width: 209px;
  margin: 20% auto 30px auto;
`;
const TakeSelfieWrapper = styled.View`
  flex: 1;
  background-color: #000000;
`;
const HeaderCameraWrapper = styled.View`
  position: relative;
  width: 100%;
  background-color: rgba(20, 15, 38, 0.87);
  flex-direction: column;
  padding-top: 25px;
  height: 150px;
`;
const BottomCameraWrapper = styled.View`
  position: relative;
  width: 100%;
  height: 120px;
  background-color: rgba(6, 5, 5, 1);
`;
const BottomButtonWrapper = styled.View`
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
  margin: 30px;
`;

interface State {
  hasPermission: boolean;
  type: typeof Camera.Constants.Type;
}

const TakeSelfie: FunctionComponent<{}> = () => {
  let camera: Camera | null;
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const { setSelfie } = useContext(KycContext);
  const [state, setState] = useState<State>({
    hasPermission: true,
    type: Camera.Constants.Type.back,
  });
  const [status, setStatus] = useState(LoadingStatus.NONE);

  useEffect(() => {
    Permissions.askAsync(Permissions.CAMERA_ROLL, Permissions.CAMERA).then(
      (status) => {
        if (!status.granted) {
          alert('Sorry, we need camera roll permissions to make this work!');
        } else {
          setState({ ...state, hasPermission: true });
        }
      },
    );
  }, []);

  const reverseCamera = () => {
    setState({
      ...state,
      type:
        state.type === Camera.Constants.Type.back
          ? Camera.Constants.Type.front
          : Camera.Constants.Type.back,
    });
  };

  const takePicture = async (): Promise<
    ImageManipulator.ImageResult | undefined
  > => {
    if (camera) {
      setStatus(LoadingStatus.PENDING);
      const selfie = await camera.takePictureAsync({
        quality: 1,
        exif: true,
        base64: true,
      });
      const compressedSelfie = await ImageManipulator.manipulateAsync(
        selfie.uri,
        [{ resize: { width: 800 } }],
        { compress: 1, format: ImageManipulator.SaveFormat.PNG, base64: true },
      );
      await MediaLibrary.createAssetAsync(`${selfie.uri}`);
      return compressedSelfie;
    }
  };

  const pickImage = async () => {
    const selfieAlbum = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      base64: true,
    });
    if (!selfieAlbum.cancelled) {
      setStatus(LoadingStatus.PENDING);
      const compressedSelfieAlbum = await ImageManipulator.manipulateAsync(
        !selfieAlbum.cancelled ? selfieAlbum.uri : '',
        [{ resize: { width: 600 } }],
        { compress: 0, format: ImageManipulator.SaveFormat.PNG, base64: true },
      );
      return compressedSelfieAlbum;
    }
  };

  if (!state.hasPermission) {
    return (
      <WrapperLayout
        title={' '}
        backButtonHandler={() => {
          setState({
            ...state,
          });
          navigation.goBack();
        }}
        isScrolling={false}
        body={
          <>
            <CameraPermissionImg source={CameraPermissionPng} />
            <H1Text
              label={i18n.t('kyc.camera_access_denied')}
              style={{ textAlign: 'center', marginTop: 28 }}
            />
            <P1Text
              label={i18n.t('kyc.camera_access_denied_text')}
              style={{ textAlign: 'center', marginTop: 10, color: '#626368' }}
            />
          </>
        }
        button={
          <SubmitButton
            title={i18n.t('kyc_label.camera_access_return')}
            handler={() => {
              setState({
                ...state,
                hasPermission: false,
              });
              navigation.goBack();
            }}
          />
        }
      />
    );
  } else {
    return (
      <>
        {
          <Modal visible={status === LoadingStatus.PENDING} transparent={true}>
            <View
              style={{
                width: '100%',
                height: '100%',
                justifyContent: 'center',
                alignSelf: 'center',
              }}>
              <ActivityIndicator size="large" color="#fff" />
              <P1Text
                label={i18n.t('kyc.image_processing')}
                style={{ color: '#fff', alignSelf: 'center', marginTop: 10 }}
              />
            </View>
          </Modal>
        }
        <TakeSelfieWrapper>
          {isFocused && (
            <Camera
              ratio={'16:9'}
              useCamera2Api={true}
              style={{ flex: 1, width: '100%', height: 700 }}
              type={state.type}
              ref={(ref) => {
                camera = ref;
              }}>
              <HeaderCameraWrapper>
                <BackButton
                  handler={() => navigation.goBack()}
                  isWhite={true}
                  style={{ marginTop: 30, marginLeft: 20 }}
                />
              </HeaderCameraWrapper>

              <View
                style={{
                  position: 'relative',
                  flex: 1,
                  backgroundColor: 'transparent',
                  flexDirection: 'column',
                  top: 220,
                }}
              />
              <BottomCameraWrapper>
                <BottomButtonWrapper>
                  <TouchableOpacity
                    style={{
                      alignSelf: 'flex-end',
                      alignItems: 'center',
                      backgroundColor: 'transparent',
                    }}
                    onPress={async () => {
                      const pickedSelfie = await pickImage();
                      if (pickedSelfie) {
                        setSelfie(pickedSelfie);
                        navigation.navigate(KycPage.ConfirmSelfie);
                        setStatus(LoadingStatus.SUCCESS);
                      }
                    }}>
                    <Ionicons
                      name="ios-photos"
                      style={{ color: '#fff', fontSize: 40 }}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      flex: 0.1,
                      alignSelf: 'flex-end',
                      alignItems: 'center',
                    }}
                    onPress={async () => {
                      const selfieTaken = await takePicture();
                      if (selfieTaken) {
                        setSelfie(selfieTaken);
                        navigation.navigate(KycPage.ConfirmSelfie);
                        setStatus(LoadingStatus.SUCCESS);
                      }
                    }}>
                    <ButtonImg source={RecordPng} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      flex: 0.1,
                      alignSelf: 'flex-end',
                      alignItems: 'center',
                    }}
                    onPress={reverseCamera}>
                    <ButtonImg source={ReversePng} />
                  </TouchableOpacity>
                </BottomButtonWrapper>
              </BottomCameraWrapper>
            </Camera>
          )}
        </TakeSelfieWrapper>
        {status === LoadingStatus.PENDING && (
          <View
            style={{
              backgroundColor: 'rgba(0,0,0,0.5)',
              position: 'absolute',
              width: '100%',
              height: '100%',
            }}></View>
        )}
      </>
    );
  }
};

export default TakeSelfie;
