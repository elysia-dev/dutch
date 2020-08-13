import React, { FunctionComponent } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput as RNTextInput,
  NativeSyntheticEvent,
  TextInputChangeEventData,
} from "react-native";
import styled from 'styled-components/native';

interface props {
  type: string;
  value: string;
  edit: boolean;
  eventHandler: (text: string) => void;
  secure: boolean;
}

const InputHeaderText = styled.Text`
  color: #A7A7A7;
  margin: 5px 20px;
  font-size: 12px;
  text-align: left;
`;
const InputTextForm = styled.TextInput`
  width: 90%;
  margin: 8px auto;
  height: 25px;
  border-bottom-width: 1px;
  border-bottom-color: #A7A7A7;
`;

export const TextInput: FunctionComponent<props> = (props) => {
  return (
    <View>
      <InputHeaderText>{props.type}</InputHeaderText>
      <InputTextForm
        defaultValue={props.value}
        editable={props.edit}
        onChangeText={(text) => props.eventHandler(text)}
        enablesReturnKeyAutomatically={true}
        secureTextEntry={props.secure}
      />

      <Text>Optinal Message 채워넣기</Text>
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
