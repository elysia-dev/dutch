import React, { FunctionComponent, useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput as RNTextInput,
  NativeSyntheticEvent,
  TextInputChangeEventData,
} from "react-native";
import styled from "styled-components/native";

interface props {
  type: string;
  value: string;
  edit: boolean;
  eventHandler: (text: string) => void;
  secure: boolean;
  autoFocus?: boolean;
}
const InputHeaderText = styled.Text`
  color: #a7a7a7;
  margin: 5px 20px;
  font-size: 12px;
  text-align: left;
`;
const InputTextForm = styled.TextInput`
  width: 90%;
  margin: 8px auto;
  height: 25px;
  border-bottom-width: 1px;
`;
export const TextInput: FunctionComponent<props> = (
  props,
  { onFocused = false, autocapitalize = "none" }
) => {
  let textInputReference = useRef(null);
  const [focusing, setFocus] = useState(onFocused);

  return (
    <View>
      <InputHeaderText
        style={{
          color: focusing == true ? "#2C6190" : "#A7A7A7",
        }}
      >
        {props.type}
      </InputHeaderText>
      <InputTextForm
        style={{
          borderBottomColor: focusing == true ? "#2C6190" : "#A7A7A7",
        }}
        defaultValue={props.value}
        editable={props.edit}
        onChangeText={(text) => props.eventHandler(text)}
        enablesReturnKeyAutomatically={true}
        secureTextEntry={props.secure}
        maxLength={30}
        autoCapitalize={autocapitalize}
        // minLength={8}
        onChange={() => setFocus(true)}
        onBlur={() => setFocus(false)}
      />
    </View>
  );
};

// export class TextInput extends Component {
//   constructor(props: any) {
//     super(props);
//     this.state = { input: "" };
//   }

//   render() {
//     return (
//       <View>
//         <Text>{this.props.type}</Text>
//         <RNTextInput
//           value={this.props.value}
//           onChangeText={(text) => this.setState({ input: text })}
//           editable={true}
//           enablesReturnKeyAutomatically={true}
//         >
//           {" "}
//         </RNTextInput>
//         <Text>Optinal Message 채워넣기</Text>
//       </View>
//     );
//   }
// }

const styles = StyleSheet.create({});
