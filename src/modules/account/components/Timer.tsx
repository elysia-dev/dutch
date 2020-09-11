import React, { Component } from "react";
import { View, Text } from "react-native";
import i18n from "../../../i18n/i18n";
import styled from "styled-components/native";

const ExpTimeText = styled.Text`
  color: #1c1c1c;
  font-size: 13px;
  line-height: 21px;
  height: 21px;
  text-align: center;
`;

interface props {
  verif?: string;
}

interface state {
  minutes: number;
  seconds: number;
}

export class Timer extends Component<props, state> {
  constructor(props: props) {
    super(props);
    this.state = {
      minutes: 10,
      seconds: 0,
    };
  }

  interval!: NodeJS.Timeout;

  componentDidMount() {
    this.interval = setInterval(() => {
      const { seconds, minutes } = this.state;
      if (seconds > 0) {
        this.setState(({ seconds }) => ({
          seconds: seconds - 1,
        }));
      }
      if (seconds === 0) {
        if (minutes === 0) {
          clearInterval(this.interval);
        } else {
          this.setState(({ minutes }) => ({
            minutes: minutes - 1,
            seconds: 59,
          }));
        }
      }
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  componentDidUpdate(prevProps: { verif: string }) {
    if (prevProps.verif !== this.props.verif) {
      this.setState({ minutes: 10, seconds: 0 });
    }
  }

  render() {
    return (
      <View
        style={{
          width: 50,
        }}
      >
        {this.state.minutes === 0 && this.state.seconds === 0 ? (
          <ExpTimeText>{i18n.t("register.expired_time")}</ExpTimeText>
        ) : (
          <ExpTimeText>
            {this.state.minutes}:
            {this.state.seconds < 10
              ? `0${this.state.seconds}`
              : this.state.seconds}
          </ExpTimeText>
        )}
      </View>
    );
  }
}
