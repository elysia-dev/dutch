import axios, { AxiosResponse } from "axios";
axios.defaults.baseURL = "http://localhost:3000";

type InitializeResponse = {
  verificationId: string;
  status: string;
};

type NoResponse = {};

type SignupResponse = {
  token: string;
  status: string;
};
type LoginResponse = {
  token: string;
  status: string;
  counts: number;
  verificationId: string;
};

//코드 인증하는 함수의 reponse type
type CertifyResponse = {
  counts: number;
  status: string;
};

//verification 요청하는 함수의 response type
type VerificationResponse = {
  verificationId: string;
  status: string;
};

type RecoverResponse = {
  status: string;
};

export default class Api {
  static initializeEmail = async (
    email: string
  ): Promise<AxiosResponse<InitializeResponse>> => {
    return axios.get(`/auth?email=${email}`);
  };

  static login = async (
    email: string,
    password: string
  ): Promise<AxiosResponse<LoginResponse>> => {
    return axios.post("auth", { email: email, password: password });
  };

  //   .then((response) => {
  //     this.setState({
  //       stage: "mainpage",
  //       login: true,
  //       token: response.data.token,
  //     });
  //   })
  //   .catch((e) => {
  //     console.error(e); // 에러표시
  //     if (e.response) {
  //       console.log(e.response.data.counts);
  //       this.setState({
  //         login: false,
  //         error: e.response.data.counts,
  //         password: "",
  //       });
  //       if (e.response.data.status == "locked") {
  //         this.setState({
  //           stage: "LockAccount",
  //           verification_id: e.response.data.verification_id,
  //         });
  //       }
  //     }
  //   });

  static signup = async (
    verificationId: string,
    password: string
  ): Promise<AxiosResponse<SignupResponse>> => {
    return axios.post(`/users`, {
      verificationId: verificationId,
      password: password,
    });
  };

  //   //회원가입 인증 때 재발송 함수
  //   certifyEmail_signup = async (email: string, verification_id: string) => {
  //     axios
  //       .post(`/verifications?email=${email}`, {
  //         verification_id: verification_id,
  //       })
  //       .then((response) => {
  //         console.log(response);
  //       })
  //       .catch((e) => {
  //         console.log(e);
  //       });
  //   };

  //인증코드가 맞는지 확인하는 함수
  static certifyEmail = async (
    verificationId: string,
    code: string
  ): Promise<AxiosResponse<CertifyResponse>> => {
    return axios.put(`/verifications/${verificationId}`, {
      code: code, //유저가 입력한 code
    });
    //   .then((response) => {
    //     this.state.exist == "new"
    //       ? this.setState({ stage: "Signup" }) //새로운 유저인 경우 비밀번호 설정으로
    //       : this.setState({
    //           stage: "RecoverPassword",
    //           error: 0,
    //           certified: "",
    //         }); //기존 유저의 경우 비밀번호 찾기로
    //   })
    //   .catch((e) => {
    //     // API 호출이 실패한 경우
    //     console.error(e); // 에러표시
    //     if (e.response) {
    //       console.log(e.response);
    //       console.log(e.response.data.status);
    //       if (e.response.data.status === "pending") {
    //         this.setState({ certified: "pending" });
    //       }
    //     }
    //   });
  };

  //비밀번호 찾기 함수 -> 로그인에 같이 넘겨줘야 함, 이메일로 코드를 보내달라는 요청
  static certifyEmail_recover = async (
    email: string,
    recoverType: string
  ): Promise<AxiosResponse<VerificationResponse>> => {
    return axios.post(`/verifications`, {
      email: email,
      type: `Recover${recoverType}`,
    });
  };
  //   .then((response) => {
  //     console.log(response.data.verification_id);
  //     this.setState({
  //       stage: "CertifyEmail",
  //       verification_id: response.data.verification_id,
  //     });
  //   })
  //   .catch((e) => {
  //     if (e.response) {
  //       console.log(e.response);
  //     }
  //     // API 호출이 실패한 경우
  //     console.error(e); // 에러표시
  //   });

  //재발송용 버튼을 눌렀을 때 실행되게
  //   certifyEmail_recoverAccount = async () => {
  //     axios
  //       .post(`/verifications`, {
  //         email: this.state.email,
  //         type: "RecoverAccount",
  //       })
  //       .then((response) => {
  //         this.setState({
  //           stage: "LockAccount",
  //           verification_id: response.data.verification_id,
  //         });
  //       })
  //       .catch((e) => {
  //         // API 호출이 실패한 경우
  //         console.error(e); // 에러표시
  //       });
  //   };

  static recoverPassword = async (
    verificationId: string,
    password: string
  ): Promise<AxiosResponse<RecoverResponse>> => {
    return axios.post(`/auth/recover`, {
      verificationId: verificationId,
      password: password,
    });
  };
  //   .then((response) => {
  //     // this.setState({ stage: "Login" });
  //     console.log(response);
  //   })
  //   .catch((e) => {
  //     // API 호출이 실패한 경우
  //     console.error(e); // 에러표시
  //   });

  resetPassword = async (
    token: string,
    password: string,
    passwordConfirmation: string
  ): Promise<AxiosResponse<NoResponse>> => {
    return axios.put(
      `/users`,
      {
        password: password,
        passwordConfirmation: passwordConfirmation,
      },
      {
        headers: {
          Authorization: token,
        },
      }
    );
  };
}
//   .then((response) => {
//     if (response.status == 200) {
//       this.setState({ stage: "" });
//       //설정페이지 로드 나중에
//     }
//   })
//   .catch((e) => {
//     // API 호출이 실패한 경우
//     console.error(e); // 에러표시
//   });
