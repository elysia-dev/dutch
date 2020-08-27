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
import { page } from "./Kyc";

const H1Text = styled.Text`
  color: #fff;
  font-weight: bold;
  text-align: center;
  margin-top: 60px;
`;
const PText = styled.Text`
  color: #fff;
  margin-bottom: 12px;
  font-size: 13px;
  text-align: center;
  margin-top: 10px;
`;
const ButtonImg = styled.Image`
  width: 47px;
  height: 47px;
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
    // const { status_roll } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
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
        <View
          style={{
            flex: 1,
            width: "100%",
            position: "relative",
            top: -100,
            height: "100%",
            // borderColor: "black",
            // borderWidth: 1,
          }}
        >
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
            <View
              style={{
                position: "relative",
                width: "100%",
                flex: 1,
                backgroundColor: "transparent",
                flexDirection: "column",
              }}
            >
              <BackButton handler={() => navigation.goBack()} />
              <H1Text>{i18n.t(`kyc_label.${id_type}`)}</H1Text>

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
              ></View>
            </View>
            <View
              style={{
                flex: 1,
                backgroundColor: "transparent",
                flexDirection: "column",
                // borderColor: "white",
                // borderWidth: 1,
                top: 87,
              }}
            >
              <H1Text>{i18n.t("kyc.kyc_take_ID")}</H1Text>
              <PText>{i18n.t("kyc.kyc_take_ID_text")}</PText>
            </View>

            <View
              style={{
                // borderColor: "black",
                // borderWidth: 1,
                flex: 1,
                flexDirection: "row",
                justifyContent: "space-between",
                margin: 30,
                position: "relative",
              }}
            >
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
                  navigation.navigate(page.ConfirmID, {
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
            </View>
          </Camera>
        </View>
      );
    }
  }
}
