import React from "react";
import { storiesOf } from "./node_modules/@storybook/reactstorybook/react";
import { action } from "@storybook/addon-actions"; // 액션 에드온
import FlatButton from "../../src/shared/components/FlatButton";

export const test = {
  title: "테스트",
};

export const handler = () => {};

storiesOf("FlatButton", module) // Storybook에 표시될 폴더명
  // 데코레이터를 이용하면 아래와 같이 테스트할 스토리의 래핑 컴포넌트를 작성할 수 있습니다.
  // add('스토리명', 스토리 랜더링)
  .add("default", () => <FlatButton title={task.title} handler={handler} />);
