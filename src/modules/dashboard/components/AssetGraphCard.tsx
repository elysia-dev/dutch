import React, { FunctionComponent } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import styled from "styled-components/native";
import i18n from "../../../i18n/i18n";
import { BarChart, StackedBarChart } from "react-native-chart-kit";
interface props {}

const H1Text = styled.Text`
  color: #1c1c1c;
  font-size: 15px;
  text-align: left;
  margin-bottom: 10px;
`;
const NumText = styled.Text`
  color: #1c1c1c;
  font-size: 25px;
  text-align: left;
  font-weight: bold;
  margin-bottom: 18px;
`;
const PText = styled.Text`
  color: #838383;
  font-size: 15px;
  text-align: left;
`;
const NumText2 = styled.Text`
  color: #1c1c1c;
  font-size: 15px;
  text-align: right;
`;
export const AssetGraphCard: FunctionComponent<props> = (props) => {
  return (
    <View
      style={{
        backgroundColor: "#fff",
        width: "100%",
        height: 240,
        borderRadius: 10,
        shadowOffset: { width: 2, height: 2 },
        shadowColor: "#00000033",
        shadowOpacity: 0.8,
        shadowRadius: 5,
        padding: 20,
        marginBottom: 20,
      }}
    >
      <H1Text>{"Asset Graph"}</H1Text>

      <StackedBarChart
        style={{ paddingLeft: 5 }}
        showLegend={false}
        data={{
          labels: ["월", "화", "수", "목", "금", "토", "일"],
          data: [[60], [70], [80], [20], [50], [40], [100]],
          barColors: ["#3679B5"],
        }}
        width={Dimensions.get("window").width - 80}
        height={170}
        yAxisLabel="$"
        chartConfig={{
          backgroundColor: "rgba(255,255,255, 0)",
          backgroundGradientFrom: "#fff",
          backgroundGradientTo: "#fff",
          decimalPlaces: 2, // optional, defaults to 2dp
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(167, 167, 167, ${opacity})`,
          style: {
            borderRadius: 0,
          },
        }}
      />
    </View>
  );
};
