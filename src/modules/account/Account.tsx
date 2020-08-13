import { StatusBar } from "expo-status-bar";
import axios from "axios";
import React, { Component } from "react";
import { StyleSheet, View } from "react-native";
import { InitializeEmail } from "./InitializeEmail";
import { Signup } from "./Signup";
import { Login } from "./Login";
import { LockAccount } from "./LockAccount";
import { ChangePassword } from "./ChangePassword";
import { CertifyEmail } from "./components/CertifyEmail";

interface props {}

interface state {
  login: boolean;
  exist: string;
  email: string;
  stage: string;
  verification_id: string;
  error: number;
  token: string;
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
      error: 0,
      token: "",
    };
    this.setUserEmail = this.setUserEmail.bind(this);
    this.login = this.login.bind(this);
    this.signup = this.signup.bind(this);
    this.certifyEmail = this.certifyEmail.bind(this);
    this.certifyEmail_signup = this.certifyEmail_signup.bind(this);
    this.certifyEmail_recoverAccount = this.certifyEmail_recoverAccount.bind(
      this
    );
    this.certifyEmail_recoverPassword = this.certifyEmail_recoverPassword.bind(
      this
    );
    this.recoverPassword = this.recoverPassword.bind(this);
    this.resetPassword = this.resetPassword.bind(this);
  }

  setUserEmail(text: string) {
    this.setState({ email: text });
    console.log(this.state.email);
  }

  initializeEmail = async () => {
    axios
      .get(`http://localhost:3000/auth?email=${this.state.email}`)
      .then((response) => {
        console.log(response);
        this.setState({
          stage: "Login",
          exist: "exist",
        });
      })
      .catch((e) => {
        // API 호출이 실패한 경우
        console.error(e); // 에러표시
        if (e.response) {
          this.setState({
            stage: "CertifyEmail",
            exist: "new",
            verification_id: e.response.data.verification_id,
          });
        }
      });
  };

  login = async (input: string) => {
    axios
      .post(`http://localhost:3000/auth`, {
        email: this.state.email,
        password: input,
      })
      .then((response) => {
        this.setState({
          stage: "mainpage",
          login: true,
          token: response.data.token,
        });
      })
      .catch((e) => {
        console.error(e); // 에러표시
        if (e.response) {
          console.log(e.response.data.counts);
          this.setState({ login: false, error: e.response.data.counts });
          if (e.response.data.status == "locked") {
            this.setState({
              stage: "LockAccount",
              verification_id: e.response.data.verification_id,
            });
          }
        }
      });
  };

  signup = async (input1: string, input2: string) => {
    axios
      .post(`http://localhost:3000/users`, {
        verification_id: this.state.verification_id,
        password: input1,
        password_confirmation: input2,
      })
      .then((response) => {
        this.setState({
          exist: "exist",
          stage: "mainpage",
          token: response.data.token,
        });
        //mainpage 설정 해줘야 함
      })
      .catch((e) => {
        // API 호출이 실패한 경우
        console.error(e); // 에러표시
        if (e.response) {
          console.log(e.response.data.type);
        }
      });
  };

  //회원가입 인증 때 재발송 함수
  certifyEmail_signup = async () => {
    axios
      .post(`http://localhost:3000/verifications?email=${this.state.email}`, {
        verification_id: this.state.verification_id,
      })
      .then((response) => {
        console.log(response);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  //코드가 맞는지 확인하는 함수
  certifyEmail = async (input: string) => {
    axios
      .put(
        `http://localhost:3000/verifications/${this.state.verification_id}`,
        {
          code: input, //유저가 입력한 code
        }
      )
      .then((response) => {
        this.state.exist == "new"
          ? this.setState({ stage: "Signup" }) //새로운 유저인 경우 비밀번호 설정으로
          : this.setState({ stage: "RecoverPassword", error: 0, lock }); //기존 유저의 경우 비밀번호 찾기로
      })
      .catch((e) => {
        // API 호출이 실패한 경우
        console.error(e); // 에러표시
        if (e.response) {
          console.log(e.response.data.status);
        }
      });
  };

  //비밀번호 찾기 함수 -> 로그인에 같이 넘겨줘야 함, 이메일로 코드를 보내달라는 요청
  certifyEmail_recoverPassword = async () => {
    axios
      .post(
        `http://localhost:3000/verifications/?email=${this.state.email}&type=RecoverPassword`,
        { verification_id: this.state.verification_id }
      )
      .then((response) => {
        this.setState({
          stage: "CertifyEmail",
          verification_id: response.data.verification_id,
        });
      })
      .catch((e) => {
        // API 호출이 실패한 경우
        console.error(e); // 에러표시
      });
  };

  //재발송용 버튼을 눌렀을 때 실행되게
  certifyEmail_recoverAccount = async () => {
    axios
      .post(
        `http://localhost:3000/verifications/?email=${this.state.email}&type=RecoverAccount`,
        { verification_id: this.state.verification_id }
      )
      .then((response) => {
        this.setState({
          stage: "LockAccount",

          verification_id: response.data.verification_id,
        });
      })
      .catch((e) => {
        // API 호출이 실패한 경우
        console.error(e); // 에러표시
      });
  };

  recoverPassword = async (input1: string, input2: string) => {
    axios
      .post(`http://localhost:3000/auth/recover`, {
        verification_id: this.state.verification_id,

        password: input1,
        password_confirmation: input2,
      })
      .then((response) => {
        this.setState({ stage: "Login" });
      })
      .catch((e) => {
        // API 호출이 실패한 경우
        console.error(e); // 에러표시
      });
  };

  // recoverPassword = () => {
  //   this.setState({ stage: "Login" });
  // };

  resetPassword = async (input1: string, input2: string) => {
    axios
      .put(`http://localhost:3000/users`, {
        password: input1,
        password_confirmation: input2,
      })
      .then((response) => {
        if (response.status == 200) {
          this.setState({ stage: "" });
          //설정페이지 로드 나중에
        }
      })
      .catch((e) => {
        // API 호출이 실패한 경우
        console.error(e); // 에러표시
      });
  };
  // resetPassword = () => {};

  render() {
    return (
      <View>
        {this.state.stage === "InitializeEmail" && (
          <InitializeEmail
            stageHandler={this.initializeEmail}
            handler={this.setUserEmail}
            email={""}
          />
        )}
        {this.state.stage === "CertifyEmail" && (
          <CertifyEmail
            email={this.state.email}
            stageHandler={this.certifyEmail}
            existence={this.state.exist}
            resendHandler={
              this.state.exist == "new"
                ? this.certifyEmail_signup
                : this.certifyEmail_recoverPassword
            }
          />
        )}
        {this.state.stage === "Signup" && (
          <Signup email={this.state.email} stageHandler={this.signup} />
        )}
        {this.state.stage === "Login" && (
          <Login
            email={this.state.email}
            stageHandler={this.login}
            findPassword={this.certifyEmail_recoverPassword}
            error={this.state.error}
          />
        )}
        {this.state.stage === "LockAccount" && (
          <LockAccount
            stageHandler={this.certifyEmail}
            resendHandler={this.certifyEmail_recoverAccount}
          />

          //인증되면 login state로 바꾸는 작업 수행해야 함 기억!!
        )}
        {this.state.stage === "RecoverPassword" && (
          <ChangePassword
            stageHandler={this.recoverPassword}
            email={this.state.email}
            login={this.state.login}
          />
        )}
        {/* 비밀번호 찾기와 변경은 같은 컴포넌트 로드하지만 넘겨주는 props가 다름 */}
        {this.state.stage === "ChangePassword" && (
          <ChangePassword
            stageHandler={this.resetPassword}
            email={this.state.email}
            login={this.state.login}
          />
        )}
        {this.state.stage === "mainpage" && (
          <View>{/* <Text>메인페이지가 있다고 생각합시다</Text> */}</View>
        )}
      </View>
    );
  }

  styles = StyleSheet.create({});
}
