import React from "react";
import { storiesOf } from "./node_modules/@storybook/reactstorybook/react";
import FlatButton from "../../src/shared/components/FlatButton";

storiesOf("FlatButton", module)
  .add("default", () => <FlatButton title={task.title} handler={handler} />);