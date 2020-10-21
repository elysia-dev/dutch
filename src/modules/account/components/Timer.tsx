import React, { Component } from 'react';
import styled from 'styled-components/native';
import { View } from 'react-native';
import i18n from '../../../i18n/i18n';

const ExpTimeText = styled.Text`
  color: #1c1c1c;
  font-size: 13px;
  line-height: 21px;
  height: 21px;
  text-align: center;
  font-family: 'Roboto_400Regular';
`;

interface Props {
  verif?: string;
}

interface State {
  minutes: number;
  seconds: number;
}

export class Timer extends Component<Props, State> {
  constructor(props: Props) {
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
        }}>
        {this.state.minutes === 0 && this.state.seconds === 0 ? (
          <ExpTimeText allowFontScaling={false}>{i18n.t('account.expired_time')}</ExpTimeText>
        ) : (
            <ExpTimeText allowFontScaling={false}>
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
