import React from "react";
import { Text } from "react-native";

import { storiesOf } from "@storybook/react-native";
import { action } from "@storybook/addon-actions";
import { linkTo } from "@storybook/addon-links";

import Button from "./Button/index.ios";
import CenterView from "./CenterView";
import Welcome from "./Welcome";
import { FlatButton } from "../../src/shared/components/FlatButton";
import { BackButton } from "../../src/shared/components/BackButton";
import { SubmitButton } from "../../src/shared/components/SubmitButton";

import { Account } from "../../src/modules/account/Account";
import { InitializeEmail } from "../../src/modules/account/InitializeEmail";
import { Login } from "../../src/modules/account/Login";
import { LockAccount } from "../../src/modules/account/LockAccount";
import { Signup } from "../../src/modules/account/Signup";

import { Modal } from "../../src/shared/components/Modal";

// storiesOf("Welcome", module).add("to Storybook", () => (
//   <Welcome showApp={linkTo("Button")} />
// ));

// storiesOf("Button", module)
//   .addDecorator((getStory) => <CenterView>{getStory()}</CenterView>)
//   .add("with text", () => (
//     <Button onPress={action("clicked-text")}>
//       <Text>Hello Button</Text>
//     </Button>
//   ))
//   .add("with some emoji", () => (
//     <Button onPress={action("clicked-emoji")}>
//       <Text>😀 😎 👍 💯</Text>
//     </Button>
//   ));

// Test Data
export const props = {
  title: "재전송",
};

// 이렇게 액션을 사용하면 함수를 직접 선언 하지 않아도 이벤트가 발생하였슬 때,
// 액션에 정의한 함수가 발생합니다.
export const handler = () => {};

// 스토리 추가
storiesOf("Button", module) // Storybook에 표시될 폴더명
  // 데코레이터를 이용하면 아래와 같이 테스트할 스토리의 래핑 컴포넌트를 작성할 수 있습니다.
  // add('스토리명', 스토리 랜더링)
  .add("flat", () => <FlatButton title={props.title} handler={handler} />)
  .add("back", () => <BackButton handler={handler} />)
  .add("submit", () => <SubmitButton handler={handler} title="계속" />);

storiesOf("Account", module)
  .add("Account", () => <Account />)
  .add("InitializeEmail", () => <InitializeEmail handler={() => {}} />)
  .add("Login", () => (
    <Login email="testemail" password="" handler={() => {}} />
  ))
  .add("LockAccount", () => <LockAccount handler={() => {}} />)
  .add("Signup", () => <Signup handler={() => {}} />);

storiesOf("Modal", module) // Storybook에 표시될 폴더명
  .add("default", () => <Modal visible={true} />);
