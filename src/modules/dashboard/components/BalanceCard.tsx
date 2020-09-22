import React, { FunctionComponent } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import styled from "styled-components/native";

interface props {
  balance: string;
  profit: string;
  handler: () => void;
}

const H1Text = styled.Text`
  color: #fff;
  font-size: 15px;
  text-align: left;
  margin-bottom: 30px;
`;
const NumText = styled.Text`
  color: #fff;
  font-size: 35px;
  text-align: left;
  font-weight: bold;
`;
const NumText2 = styled.Text`
  color: #fff;
  font-size: 23px;
  text-align: right;
  font-weight: bold;
`;
export const BalanceCard: FunctionComponent<props> = (props) => {
  return (
    <TouchableOpacity onPress={props.handler}>
      <View
        style={{
          backgroundColor: "#3679B5",
          width: "100%",
          height: 200,
          borderRadius: 10,
          shadowOffset: { width: 2, height: 2 },
          shadowColor: "#3679B54D",
          shadowOpacity: 0.8,
          shadowRadius: 6,
          padding: 20,
          marginBottom: 25,
        }}
      >
        <H1Text>{"Total Balance"}</H1Text>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View style={{ flexDirection: "column" }}>
            <View
              style={{
                borderBottomWidth: 1,
                borderBottomColor: "#fff",
                borderStyle: "dashed",
                paddingBottom: 3,
                marginBottom: 3,
              }}
            >
              <NumText>{props.balance}</NumText>
            </View>

            <NumText2>{props.profit}</NumText2>
          </View>
          <View
            style={{
              backgroundColor: "#fff",
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
