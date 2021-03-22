import React, { FunctionComponent } from 'react';
import { StyleSheet, View, Platform, StyleProp, ViewStyle } from 'react-native';
import { Picker } from '@react-native-community/picker';
import { useTranslation } from 'react-i18next'

interface Props {
  dispatch: React.Dispatch<any>;
  filter: any;
  style?: StyleProp<ViewStyle>;
}

export const TypePicker: FunctionComponent<Props> = (props) => {
  const { t } = useTranslation();

  const TypesList = [
    <Picker.Item key={0} label={t('more_label.type_')} value={''} />,
    <Picker.Item
      key={1}
      label={t('more_label.type_ownership')}
      value={'ownership'}
    />,
    <Picker.Item
      key={2}
      label={t('more_label.type_refund')}
      value={'refund'}
    />,
    <Picker.Item
      key={3}
      label={t('more_label.type_close')}
      value={'close'}
    />,
    <Picker.Item
      key={4}
      label={t('more_label.type_expectedProfit')}
      value={'expectedProfit'}
    />,
    <Picker.Item
      key={5}
      label={t('more_label.type_profit')}
      value={'profit'}
    />,
  ];

  return (
    <View style={props.style}>
      <View
        style={
          Platform.OS === 'android'
            ? pickerSelectStyles.inputAndroid
            : pickerSelectStyles.inputIOS
        }>
        <Picker
          accessibilityLabel={'type'}
          mode="dialog"
          selectedValue={props.filter.type}
          onValueChange={(value) =>
            props.dispatch({
              type: 'UPDATE_TYPE',
              transactionType: value,
            })
          }>
          {TypesList}
        </Picker>
      </View>
    </View>
  );
};

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1C1C1C',
    textAlign: 'center',
  },
  inputAndroid: {
    backgroundColor: '#fff',
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#d0d8df',
    borderRadius: 5,
    color: '#1C1C1C',
  },
});
