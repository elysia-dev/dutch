import React, { FunctionComponent, useState } from "react";
import { Text, View } from "react-native";
import { TextInput } from "../../shared/components/TextInput";
import { BackButton } from "../../shared/components/BackButton";
import { SubmitButton } from "../../shared/components/SubmitButton";
import { Modal } from "../../shared/components/Modal";
import AcceptedImg from "./images/accepted.png";
import styled from "styled-components/native";
import { useNavigation } from "@react-navigation/native";
import AccountLayout from "../../shared/components/AccountLayout";

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
const Accepted = styled.Image`
  width: 64px;
  height: 60px;
`;

interface props {
  email: string;
  passwordHandler: (input1: string, input2: string) => void;
  stageHandler: (text: string) => void;
  login: boolean;
}

const ChangePassword: FunctionComponent<props> = (props) => {
  const [state, setState] = useState({
    step: 1,
    input1: "",
    input2: "",
    modalVisible: false,
  });

  const navigation = useNavigation();

  return (
    <View>
      <AccountLayout
        title={
          <>
            <BackButton handler={navigation.goBack} />
            {props.login === true && (
              <View>
                <Text>비밀번호 변경</Text>
                <Text>
                  {state.step == 1 ? "비밀번호를" : "다시한번"} 입력해주세요.
            </Text>
              </View>
            )}
            {props.login === false && (
              <Text>
                {state.step == 1
                  ? "비밀번호 변경을 진행해주세요."
                  : "다시한번 입력해주세요."}
              </Text>
            )}
          </>
        }
        body={
          <>
            {state.step == 2 && (
              <TextInput
                type="비밀번호 확인하기"
                edit={true}
                eventHandler={(value) => setState({ ...state, input2: value })}
                value={""}
                secure={true}
              //input1, input2 비교
              />
            )}
            <TextInput
              type="비밀번호"
              edit={state.step == 1 ? true : false}
              eventHandler={(value) => setState({ ...state, input1: value })}
              value={""}
              secure={true}
            />
            <TextInput
              type="이메일"
              edit={false}
              eventHandler={() => { }}
              value={props.email}
              secure={false}
            />
          </>
        }
        button={
          state.step == 1 ? (
            <SubmitButton title="계속" handler={() => setState({ ...state, step: 2 })} />
          ) : (
              <SubmitButton
                title="변경하기"
                handler={() => {
                  setState({ ...state, modalVisible: true })
                  props.passwordHandler(state.input1, state.input2);
                }}
              />
            )
        }
      />
      {state.modalVisible === true && (
        <Modal
          child={
            <View>
              <Accepted source={AcceptedImg} />
              <H1Text>비밀번호가 변경되었습니다</H1Text>
              <PText>변경된 비밀번호로 로그인해주세요.</PText>
            </View>
          }
          modalHandler={() => props.stageHandler("Login")}
          visible={state.modalVisible}
        ></Modal>
      )}
    </View>
  );
}

export default ChangePassword;
