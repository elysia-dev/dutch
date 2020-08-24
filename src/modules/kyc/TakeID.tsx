import React, { useState, useEffect, Component } from "react";
import { Text, View, TouchableOpacity, Platform } from "react-native";
import { Camera } from "expo-camera";
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library";

import styled from "styled-components/native";
import ReversePng from "./images/reverse.png";
import RecordPng from "./images/recordbutton.png";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import i18n from "../../i18n/i18n";
import { BackButton } from "../../shared/components/BackButton";

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
  // camera: HTMLDivElement;
  idType: string;
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

  // 사진을 찍으면 앨범에도 저장되고 상위 컴포넌트의 state에도 저장되어서 sibling 컴포넌트에서 불러올 수 있게
  takePicture = async () => {
    // const { status_roll } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (this.camera) {
      let photo = await this.camera.takePictureAsync({
        quality: 1,
        exif: true,
        base64: true,
      });
      // setPath(`${photo.uri}`);
      const asset = await MediaLibrary.createAssetAsync(`${photo.uri}`);
      // console.log(path);
    }
  };

  pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });
  };

  render() {
    if (this.state.hasPermission === false) {
      return <Text>No access to camera</Text>;
    } else {
      return (
        <View
          style={{
            flex: 1,
            width: "100%",
            position: "relative",
            top: 0,
            height: 900,
            // borderColor: "black",
            // borderWidth: 1,
          }}
        >
          <Camera
            style={{
              flex: 1,
              width: "100%",
              height: 700,
              borderColor: "black",
              borderWidth: 1,
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
              <BackButton handler={() => {}} />
              <H1Text>{i18n.t(`kyc_label.${this.props.idType}`)}</H1Text>

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
                onPress={this.takePicture}
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
