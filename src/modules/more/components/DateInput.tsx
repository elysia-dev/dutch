import React, { Component, FunctionComponent, useState } from 'react';
import { View, TextInput as RNTextInput, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import DatePicker from 'react-native-datepicker';
import i18n from '../../../i18n/i18n';

interface Props {
  date: string;
  eventHandler: (date: string) => void;
}

const DateInput: FunctionComponent<Props> = (props: Props) => {
  const currentDate = new Date();

  return (
    <View style={{ width: '100%', paddingTop: 20 }}>
      {Platform.OS === 'ios' ? (
        <DateTimePicker
          value={props.date ? new Date(props.date) : currentDate}
          display="spinner"
          mode="date"
          onChange={(_event, date) =>
            props.eventHandler(i18n.strftime(date, '%Y-%m-%d'))
          }
          neutralButtonLabel="clear"
          minimumDate={new Date(1900, 1, 1)}
          maximumDate={currentDate}
        />
      ) : (
        <DatePicker
          style={{
            width: '100%',
            height: 40,
            marginTop: -10,
            position: 'absolute',
            top: 0,
          }}
          date={props.date}
          onDateChange={(date) => {
            props.eventHandler(date);
          }}
          mode="date"
          androidMode="spinner"
          placeholder={i18n.strftime(currentDate, '%Y-%m-%d')}
          format="YYYY-MM-DD"
          minDate={'2000-01-01'}
          maxDate={currentDate}
          confirmBtnText={i18n.t('more_label.done')}
          cancelBtnText={i18n.t('more_label.close')}
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
      )}
    </View>
  );
};

export default DateInput;
