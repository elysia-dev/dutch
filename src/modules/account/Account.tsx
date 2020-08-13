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
  exist: string;
  email: string;
  //로그인 여부를 확인하는 역할도 수행 가능할 듯
  stage: string;
  verification_id: string;
}

export class Account extends Component<props, state> {
  constructor(props: props) {
    super(props);
    this.state = {
      exist: "",
      stage: "InitializeEmail",
      verification_id: "",
      email: "",
    };
    this.setUserEmail = this.setUserEmail.bind(this);
    this.login = this.login.bind(this);
    this.signup = this.signup.bind(this);
    this.certifyEmail = this.certifyEmail.bind(this);
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

  // initializeEmail = async () => {
  //   axios
  //     .get(`/auth?email=${this.state.email}`)
  //     .then((response) => {
  //       this.setState({
  //         stage: response.status == 200 ? "Login" : "CertifyEmail",
  //         verification_id: response.data.verification_id,
  //         exist: response.status == 200 ? "exist" : "new",
  //       });
  //     })
  //     .catch((e) => {
  //       // API 호출이 실패한 경우
  //       console.error(e); // 에러표시
  //     });
  // };

  initializeEmail = () => {
    console.log("run");
    this.setState({ stage: "Login" });
  };

  // login = async (input: string) => {
  //   axios
  //     .post(`/auth`, {
  //       email: this.state.email,
  //       password: input,
  //       //password 어떻게 받아올건지 처리해야함
  //     })
  //     .then((response) => {
  //       if (response.status == 200) {
  //         this.setState({ stage: "mainpage" });
  //         //mainpage만들어서 stage 연결하기!
  //       } else if (response.data.status == "locked") {
  //         this.setState({
  //           stage: "LockAccount",
  //           verification_id: response.data.verification_id,
  //         });
  //       }
  //     })
  //     .catch((e) => {
  //       // API 호출이 실패한 경우
  //       console.error(e); // 에러표시
  //     });
  // };

  login = () => {
    console.log("run");
    this.setState({ stage: "mainpage" });
  };

  // signup = async (input1: string, input2: string) => {
  //   if (input1 == input2) {
  //     axios
  //       .post(`/auth/users`, {
  //         verification_id: this.state.verification_id,
  //         password: input1,
  //         password_confirmation: input2,
  //       })
  //       .then((response) => {
  //         if (response.status == 200) {
  //           this.setState({ stage: "mainpage" });
  //           //mainpage 설정 해줘야 함
  //         } else if (response.data.type == "EXPIRED") {
  //           alert("");
  //           //오류 처리 어떻게?
  //         }
  //       })
  //       .catch((e) => {
  //         // API 호출이 실패한 경우
  //         console.error(e); // 에러표시
  //       });
  //   } else {
  //     alert("비밀번호가 일치하지 않습니다"); //나중에 css 수정할 수 있도록
  //   }
  // };

  signup = () => {
    this.setState({ stage: "mainpage" });
  };

  //코드가 맞는지 확인하는 함수
  // certifyEmail = async (input: string) => {
  //   axios
  //     .put(`/verification/:${this.state.verification_id}`, {
  //       code: input, //유저가 입력한 code
  //     })
  //     .then((response) => {
  //       if (response.status == 200) {
  //         this.state.verification_id == "새로운 유저냐?"
  //           ? //어떻게 확인할지? verifications_id가 정해진 규약이 있는 거라면 그대로 쓸 수 있겠다
  //             //input을 늘려서 현재 위치를 파악한 후 다음 위치를 정하기
  //             this.setState({ stage: "Signup" }) //새로운 유저인 경우 비밀번호 설정으로
  //           : this.setState({ stage: "ChangePassword" }); //기존 유저의 경우 비밀번호 찾기로
  //         //lock된 유저의 경우 어디로?
  //       } else {
  //         //오류 처리 expired, pending, used 어떻게 할 지?
  //       }
  //     })
  //     .catch((e) => {
  //       // API 호출이 실패한 경우
  //       console.error(e); // 에러표시
  //     });
  // };
  certifyEmail = () => {
    this.setState({ stage: "ChangePassword" });
  };

  //비밀번호 찾기 함수 -> 로그인에 같이 넘겨줘야 함, 이메일로 코드를 보내달라는 요청
  // certifyEmail_recoverPassword = async () => {
  //   axios
  //     .post(`/verification/?email=${this.state.email}&type=RecoverPassword`, {})
  //     .then((response) => {
  //       this.setState({
  //         stage: "CertifyEmail",
  //         verification_id: response.data.verification_id,
  //       });
  //     })
  //     .catch((e) => {
  //       // API 호출이 실패한 경우
  //       console.error(e); // 에러표시
  //     });
  // };

  certifyEmail_recoverPassword = () => {
    this.setState({
      stage: "CertifyEmail",
    });
  };

  //재발송용 버튼을 눌렀을 때 실행되게
  certifyEmail_recoverAccount = async () => {
    axios
      .post(`/verification/?email=${this.state.email}&type=RecoverAccount`, {})
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

  // recoverPassword = async (input1: string, input2: string) => {
  //   axios
  //     .post(`auth/recover`, {
  //       verification_id: this.state.verification_id,

  //       password: input1,
  //       password_confirmation: input2,
  //     })
  //     .then((response) => {
  //       if (response.status == 200) {
  //         this.setState({ stage: "Login" });
  //       }
  //     })
  //     .catch((e) => {
  //       // API 호출이 실패한 경우
  //       console.error(e); // 에러표시
  //     });
  // };

  recoverPassword = () => {
    this.setState({ stage: "Login" });
  };

  // resetPassword = async (input1: string, input2: string) => {
  //   axios
  //     .post(`auth/reset`, {
  //       verification_id: this.state.verification_id,

  //       password: input1,
  //       password_confirmation: input2,
  //     })
  //     .then((response) => {
  //       if (response.status == 200) {
  //         this.setState({ stage: "" });
  //         //설정페이지 로드 나중에
  //       }
  //     })
  //     .catch((e) => {
  //       // API 호출이 실패한 경우
  //       console.error(e); // 에러표시
  //     });
  // };
  resetPassword = () => {};

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
          />
          //비밀번호 찾을때도 포함
        )}
        {this.state.stage === "LockAccount" && (
          <LockAccount stageHandler={this.certifyEmail} />
          //인증되면 login state로 바꾸는 작업 수행해야 함 기억!!
        )}
        {this.state.stage === "RecoverPassword" && (
          <ChangePassword
            stageHandler={this.recoverPassword}
            email={this.state.email}
          />
        )}
        {/* 비밀번호 찾기와 변경은 같은 컴포넌트 로드하지만 넘겨주는 props가 다름 */}
        {this.state.stage === "ChangePassword" && (
          <ChangePassword
            stageHandler={this.resetPassword}
            email={this.state.email}
          />
        )}
        {this.state.stage === "mainpage" && (
          <View>
            <text>메인페이지가 있다고 생각합시다</text>
          </View>
        )}
      </View>
    );
  }

  styles = StyleSheet.create({});
}
