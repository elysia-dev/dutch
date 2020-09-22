import React, { Component, FunctionComponent, Props } from "react";
import {
  StyleSheet,
  Text,
  View,
  GestureResponderEvent,
  Image,
} from "react-native";

import styled from "styled-components/native";
import i18n from "../../../i18n/i18n";
import { Story } from "../../../types/product";

const H1Text = styled.Text`
  font-size: 20px;
  color: #1c1c1c;
  text-align: left;
  margin-bottom: 5px;
  font-weight: bold;
`;
const PText = styled.Text`
  font-size: 13px;
  color: #4e4e4e;
  text-align: left;
  margin-bottom: 8px;
`;

interface props {
  story: Story;
}

export const Item: FunctionComponent<props> = (props) => {
  return (
    <View
      style={{
        width: "100%",
        height: 416,
        borderRadius: 10,
        shadowOffset: { width: 2, height: 2 },
        shadowColor: "#00000033",
        shadowOpacity: 0.8,
        shadowRadius: 5,
        marginTop: 15,
        marginBottom: 15,
      }}
    >
      <Image
        source={{ uri: props.story.images }}
        style={{
          width: "100%",
          height: "100%",
          resizeMode: "cover",
          borderRadius: 10,
        }}
      />
      <View
        style={{ position: "absolute", flexDirection: "column", padding: 20 }}
      >
        <PText>{props.story.subTitle}</PText>
        <H1Text>{props.story.title}</H1Text>
      </View>
    </View>
  );
};
