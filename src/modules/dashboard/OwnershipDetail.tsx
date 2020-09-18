import React, { FunctionComponent, useState, useContext } from "react";
import { View, ScrollView, Image, SafeAreaView, Platform } from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import styled from "styled-components/native";
import i18n from "../../i18n/i18n";
import { BackButton } from "../../shared/components/BackButton";
import Product from "../../types/product";
import UserContext from "../../contexts/UserContext";
import LocaleType from "../../enums/LocaleType";
import { HeaderHeightContext } from "@react-navigation/stack";

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
  background-color: #3679b5;
  padding-top: 25px;
`;

type ParamList = {
  OwnershipDetail: {};
};

const OwnershipDetail: FunctionComponent = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<ParamList, "OwnershipDetail">>();

  return (
    <ProductInfoWrapper>
      <View style={{ backgroundColor: "#FFF" }}>
        <ScrollView scrollEnabled={true} scrollToOverflowEnabled={true}>
          <View
            style={{
              width: "100%",
              height: 293,
            }}
          />
          <View
            style={{
              backgroundColor: "#3679B5",
              width: "100%",
              height: 243,
              borderBottomLeftRadius: 20,
              borderBottomRightRadius: 20,
              position: "absolute",
              top: 0,
              zIndex: -1,
            }}
          />

          <BackButton handler={() => navigation.goBack()}></BackButton>
        </ScrollView>
      </View>
    </ProductInfoWrapper>
  );
};

export default OwnershipDetail;
