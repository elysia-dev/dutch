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

<<<<<<< HEAD
interface props {}
=======
interface props {
  camera: HTMLDivElement;
}
>>>>>>> e99f9c28f7b1bfd8e0d092a805f1b3b51b2ecfca

interface state {
  hasPermission: boolean;
  type: any;
}

export class TakeSelfie extends Component<props, state> {
  camera: any;
  constructor(props: props) {
    super(props);
    this.state = {
      hasPermission: false,
      type: Camera.Constants.Type.back,
    };
  }

<<<<<<< HEAD
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
  // 셀피 이전 신분증 촬영에서 카메라 승인 받으면 다시 승인 받을 필요 없지 않나? -> storybook에 한해 살리기
=======
  //   async componentWillMount() {
  //     if (Platform.OS === "ios") {
  //       const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
  //       if (status !== "granted") {
  //         alert("Sorry, we need camera roll permissions to make this work!");
  //       }
  //     }
  //     const { status } = await Permissions.askAsync(Permissions.CAMERA);
  //     this.setState({ hasPermission: status === "granted" });
  //   } 셀피 이전 신분증 촬영에서 카메라 승인 받으면 다시 승인 받을 필요 없지 않나?
>>>>>>> e99f9c28f7b1bfd8e0d092a805f1b3b51b2ecfca

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
            top: -100,
            height: 900,
            // borderColor: "black",
            // borderWidth: 1,
          }}
        >
          <Camera
            style={{ flex: 1, width: "100%", height: 700 }}
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
            ></View>

            <View
              style={{
                position: "relative",
                flex: 1,
                backgroundColor: "transparent",
                flexDirection: "column",
                top: 220,
              }}
            >
              <PText>{i18n.t("kyc.kyc_step3_text")}</PText>
            </View>

            <View
              style={{
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
