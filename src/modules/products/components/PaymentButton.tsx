import React, { FunctionComponent } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  GestureResponderEvent,
  Text,
} from "react-native";
import styled from "styled-components/native";

const PaymentBtn = styled.TouchableOpacity`
  width: 55px;
  padding: 11px;
  margin: 0 auto;
  height: 51px;
  background-color: #fff;
  border-radius: 5px;
  border: solid 1px #d0d8df;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-content: center;
`;
const CheckedPaymentBtn = styled.TouchableOpacity`
  width: 55px;
  padding: 11px;
  margin: 0 auto;
  height: 51px;
  background-color: #fff;
  border-radius: 5px;
  border: solid 1px #3679b5;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-content: center;
`;

interface props {
  check: boolean;
  child: any;
  checked_child: any;
  // handler: (event: GestureResponderEvent) => void;
  handler: any;
}

export const PaymentButton: FunctionComponent<props> = (props) => {
  if (props.check) {
    return (
      <CheckedPaymentBtn onPress={props.handler}>
        {props.checked_child}
      </CheckedPaymentBtn>
    );
  } else {
    return <PaymentBtn onPress={props.handler}>{props.child}</PaymentBtn>;
  }
};
