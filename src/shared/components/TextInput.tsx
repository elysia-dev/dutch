import React, { FunctionComponent } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput as RNTextInput,
  NativeSyntheticEvent,
  TextInputChangeEventData,
} from "react-native";

interface props {
  type: string;
  value: string;
  edit: boolean;
  eventHandler: (text: string) => void;
  secure: boolean;
}

export const TextInput: FunctionComponent<props> = (props) => {
  return (
    <View>
      <Text>{props.type}</Text>
      <RNTextInput
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
