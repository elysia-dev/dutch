import { StatusBar } from "expo-status-bar";
import React, { FunctionComponent } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  GestureResponderEvent,
} from "react-native";
import { TextInput } from "../../shared/components/TextInput";
import { SubmitButton } from "../../shared/components/SubmitButton";

export const LockAccount: FunctionComponent<{
  // handler: (event: GestureResponderEvent) => void;
  handler: (stage: number) => void;
}> = ({ handler }) => {
  return (
    <View>
      <Image source={require("./images/lockaccount.png")} />
      <Text>엘리시아 계정이 잠겼습니다!</Text>
      <Text>
        고객님의 계정이 로그인 시도 5회 실패로 인해 보호조치 되었습니다.
        고객님의 계정 이메일 주소로 전송된 인증코드를 입력바랍니다.
      </Text>
      <TextInput
        type="인증코드"
        value=""
        edit={false}
        eventHandler={() => {}}
        secure={false}
      />
      <SubmitButton title="인증하기" handler={handler} nextStage={7} />
    </View>
  );
};

const styles = StyleSheet.create({});
