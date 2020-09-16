import React, { Component, FunctionComponent } from "react";
import { Modal as RNModal } from "react-native";
import styled from "styled-components/native";
import QuitButtonImg from "../../../src/shared/assets/images/quitbutton.png";

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
  width: 80%;
`;
const ModalButton = styled.TouchableHighlight`
  border-radius: 20px;
  padding: 10px;
  align-self: flex-end;
`;
const H1Text = styled.Text`
  color: #000;
  font-weight: bold;
  margin-bottom: 15px;
  text-align: center;
  margin-top: 60px;
`;
const PText = styled.Text`
  color: #626368;
  margin-bottom: 12px;
  font-size: 13px;
  text-align: center;
  margin-top: 20px;
`;
const QuitBtn = styled.Image`
  width: 13px;
  height: 13px;
`;

interface props {
  visible: boolean;
  child: any;
  modalHandler: () => void;
}

export const Modal: FunctionComponent<props> = (props) => {
  return (
    <CenteredView>
      <RNModal animationType="slide" transparent={true} visible={props.visible}>
        <CenteredView>
          <ModalView>
            <ModalBtnWrapper>
              <ModalButton onPress={props.modalHandler}>
                <QuitBtn source={QuitButtonImg} />
              </ModalButton>
              {props.child}
            </ModalBtnWrapper>
          </ModalView>
        </CenteredView>
      </RNModal>
    </CenteredView>
  );
};
