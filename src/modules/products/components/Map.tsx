import React, { Component, FunctionComponent } from "react";
import MapView, { Marker } from "react-native-maps";
import {
  StyleSheet,
  View,
  Dimensions,
  TouchableOpacity,
  Text,
} from "react-native";
import latlon from "../latlon";
import i18n from "../../../i18n/i18n";
import styled from "styled-components/native";

const H1Text = styled.Text`
  color: #1c1c1c;
  font-size: 20px;
  text-align: left;
  z-index: 3;
`;
const WText = styled.Text`
  margin-top: 18px;
  color: #fff;
  font-size: 14px;
`;
const GText = styled.Text`
  color: #626368;
  font-size: 12px;
  text-align: left;
  font-weight: 300;
`;
const PText = styled.Text`
  color: #1c1c1c;
  font-size: 12px;
  font-weight: 300;
`;

interface props {
  product: { id: number; data: { address: string } };
  // product: object;
}

export const Map: FunctionComponent<props> = (props: props) => {
  const markerCord = {
    latitude: latlon[props.product.id].lat,
    longitude: latlon[props.product.id].lat,
  };

  return (
    <View
      style={{
        padding: 20,
        borderBottomColor: "#F6F6F8",
        borderBottomWidth: 5,
        height: 354,
      }}
    >
      <H1Text>{i18n.t("product_label.address")}</H1Text>
      <View
        style={{
          width: "100%",
          height: 180,
          borderRadius: 5,
        }}
      >
        <MapView
          style={styles.mapStyle}
          initialRegion={{
            latitude: latlon[props.product.id].lat,
            longitude: latlon[props.product.id].lon,
            latitudeDelta: 0.007,
            longitudeDelta: 0.007,
          }}
        >
          <Marker coordinate={markerCord} />
        </MapView>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <GText>{i18n.t("product_label.location")}</GText>
          <PText>{props.product.data.address}</PText>
        </View>
        <View>{videoButton(() => {})}</View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  mapStyle: {
    // width: Dimensions.get("window").width,
    // height: Dimensions.get("window").height,
    marginTop: 20,
    marginBottom: 10,
    height: 180,
    width: "100%",
    borderRadius: 5,
  },
});

const videoButton = (handler: () => void) => {
  return (
    <TouchableOpacity
      onPress={handler}
      style={{
        marginTop: 20,
        paddingTop: 12,
        flexDirection: "row",
        justifyContent: "center",
        alignContent: "center",
        width: "100%",
        height: 40,
        backgroundColor: "#F6F6F8",
        borderRadius: 5,
        borderWidth: 1,
        borderColor: "#D0D8DF",
      }}
    >
      <Text
        style={{
          fontSize: 14,
          color: "#1C1C1C",
        }}
      >
        {i18n.t("product_label.property_video") + " >"}
      </Text>
    </TouchableOpacity>
  );
};
