import React, { FunctionComponent } from "react";
import { Text, View, TouchableOpacity } from "react-native";
import Slider from "react-native-slider";

import styled from "styled-components/native";
import i18n from "../../../i18n/i18n";

interface props {
  sliderHandler: (value: number) => void;
  investment: number;
  product: object;
}

const H1Text = styled.Text`
  color: #1c1c1c;
  font-size: 20px;
  text-align: left;
  z-index: 3;
`;
const GText = styled.Text`
  color: #626368;
  font-size: 12px;
  text-align: left;
  font-weight: 300;
`;
const ButtonText = styled.Text`
  color: #626368;
  font-size: 12px;
  text-align: center;
  font-weight: 300;
`;

export const Calculator: FunctionComponent<props> = (props: props) => {
  return (
    <View
      style={{
        height: 180,
        padding: 20,
        borderBottomColor: "#F6F6F8",
        borderBottomWidth: 5,
      }}
    >
      <H1Text>{i18n.t("product_label.return_calculator")}</H1Text>
      <View
        style={{
          marginTop: 15,
          flex: 1,
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <View style={{ flex: 1, flexDirection: "column" }}>
          <GText>{i18n.t("product_label.investment")}</GText>
          <Text>{`${Math.round(props.investment)}$`}</Text>
        </View>
        <View
          style={{
            flex: 1,
            flexDirection: "column",
          }}
        >
          <GText>{i18n.t("product_label.expected_return")}</GText>
          <Text>{`${Math.round(
            props.investment * parseInt(props.product.expectedAnnualReturn)
          )}$`}</Text>
        </View>
      </View>
      <View style={{ flex: 1, flexDirection: "row" }}>
        <View style={{ flex: 4 }}>
          <Slider
            minimumValue={0}
            maximumValue={100}
            minimumTrackTintColor={"#64B6F4"}
            maximumTrackTintColor={"#fff"}
            thumbTintColor={"#fff"}
            thumbStyle={{ borderColor: "#64B6F4", borderWidth: 2 }}
            trackStyle={{
              height: 8,
              borderWidth: 1,
              borderColor: "#D0D8DF",
              borderRadius: 4,
              shadowColor: "#00000029",
              shadowOpacity: 0.6,
              shadowOffset: { width: 0, height: 0 },
              shadowRadius: 6,
              width: "90%",
            }}
            thumbTouchSize={{ width: 20, height: 20 }}
            value={props.investment}
            onValueChange={props.sliderHandler}
          ></Slider>
        </View>
        <View style={{ flex: 1, paddingTop: 7.5, paddingRight: 20 }}>
          <TouchableOpacity onPress={() => {}}>
            <View
              style={{
                width: 80,
                height: 25,
                borderRadius: 3,
                backgroundColor: "#F6F6F8",
                borderWidth: 1,
                borderColor: "#D0D8DF",
                justifyContent: "center",
                alignContent: "center",
              }}
            >
              <ButtonText>{i18n.t("product_label.more_info")}</ButtonText>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
