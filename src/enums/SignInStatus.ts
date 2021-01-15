export enum SignInStatus {
  PENDING = 'pending',
  SIGNIN = 'signin',
  SIGNOUT = 'signout', // 유저가 계정 로그아웃
  DELETE = 'delete', // 계정 삭제
  EXPIRED = 'expired', // token 시간 만료
}

export type SignOut = SignInStatus.SIGNOUT | SignInStatus.DELETE | SignInStatus.EXPIRED

export default SignInStatus