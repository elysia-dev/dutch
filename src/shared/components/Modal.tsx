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
import styled from 'styled-components/native';
import QuitButtonImg from '../../../src/shared/assets/images/quitbutton.png';

interface props {
  visible: boolean;
}

interface state {
  modalVisible: boolean;
}

const CenteredView = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  margin-top: 22px;
`;
const ModalView = styled.View`
  margin: 20px;
  background-color: #fff;
  border-radius: 20px;
  padding: 35px;
  align-items: center;
  box-shadow: 0px 2px 2px #000;
`;
const ModalBtnWrapper = styled.View`
  width: 180px;
  display: table-cell;
`;
const ModalButton = styled.TouchableHighlight`
  border-radius: 20px;
  padding: 10px;
  float: right;
`;
const H1Text = styled.Text`
  color: #000;
  font-weight: bold;
  margin-bottom: 15px;
  text-align: center;
  margin-top: 60px;
  display: block;
`;
const PText = styled.Text`
  color: #626368;
  margin-bottom: 12px;
  font-size: 13px;
  text-align: center;
  margin-top: 20px;
  display: inline-block;
`;
const QuitBtn = styled.Image`
  width: 13px;
  height: 13px;
`;

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
      <CenteredView>
        <RNModal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
          }}
        >
          <CenteredView>
            <ModalView>
              <ModalBtnWrapper>
                <ModalButton
                  onPress={() => {
                    this.setModalVisible(!modalVisible);
                  }}
                >
                  <QuitBtn source={QuitButtonImg} />
                </ModalButton>
                <H1Text>비밀번호가 틀렸습니다</H1Text>
                <PText>5회 실패시 계정이 잠금되는데{"\n"}왜 그러셨어요</PText>
              </ModalBtnWrapper>
            </ModalView>
          </CenteredView>
        </RNModal>
      </CenteredView>
    );
  }
}

  // const styles = StyleSheet.create({
  //   centeredView: {
  //     flex: 1,
  //     justifyContent: "center",
  //     alignItems: "center",
  //     marginTop: 22,
  //   },
  //   modalView: {
  //     margin: 20,
  //     backgroundColor: "white",
  //     borderRadius: 20,
  //     padding: 35,
  //     alignItems: "center",
  //     shadowColor: "#000",
  //     shadowOffset: {
  //       width: 0,
  //       height: 2,
  //     },
  //     shadowOpacity: 0.25,
  //     shadowRadius: 3.84,
  //     elevation: 5,
  //   },
  //   textStyle: {
  //     color: "white",
  //     fontWeight: "bold",
  //     textAlign: "center",
  //   },
  //   modalText: {
  //     marginBottom: 15,
  //     textAlign: "center",
  //   },
  //   modalButton: {
  //     borderRadius: 20,
  //     padding: 10,
  //     elevation: 2,
  //   },
  // });

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
