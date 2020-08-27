import { StatusBar } from "expo-status-bar";
import React, { Component } from "react";
import { StyleSheet, View } from "react-native";
import { InitializeEmail } from "./InitializeEmail";
import { Signup } from "./Signup";
import { Login } from "./Login";
import { LockAccount } from "./LockAccount";
import { ChangePassword } from "./ChangePassword";
import { CertifyEmail } from "./components/CertifyEmail";
import { createStackNavigator } from "@react-navigation/stack";
import { AccountPage } from "../../enums/pageEnum";

interface props { }

interface state {
  login: boolean; //로그인 여부 판별
  exist: string; //기존 유저와 새로운 유저 구분 (로그인과 다름)
  email: string; //유저가 입력한 이메일을 저장하여 여러 컴포넌트로 넘겨줌
  password: string; //유저가 로그인하면 비밀번호를 저장하고 비밀번호 변경 시에 보내줌
  stage: string; //화면 이동
  verification_id: string; //서버가 보내준 verifications_id를 저장했다가 새로운 리퀘스트를 보낼 때 사용
  error: number; //로그인 시도 횟수
  token: string; //로그인 후 서버에서 보낸 토큰을 저장하고 이후에 헤더로 넣어 리퀘스트 보낼 때 사용
  certified: string; //인증코드 인증 성공여부 -> 인증 실패의 경우 certifyEmail에서 경고 띄워야 함
  //boolean으로 설정하면 처음부터 성공했는지, 실패했는지 여부가 전달되기 때문에 빈 스트링으로 초기화하는 게 좋을 듯
}

export class Account extends Component<props, state> {
  constructor(props: props) {
    super(props);
    this.state = {
      login: false,
      exist: "",
      stage: "InitializeEmail",
      verification_id: "",
      email: "",
      password: "",
      error: 0,
      token: "",
      certified: "",
    };
    this.setUserEmail = this.setUserEmail.bind(this);
    this.setUserPassword = this.setUserPassword.bind(this);
    this.setStage = this.setStage.bind(this);
  }

  setUserEmail(text: string) {
    this.setState({ email: text });
  }

  setUserPassword(text: string) {
    this.setState({ password: text });
  }

  setStage(text: string) {
    this.setState({ stage: text });
  }
  setVerif(text: string) {
    this.setState({ verification_id: text });
  }

  render() {
    return (
      <Stack.Navigator
        initialRouteName={AccountPage.InitializeEmail}
        headerMode="none"
      >
        <Stack.Screen
          name={AccountPage.InitializeEmail}
          component={InitializeEmail}
        />
        <Stack.Screen
          name={AccountPage.Signup}
          component={Signup}
          options={{
            gestureEnabled: false,
          }}
        />
        <Stack.Screen name={AccountPage.Login} component={Login} />
        <Stack.Screen name={AccountPage.LockAccount} component={LockAccount} />
        <Stack.Screen
          name={AccountPage.ChangePassword}
          component={ChangePassword}
        />
        <Stack.Screen
          name={AccountPage.CertifyEmail}
          component={CertifyEmail}
        />
      </Stack.Navigator>
    );
  }

  styles = StyleSheet.create({});
}

const Stack = createStackNavigator();
