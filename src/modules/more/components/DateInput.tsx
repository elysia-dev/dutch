import React, { Component, FunctionComponent, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput as RNTextInput,
  Image,
} from 'react-native';
import DatePicker from 'react-native-datepicker';
import i18n from '../../../i18n/i18n';

interface Props {
  date: string;
  eventHandler: (date: string) => void;
}

interface State {
  date: string;
}

export class DateInput extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { date: '' };
  }
  currentTime = new Date();

  render() {
    return (
      <View style={{ width: '45%' }}>
        <DatePicker
          style={{ width: '100%', height: 40 }}
          date={this.props.date}
          onDateChange={date => {
            this.props.eventHandler(date);
          }}
          mode="date"
          androidMode="spinner"
          placeholder={i18n.strftime(this.currentTime, '%Y-%m-%d')}
          format="YYYY-MM-DD"
          minDate={'2000-01-01'}
          maxDate={this.currentTime}
          confirmBtnText="Confirm"
          cancelBtnText="Cancel"
          customStyles={{
            btnTextConfirm: {
              color: '#3679B5',
            },
            dateIcon: {
              width: 0,
              height: 0,
              opacity: 0,
              position: 'relative',
            },
            dateInput: {
              marginLeft: 'auto',
              marginRight: 'auto',
              borderRadius: 5,
              borderWidth: 0,
              borderColor: '#D0D8DF',
            },
          }}
        />
      </View>
    );
  }
}
