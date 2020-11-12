# dutch
Elysia mobile app

## Requirements
google-services.json 파일을 요청해서 받은 뒤 root에 복사합니다.

## Getting started
1. `yarn`을 실행해서 의존성 패키지들을 설치합니다.
2. 모바일에 Expo app을 설치하고, `expo start` 후 나오는 qr코드로 앱에 접근합니다.

## How to depoly
### 1. 심사를 받아야 하는 경우
1. 마이너 버전을 1 올려서 새로운 버전을 정의합니다. ex) 1.0.2 -> 1.1.0
2. 새로 정의한 버전 값을 `src/utils/getEnvironments.ts`에 기록합니다.
3. `package.json`에서 publish, build 옵션에 버전명을 변경합니다. 
4. 배포환경에 따라 `build:환경:OS`를 입력해서 각 마켓에 올릴 수 있는 빌드파일을 생성합니다. `ex) yarn build:prod:ios`
5. production 배포의 경우 심사를 요청하고, staging은 android는 apk 파일을 바로 사용하고 ios는 testflight를 이용해서 테스트합니다.

### 2. 그 외
1. 패치 버전을 1 올려서 새로운 버전을 정의합니다. ex) 1.0.2 -> 1.0.3
2. 새로 정의한 버전 값을 `src/utils/getEnvironments.ts`에 기록합니다.
3. 배포 환경에 따라 `expo publish:prod` 또는 `expo publish:stag`을 입력해서 배포합니다. 
