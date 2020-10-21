import React, { Component, FunctionComponent } from 'react';
import { Modal as RNModal, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import QuitButtonImg from '../assets/images/quitbutton.png';

const CenteredView = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;
const ModalView = styled.View`
  background-color: #fff;
  border-radius: 20px;
  align-items: center;
  box-shadow: 0px 2px 2px #000;
  elevation: 10;
  width: 90%;
`;
const ModalBtnWrapper = styled.View`
  padding: 10px 20px 20px 20px;
`;
const ModalButton = styled.TouchableOpacity`
  border-radius: 20px;
  padding: 20px 20px 0px 0px;
  align-self: flex-end;
`;
const QuitBtn = styled.Image`
  width: 13px;
  height: 13px;
`;

interface Props {
  visible: boolean;
  child: React.ReactNode;
  modalHandler: () => void;
}

export const Modal: FunctionComponent<Props> = (props: Props) => {
  return (
    <CenteredView>
      <RNModal animationType="slide" transparent={true} visible={props.visible}>
        <CenteredView>
          <ModalView>
              <ModalButton onPress={props.modalHandler}>
                <QuitBtn source={QuitButtonImg} />
              </ModalButton>
            <ModalBtnWrapper>
              {props.child}
            </ModalBtnWrapper>
          </ModalView>
        </CenteredView>
      </RNModal>
    </CenteredView>
  );
};
