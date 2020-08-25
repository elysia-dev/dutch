import React from "react";

import { storiesOf } from "@storybook/react-native";
import { FlatButton } from "../../src/shared/components/FlatButton";
import { BackButton } from "../../src/shared/components/BackButton";
import { SubmitButton } from "../../src/shared/components/SubmitButton";

import { Account } from "../../src/modules/account/Account";
import { InitializeEmail } from "../../src/modules/account/InitializeEmail";
import { Login } from "../../src/modules/account/Login";
import { LockAccount } from "../../src/modules/account/LockAccount";
import { Signup } from "../../src/modules/account/Signup";
import { Modal } from "../../src/shared/components/Modal";

import { ConfirmSelfie } from "../../src/modules/kyc/ConfirmSelfie";
import { PersonalDataInput } from "../../src/modules/kyc/PersonalDataInput";
import { SelectID } from "../../src/modules/kyc/SelectID";
import { StartKYC } from "../../src/modules/kyc/StartKYC";
import { TakeID } from "../../src/modules/kyc/TakeID";
import { TakeSelfie } from "../../src/modules/kyc/TakeSelfie";
import { TakeSelfieBefore } from "../../src/modules/kyc/TakeSelfieBefore";

// Test Data
export const props = {
  title: "재전송",
};

export const handler = () => {};

storiesOf("Button", module)
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

storiesOf("Modal", module).add("default", () => <Modal visible={true} />);

storiesOf("Kyc", module)
  .add("StartKYC", () => <StartKYC handler={() => {}} />)
  .add("SelectID", () => <SelectID handler={() => {}} />)
  .add("TakeID", () => <TakeID handler={() => {}} />)
  .add("PersonalDataInput", () => <PersonalDataInput handler={() => {}} />)
  .add("TakeSelfieBefore", () => <TakeSelfieBefore handler={() => {}} />)
  .add("TakeSelfie", () => <TakeSelfie handler={() => {}} />)
  .add("ConfirmSelfie", () => <ConfirmSelfie handler={() => {}} />);
