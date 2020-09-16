import React, { FunctionComponent, useState } from "react";
import { SafeAreaView, View, Text, TextInput } from "react-native";
import styled from "styled-components/native";

import i18n from "../../../i18n/i18n";

interface props {
  eventHandler: (input: string) => void;
}

export const TextArea: FunctionComponent<props> = (props) => {
  const [state, setState] = useState({
    focus: false,
  });

  return (
    <View>
      <Text
        style={{
          color: state.focus ? "#2C6190" : "#A7A7A7",
          fontSize: 12,
          textAlign: "left",
          marginBottom: 10,
        }}
      >
        {i18n.t("info_label.contact_contents")}
      </Text>
      <TextInput
        onChangeText={props.eventHandler}
        maxLength={100}
        style={{
          borderColor: state.focus ? "#2C6190" : "#00000040",
          borderRadius: 10,
          borderWidth: 1,
          width: "100%",
          height: 90,
          fontSize: 14,
          padding: 10,
        }}
        textAlignVertical={"top"}
        multiline={true}
        onFocus={() => setState({ focus: true })}
        onBlur={() => setState({ focus: false })}
      ></TextInput>
    </View>
  );
};
