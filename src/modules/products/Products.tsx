import React, { Component, FunctionComponent, Props } from "react";
import { StyleSheet, Text, View, GestureResponderEvent } from "react-native";

import styled from "styled-components/native";
import i18n from "../../i18n/i18n";
import { createStackNavigator } from "@react-navigation/stack";
import { MainList } from "./MainList";
import { Filter } from "./Filter";

interface props {}

const Stack = createStackNavigator();

export enum page {
  MainList = "MainList",
  Filter = "Filter",
}

export const Products = () => {
  return (
    <Stack.Navigator initialRouteName={page.MainList} headerMode="none">
      <Stack.Screen name={page.MainList} component={MainList} />
      <Stack.Screen name={page.Filter} component={Filter} />
    </Stack.Navigator>
  );
};
