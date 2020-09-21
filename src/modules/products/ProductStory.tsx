import React, { FunctionComponent, useState, useContext } from "react";
import { View, ScrollView, Image, SafeAreaView, Platform } from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import styled from "styled-components/native";
import { HeaderHeightContext } from "@react-navigation/stack";
import i18n from "../../i18n/i18n";
import { BackButton } from "../../shared/components/BackButton";
import { Calculator } from "./components/Calculator";
import WrappedInfo from "./components/WrappedInfo";
import Product, { Story } from "../../types/product";
import UserContext from "../../contexts/UserContext";
import LocaleType from "../../enums/LocaleType";
import { Map } from "./components/Map";

const WH1Text = styled.Text`
  margin-top: 30px;
  color: #fff;
  font-size: 20px;
  text-align: left;
`;
const H1Text = styled.Text`
  color: #1c1c1c;
  font-size: 20px;
  text-align: left;
  z-index: 3;
`;
const WText = styled.Text`
  margin-top: 30px;
  color: #fff;
  font-size: 14px;
  line-height: 30px;
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
const DesView = styled.View`
  margin-top: 18px;
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
`;
const Method = styled.Image`
  width: 16px;
  height: 16px;
  margin-left: 14px;
`;
const ProductInfoWrapper = styled.SafeAreaView`
  background-color: #fff;
  padding-top: 25px;
`;

type ParamList = {
  Story: {
    product: Story;
  };
};

const ProductStory: FunctionComponent = () => {
  const [state, setState] = useState({});

  const navigation = useNavigation();
  const route = useRoute<RouteProp<ParamList, "Story">>();
  const { product } = route.params;

  return (
    <ProductInfoWrapper>
      <View
        style={{
          backgroundColor: "#FFF",
          height: "100%",
          width: "100%",
        }}
      >
        <ScrollView
          scrollEnabled={true}
          scrollToOverflowEnabled={true}
          style={{ height: "100%" }}
        >
          <View
            style={{
              top: 0,
              width: "100%",
              height: 382,
            }}
          >
            <Image
              source={{ uri: product.images }}
              style={{
                position: "absolute",
                top: 0,
                width: "100%",
                height: "100%",
                resizeMode: "cover",
              }}
            />
            <View style={{ position: "absolute", padding: 20 }}>
              <BackButton handler={() => navigation.goBack()}></BackButton>
            </View>
          </View>
          <View>{route.params.product.body}</View>
        </ScrollView>
      </View>
    </ProductInfoWrapper>
  );
};

export default ProductStory;
