import React, { FunctionComponent } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import styled from "styled-components/native";

interface props {
  name: string;
  investment: string;
  profit: string;
}

const H1Text = styled.Text`
  color: #1c1c1c;
  font-size: 15px;
  text-align: left;
`;

const NumText = styled.Text`
  font-size: 15px;
  font-weight: bold;
  text-align: right;
`;
export const Asset: FunctionComponent<props> = (props) => {
  return (
    <View style={{ flexDirection: "row", marginBottom: 25 }}>
      <View style={{ flex: 1, paddingRight: 20 }}>
        <Image
          style={{ width: "100%", height: "100%", resizeMode: "center" }}
          source={require("../images/building.png")}
        />
      </View>
      <View
        style={{
          flex: 4,
          backgroundColor: "#fff",
          height: 100,
          borderRadius: 10,
          shadowOffset: { width: 2, height: 2 },
          shadowColor: "#00000033",
          shadowOpacity: 0.8,
          shadowRadius: 6,
          padding: 20,
        }}
      >
        <TouchableOpacity>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <H1Text>{props.name}</H1Text>
            <View style={{ flexDirection: "column" }}>
              <NumText>{props.investment}</NumText>
              <NumText style={{ color: "#3679B5" }}>{props.profit}</NumText>
            </View>
          </View>

          <View
            style={{
              width: "100%",
              borderRadius: 5,
              height: 10,
              borderColor: "#DCDFED",
              borderWidth: 1,
              marginTop: 13,
            }}
          >
            <View
              style={{
                width: "30%",
                height: "100%",
                backgroundColor: "#2C6190",
                borderRadius: 5,
              }}
            ></View>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};
