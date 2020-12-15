import React, { FunctionComponent, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput as RNTextInput,
  StyleProp,
  ViewStyle,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import DatePicker from 'react-native-datepicker';
import styled from 'styled-components/native';
import i18n from '../../../i18n/i18n';

interface Props {
  type: string;
  eventHandler: (input: string) => void;
  birthday: string;
  style?: StyleProp<ViewStyle>;
}

const InputHeaderText = styled.Text`
  color: #a7a7a7;
  font-size: 12px;
  text-align: left;
  font-family: 'Roboto_400Regular';
`;

export const DateInput: FunctionComponent<Props> = (props) => {
  const currentDate = new Date();

  return (
    <View style={props.style}>
      {Platform.OS === 'ios' ? (
        <DateTimePicker
          value={props.birthday ? new Date(props.birthday) : currentDate}
          display="spinner"
          mode="date"
          onChange={(_event, date) =>
            props.eventHandler(i18n.strftime(date, '%Y-%m-%d'))
          }
          minimumDate={new Date(1900, 1, 1)}
          maximumDate={currentDate}
        />
      ) : (
        <DatePicker
          style={{
            width: '100%',
            height: 45,
            position: 'absolute',
            top: 0,
          }}
          date={props.birthday}
          onDateChange={(date) => {
            props.eventHandler(date);
          }}
          allowFontScaling={false}
          mode="date"
          androidMode="spinner"
          placeholder={i18n.strftime(currentDate, '%Y-%m-%d')}
          format="YYYY-MM-DD"
          minDate={'2000-01-01'}
          maxDate={currentDate}
          confirmBtnText={i18n.t('more_label.done')}
          cancelBtnText={i18n.t('more_label.close')}
          customStyles={{
            dateText: {
              fontSize: 15,
              fontFamily: 'Roboto_400Regular',
            },
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
