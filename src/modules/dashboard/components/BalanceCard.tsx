import React, { FunctionComponent } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import styled from "styled-components/native";

interface props {
  balance: string;
  profit: string;
  handler: () => void;
}

const H1Text = styled.Text`
  color: #1c1c1c;
  font-size: 15px;
  text-align: left;
  margin-bottom: 30px;
`;
const NumText = styled.Text`
  color: #1c1c1c;
  font-size: 35px;
  text-align: left;
  font-weight: bold;
`;
const NumText2 = styled.Text`
  color: #3679b5;
  font-size: 23px;
  text-align: left;
  font-weight: bold;
`;
export const BalanceCard: FunctionComponent<props> = (props) => {
  return (
    <TouchableOpacity onPress={props.handler}>
      <View
        style={{
          backgroundColor: "#fff",
          width: "100%",
          height: 200,
          borderRadius: 10,
          shadowOffset: { width: 2, height: 2 },
          shadowColor: "#00000033",
          shadowOpacity: 0.8,
          shadowRadius: 6,
          padding: 20,
        }}
      >
        <H1Text>{"Total Balance"}</H1Text>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View style={{ flexDirection: "column" }}>
            <NumText>{props.balance}</NumText>
            <NumText2>{props.profit}</NumText2>
          </View>
          <View
            style={{
              backgroundColor: "#2C6190",
              width: 60,
              height: 60,
              borderRadius: 30,
              shadowOffset: { width: 0, height: 3 },
              shadowColor: "#00000029",
              shadowOpacity: 0.8,
              shadowRadius: 6,
            }}
          >
            {/* 나중에 이미지 넣기 */}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};
