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
  }

  setUserPassword(text: string) {
    this.setState({ password: text });
  }

  setStage(text: string) {
    this.setState({ stage: text });
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
          this.setState({
            login: false,
            error: e.response.data.counts,
            password: "",
          });
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
          : this.setState({
              stage: "RecoverPassword",
              error: 0,
              certified: "",
            }); //기존 유저의 경우 비밀번호 찾기로
      })
      .catch((e) => {
        // API 호출이 실패한 경우
        console.error(e); // 에러표시
        if (e.response) {
          console.log(e.response);
          console.log(e.response.data.status);
          if (e.response.data.status === "pending") {
            this.setState({ certified: "pending" });
          }
        }
      });
  };

  //비밀번호 찾기 함수 -> 로그인에 같이 넘겨줘야 함, 이메일로 코드를 보내달라는 요청
  certifyEmail_recoverPassword = async () => {
    axios
      .post(`http://localhost:3000/verifications`, {
        email: this.state.email,
        type: "RecoverPassword",
      })
      .then((response) => {
        console.log(response.data.verification_id);
        this.setState({
          stage: "CertifyEmail",
          verification_id: response.data.verification_id,
        });
      })
      .catch((e) => {
        if (e.response) {
          console.log(e.response);
        }
        // API 호출이 실패한 경우
        console.error(e); // 에러표시
      });
  };

  //재발송용 버튼을 눌렀을 때 실행되게
  certifyEmail_recoverAccount = async () => {
    axios
      .post(`http://localhost:3000/verifications`, {
        email: this.state.email,
        type: "RecoverAccount",
      })
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
        // this.setState({ stage: "Login" });
        console.log(response);
      })
      .catch((e) => {
        // API 호출이 실패한 경우
        console.error(e); // 에러표시
      });
  };

  resetPassword = async (input1: string, input2: string) => {
    axios
      .put(
        `http://localhost:3000/users`,
        {
          password: input1,
          password_confirmation: input2,
        },
        {
          headers: {
            Authorization: this.state.token,
          },
        }
      )
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
            certified={this.state.certified}
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
            password={this.state.password}
            stageHandler={this.login}
            passwordHandler={this.setUserPassword}
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
            passwordHandler={this.recoverPassword}
            stageHandler={this.setStage}
            email={this.state.email}
            login={this.state.login}
          />
        )}
        {/* 비밀번호 찾기와 변경은 같은 컴포넌트 로드하지만 넘겨주는 props가 다름 */}
        {this.state.stage === "ChangePassword" && (
          <ChangePassword
            passwordHandler={this.resetPassword}
            stageHandler={this.setStage}
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
