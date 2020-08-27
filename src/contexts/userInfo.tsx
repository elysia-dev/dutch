import React, { Component, createContext } from "react";

const Context = createContext({});

const { Provider, Consumer: UserConsumer } = Context;

class UserProvider extends Component {
  state = {
    // login: false,
    token: "",
    email: "",
    // verification_id: "",
    // locked: false,
  };

  actions = {
    setValue: (key: any, value: any) => {
      this.setState({ key: value });
    },
  };

  render() {
    const { state, actions } = this;
    const value = { state, actions };
    return <Provider value={value}>{this.props.children}</Provider>;
  }
}

export { UserProvider, UserConsumer };
