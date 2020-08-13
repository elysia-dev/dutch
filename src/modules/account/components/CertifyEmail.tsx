import React, { FunctionComponent } from "react";
import { StyleSheet, Text, View } from "react-native";
import { TextInput } from "../../../shared/components/TextInput";
import { BackButton } from "../../../shared/components/BackButton";
import { SubmitButton } from "../../../shared/components/SubmitButton";
import { FlatButton } from "../../../shared/components/FlatButton";

interface props {
  email: string;
  stageHandler: (input: string) => void;
  // stageHandler: () => void;
  resendHandler: () => void;
  existence: string;
}
export const CertifyEmail: FunctionComponent<props> = (props) => {
  return (
    <View>
      <BackButton handler={goToBack} />
      <Text>
        {props.existence == "new"
          ? "메일을 인증해주세요."
          : "인증코드를 입력해주세요."}
      </Text>
      <Text>
        {props.existence == "new" ? "회원가입 진행을" : "비밀번호 찾기를"}
        위해 해당 메일로 인증코드를 보냈습니다. <br />
        메일 확인 후, 인증을 진행해주세요.
      </Text>
      <TextInput
        type="이메일"
        edit={false}
        value={props.email}
        eventHandler={() => {}}
        secure={false}
      />
      <TextInput
        type="인증코드"
        edit={true}
        value={""}
        eventHandler={() => {}}
        secure={true}
      />
      <Text>유효시간 {}</Text>
      <FlatButton title="재요청" handler={props.resendHandler} />
      <SubmitButton title="인증하기" handler={props.stageHandler} />
    </View>
  );
};

const goToBack = () => {};
// bind issue 없나?  보내줄 일이 없어서 ㄱㅊ
// 메서드가 다른 컴포넌트에서 사용되는 것이 아니라 이 certifyemail 컴포넌트가 호출되었을 때 사용되기 때문에
// 제대로 불러올 수 있는 것으로 ..!
