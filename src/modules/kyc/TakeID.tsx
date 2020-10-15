/* eslint-disable @typescript-eslint/camelcase */
import React, {
  Component,
  FunctionComponent,
  useEffect,
  useRef,
  useState,
} from 'react';
import { TouchableOpacity, Platform, View } from 'react-native';
import { Camera } from 'expo-camera';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';

import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import styled from 'styled-components/native';
import { Ionicons } from '@expo/vector-icons';
import ReversePng from './images/reverse.png';
import RecordPng from './images/recordbutton.png';
import i18n from '../../i18n/i18n';
import { BackButton } from '../../shared/components/BackButton';
import { SubmitButton } from '../../shared/components/SubmitButton';
import { KycPage } from '../../enums/pageEnum';
import CameraPermissionPng from './images/cameraPermission.png';
import { Photo } from '../../types/Photo';
import WrapperLayout from '../../shared/components/WrapperLayout';
import { H1Text } from '../../shared/components/H1Text';
import { PText } from '../../shared/components/PText';

const ButtonImg = styled.Image`
  width: 47px;
  height: 47px;
`;
const TakeIdWrapper = styled.View`
  flex: 1;
  background-color: #000000;
`;
const HeaderCameraWrapper = styled.View`
  position: relative;
  width: 100%;
  flex: 1;
  background-color: rgba(0, 0, 0, 0.5);
  flex-direction: column;
  padding-top: 25px;
`;
const BottomCameraWrapper = styled.View`
  position: relative;
  width: 100%;
  flex: 1;
  background-color: rgba(0, 0, 0, 0.5);
`;
const BottomButtonWrapper = styled.View`
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
  margin: 30px;
`;
const CameraFocusWrapper = styled.View`
  flex: 1;
  flex-direction: row;
`;
const CameraFocusLeft = styled.View`
  width: 5%
  background-color: rgba(0, 0, 0, 0.5);
`;
const CameraFocusRight = styled.View`
  width: 5%
  background-color: rgba(0, 0, 0, 0.5);
`;
const CameraFocus = styled.View`
  width: 90%;
  height: 100%;
  border-color: rgba(255, 255, 255, 0.5);
  border-width: 1px;
`;
const CameraInnerWLine = styled.View`
  position: absolute;
  width: 100%;
  height: 35%;
  margin-top: 22.5%;
  margin-bottom: 22.5%;
  border-top-color: rgba(255, 255, 255, 0.5);
  border-top-width: 1px;
  border-bottom-color: rgba(255, 255, 255, 0.5);
  border-bottom-width: 1px;
`;
const CameraInnerDLine = styled.View`
  position: absolute;
  height: 100%;
  width: 40%;
  margin-left: 30%;
  margin-right: 30%;
  border-left-color: rgba(255, 255, 255, 0.5);
  border-left-width: 1px;
  border-right-color: rgba(255, 255, 255, 0.5);
  border-right-width: 1px;
`;
const CameraInnerLeftTopLine = styled.View`
  position: absolute;
  border-left-color: white;
  border-left-width: 3px;
  border-top-color: white;
  border-top-width: 3px;
  width: 25px;
  height: 25px;
  left: 5%;
`;
const CameraInnerRightTopLine = styled.View`
  position: absolute;
  border-right-color: white;
  border-right-width: 3px;
  border-top-color: white;
  border-top-width: 3px;
  width: 25px;
  height: 25px;
  left: 89%;
`;
const CameraInnerLeftBottomLine = styled.View`
  position: absolute;
  border-left-color: white;
  border-left-width: 3px;
  border-bottom-color: white;
  border-bottom-width: 3px;
  width: 25px;
  height: 25px;
  top: 90%;
  left: 5%;
`;
const CameraInnerRightBottomLine = styled.View`
  position: absolute;
  border-right-color: white;
  border-right-width: 3px;
  border-bottom-color: white;
  border-bottom-width: 3px;
  width: 25px;
  height: 25px;
  top: 90%;
  left: 89%;
`;
const CameraPermissionImg = styled.Image`
  width: 209px;
  margin: 20% auto 15px auto;
`;

interface State {
  hasPermission: boolean;
  type: typeof Camera.Constants.Type;
}

type ParamList = {
  TakeID: {
    id_type: string;
  };
};

const TakeID: FunctionComponent<{}> = () => {
  let camera: any;
  const navigation = useNavigation();
  const route = useRoute<RouteProp<ParamList, 'TakeID'>>();
  const { id_type } = route.params;
  const [state, setState] = useState<State>({
    hasPermission: false,
    type: Camera.Constants.Type.back,
  });

  useEffect(() => {
    if (Platform.OS === 'ios') {
      Permissions.askAsync(Permissions.CAMERA_ROLL, Permissions.CAMERA).then(
        status => {
          if (!status.granted) {
            alert('Sorry, we need camera roll permissions to make this work!');
          } else {
            setState({ ...state, hasPermission: true });
          }
        },
      );
    } else {
      Permissions.askAsync(Permissions.CAMERA).then(status => {
        if (!status.granted) {
          alert('Sorry, we need camera roll permissions to make this work!');
        } else {
          setState({ ...state, hasPermission: true });
        }
      });
    }
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

  const takePicture = async (): Promise<Photo | undefined> => {
    if (camera) {
      const idPhoto = await camera.takePictureAsync({
        quality: 1,
        exif: true,
        base64: true,
      });
      // setPath(`${photo.uri}`);
      // const asset = await MediaLibrary.createAssetAsync(`${idPhoto.uri}`);
      return idPhoto;
    }
  };

  const pickImage = async () => {
    const selfieAlbum = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      base64: true,
    });
    return selfieAlbum;
  };

  if (!state.hasPermission) {
    return (
      <WrapperLayout
        title={" "}
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
            <PText
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
      <TakeIdWrapper>
        <Camera
          style={{
            flex: 1,
            width: '100%',
            position: 'relative',
            top: 0,
            height: '100%',
          }}
          type={state.type}
          ref={ref => {
            camera = ref;
          }}>
          <HeaderCameraWrapper>
            <View style={{ flex: 1, marginLeft: '5%', flexDirection: 'row' }}>
              <BackButton handler={() => navigation.goBack()} isWhite={true} />
              <H1Text
                label={i18n.t(`kyc_label.${id_type}`)}
                style={{
                  color: '#FFF',
                  fontSize: 18,
                  flex: 1,
                  marginTop: 15,
                }}
              />
            </View>
          </HeaderCameraWrapper>
          <CameraFocusWrapper>
            <CameraFocusLeft />
            <CameraInnerLeftTopLine />
            <CameraInnerRightTopLine />
            <CameraInnerLeftBottomLine />
            <CameraInnerRightBottomLine />
            <CameraFocus>
              <CameraInnerWLine />
              <CameraInnerDLine />
            </CameraFocus>
            <CameraFocusRight />
          </CameraFocusWrapper>
          <BottomCameraWrapper>
            <H1Text
              label={i18n.t('kyc.take_ID')}
              style={{ color: '#FFF', marginTop: 30, textAlign: 'center' }}
            />
            <PText
              label={i18n.t('kyc.take_ID_text')}
              style={{
                color: '#FFF',
                marginTop: 13,
                textAlign: 'center',
                fontSize: 15,
              }}
            />
            <BottomButtonWrapper>
              <TouchableOpacity
                style={{
                  alignSelf: 'flex-end',
                  alignItems: 'center',
                  backgroundColor: 'transparent',
                }}
                onPress={async () => {
                  navigation.navigate(KycPage.ConfirmID, {
                    idPhoto: await pickImage(),
                    id_type,
                    // photoId_hash: photoId_hash,
                  });
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
                  navigation.navigate(KycPage.ConfirmID, {
                    id_type,
                    idPhoto: await takePicture(),
                  });
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
      </TakeIdWrapper>
    );
  }
};

export default TakeID;
