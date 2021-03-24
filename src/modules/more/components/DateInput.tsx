import React, { FunctionComponent } from 'react';
import { View, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import DatePicker from 'react-native-datepicker';
import { useTranslation } from 'react-i18next';
import moment from 'moment';

interface Props {
  date: string;
  eventHandler: (date: string) => void;
}

const DateInput: FunctionComponent<Props> = (props: Props) => {
  const currentDate = new Date();
  const { t } = useTranslation();

  return (
    <View style={{ width: '100%', paddingTop: 20 }}>
      {Platform.OS === 'ios' ? (
        <DateTimePicker
          value={props.date ? new Date(props.date) : currentDate}
          display="spinner"
          mode="date"
          onChange={(_event, date) =>
            props.eventHandler(moment(date).format('YYYY-MM-DD'))
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
          placeholder={moment(currentDate).format('YYYY-MM-DD')}
          format="YYYY-MM-DD"
          minDate={'2000-01-01'}
          maxDate={currentDate}
          confirmBtnText={t('more_label.done')}
          cancelBtnText={t('more_label.close')}
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
