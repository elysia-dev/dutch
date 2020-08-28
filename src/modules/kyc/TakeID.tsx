import React, { Component } from "react";
import { Text, View, TouchableOpacity, Platform } from "react-native";
import { Camera } from "expo-camera";
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library";

import styled from "styled-components/native";
import ReversePng from "./images/reverse.png";
import RecordPng from "./images/recordbutton.png";
import { Ionicons } from "@expo/vector-icons";
import i18n from "../../i18n/i18n";
import { BackButton } from "../../shared/components/BackButton";

import { NavigationScreenProp, NavigationRoute } from "react-navigation";
import { KycPage } from "../../enums/pageEnum";

const HeaderText = styled.Text`
  position: absolute;
  color: #fff;
  font-size: 18px;
  font-weight: bold;
  text-align: left;
  margin-top: 9px;
  margin-left: 40px;
`;
const H1Text = styled.Text`
  color: #fff;
  font-weight: bold;
  text-align: center;
  margin-top: 30px;
  font-size: 20px;
  font-weight: bold;
`;
const PText = styled.Text`
  color: #fff;
  font-size: 15px;
  text-align: center;
  margin-top: 13px;
`;
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
const HeaderTextWrapper = styled.View`
  position: relative;
  flex: 1;
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
  border-width: 1;
`;
const CameraInnerWLine = styled.View`
  position: absolute;
  width: 100%;
  height: 35%;
  margin-top: 22.5%;
  margin-bottom: 22.5%;
  border-top-color: rgba(255, 255, 255, 0.5);
  border-top-width: 1;
  border-bottom-color: rgba(255, 255, 255, 0.5);
  border-bottom-width: 1;
`;
const CameraInnerDLine = styled.View`
  position: absolute;
  height: 100%;
  width: 40%;
  margin-left: 30%;
  margin-right: 30%;
  border-left-color: rgba(255, 255, 255, 0.5);
  border-left-width: 1;
  border-right-color: rgba(255, 255, 255, 0.5);
  border-right-width: 1;
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
interface props {
  navigation: NavigationScreenProp<any>;
  route: NavigationRoute;
}

interface state {
  hasPermission: boolean;
  type: any;
}

export class TakeID extends Component<props, state> {
  camera: any;
  constructor(props: props) {
    super(props);
    this.state = {
      hasPermission: false,
      type: Camera.Constants.Type.back,
    };
  }
  async componentWillMount() {
    if (Platform.OS === "ios") {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
      }
    }
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasPermission: status === "granted" });
  }
  reverseCamera = () => {
    this.setState({
      type:
        this.state.type === Camera.Constants.Type.back
          ? Camera.Constants.Type.front
          : Camera.Constants.Type.back,
    });
  };

  takePicture = async () => {
    const { status_roll } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (this.camera) {
      let idPhoto = await this.camera.takePictureAsync({
        quality: 1,
        exif: true,
        base64: true,
      });
      // setPath(`${photo.uri}`);
      // const asset = await MediaLibrary.createAssetAsync(`${photo.uri}`);
      return idPhoto;
    }
  };

  pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });
  };

  render() {
    const { route, navigation } = this.props;

    const { id_type } = route.params;

    if (this.state.hasPermission === false) {
      return <Text>No access to camera</Text>;
    } else {
      return (
        <TakeIdWrapper>
          <Camera
            style={{
              flex: 1,
              width: "100%",
              position: "relative",
              top: 0,
              height: "100%",
              // borderColor: "black",
              // borderWidth: 1,
            }}
            type={this.state.type}
            ref={(ref) => {
              this.camera = ref;
            }}
          >
            <HeaderCameraWrapper>
              <HeaderTextWrapper>
                <BackButton
                  handler={() => navigation.goBack()}
                  isWhite={true}
                />
                <HeaderText>{i18n.t(`kyc_label.${id_type}`)}</HeaderText>
              </HeaderTextWrapper>
              {/*}
                <View
                  style={{
                    position: "relative",
                    flex: 1,
                    backgroundColor: "transparent",
                    flexDirection: "row",
                    borderColor: "white",
                    borderWidth: 2,
                    marginLeft: 15,
                    marginRight: 15,
                    height: 200,
                    top: 100,
                  }}
                >
                </View>
                */}
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
              <H1Text>{i18n.t("kyc.kyc_take_ID")}</H1Text>
              <PText>{i18n.t("kyc.kyc_take_ID_text")}</PText>
              <BottomButtonWrapper>
                <TouchableOpacity
                  style={{
                    alignSelf: "flex-end",
                    alignItems: "center",
                    backgroundColor: "transparent",
                  }}
                  onPress={this.pickImage}
                >
                  <Ionicons
                    name="ios-photos"
                    style={{ color: "#fff", fontSize: 40 }}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    flex: 0.1,
                    alignSelf: "flex-end",
                    alignItems: "center",
                  }}
                  onPress={async () => {
                    navigation.navigate(KycPage.ConfirmID, {
                      id_type: id_type,
                      idPhoto: await this.takePicture(),
                    });
                  }}
                >
                  <ButtonImg source={RecordPng} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    flex: 0.1,
                    alignSelf: "flex-end",
                    alignItems: "center",
                  }}
                  onPress={this.reverseCamera}
                >
                  <ButtonImg source={ReversePng} />
                </TouchableOpacity>
              </BottomButtonWrapper>
            </BottomCameraWrapper>
          </Camera>
        </TakeIdWrapper>
      );
    }
  }
}
