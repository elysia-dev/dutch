import React, { Component } from "react";
import {
  Alert,
  Modal as RNModal,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  Image,
} from "react-native";

interface props {
  visible: boolean;
}

interface state {
  modalVisible: boolean;
}

export class Modal extends Component<props, state> {
  constructor(props: props) {
    super(props);
    this.state = { modalVisible: this.props.visible };
  }

  setModalVisible = (visible: boolean) => {
    this.setState({ modalVisible: visible });
  };

  render() {
    const { modalVisible } = this.state;
    return (
      <View style={styles.centeredView}>
        <RNModal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <TouchableHighlight
                style={styles.modalButton}
                onPress={() => {
                  this.setModalVisible(!modalVisible);
                }}
              >
                <Image source={require("../assets/images/quitbutton.png")} />
              </TouchableHighlight>
              <Text style={styles.modalText}>Hello World!</Text>
            </View>
          </View>
        </RNModal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  modalButton: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
});

// export const Modal: FunctionComponent<props> = (props) => {
//   return (
//     <View style={styles.modalView}>
//       <RNModal
//         animationType="fade"
//         visible={props.modalVisible}
//         transparent={true}
//         onRequestClose={() => {
//           Alert.alert("Modal has been closed.");
//         }}
//       >
//         <TouchableOpacity
//           onPress={() => {
//             setModalVisible(!props.modalVisible);
//           }}
//         >
//           <Image source={require("../assets/images/quitbutton.png")} />
//         </TouchableOpacity>
//       </RNModal>
//     </View>
//   );
// };
