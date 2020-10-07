/* eslint-disable @typescript-eslint/camelcase */
import React, {
  Component,
  FunctionComponent,
  useEffect,
  useState,
} from 'react';
import { Text, View, TouchableOpacity, Platform } from 'react-native';
import styled from 'styled-components/native';
import { NavigationScreenProp } from 'react-navigation';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';

import { Camera } from 'expo-camera';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import { Ionicons } from '@expo/vector-icons';

import { BackButton } from '../../shared/components/BackButton';
import ReversePng from './images/reverse.png';
import RecordPng from './images/recordbutton.png';
import i18n from '../../i18n/i18n';
import { KycPage } from '../../enums/pageEnum';
import { Photo } from '../../types/Photo';

const ButtonImg = styled.Image`
  width: 47px;
  height: 47px;
`;

const PText = styled.Text`
  color: #fff;
  font-size: 15px;
  text-align: center;
  margin-top: 13px;
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

type ParamList = {
  TakeSelfie: {
    id_type: string;
    idPhoto: any;
  };
};

const TakeSelfie: FunctionComponent<{}> = () => {
  let camera: any;
  const navigation = useNavigation();
  const route = useRoute<RouteProp<ParamList, 'TakeSelfie'>>();
  const { id_type, idPhoto } = route.params;
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
  // 셀피 이전 신분증 촬영에서 카메라 승인 받으면 다시 승인 받을 필요 없지 않나? -> storybook에 한해 살리기

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
      const selfie = await camera.takePictureAsync({
        quality: 1,
        exif: true,
        base64: true,
      });
      // const asset = await MediaLibrary.createAssetAsync(`${selfie.uri}`);
      // 웹에서 불가. 나중에 살리기
      return selfie;
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

  if (state.hasPermission === false) {
    return <Text>No access to camera</Text>;
  } else {
    return (
      <TakeSelfieWrapper>
        <Camera
          style={{ flex: 1, width: '100%', height: 700 }}
          type={state.type}
          ref={ref => {
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
            }}>
            <PText>{i18n.t('kyc.step2_text')}</PText>
          </View>
          <BottomCameraWrapper>
            <BottomButtonWrapper>
              <TouchableOpacity
                style={{
                  alignSelf: 'flex-end',
                  alignItems: 'center',
                  backgroundColor: 'transparent',
                }}
                onPress={async () => {
                  navigation.navigate(KycPage.ConfirmSelfie, {
                    selfie: await pickImage(),
                    id_type,
                    // photoId_hash: photoId_hash,
                    idPhoto,
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
                  navigation.navigate(KycPage.ConfirmSelfie, {
                    selfie: await takePicture(),
                    id_type,
                    // photoId_hash: photoId_hash,
                    idPhoto,
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
      </TakeSelfieWrapper>
    );
  }
};

export default TakeSelfie;
