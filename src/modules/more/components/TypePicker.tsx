import React, { Component, FunctionComponent } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Picker,
  Platform,
  StyleProp,
  ViewStyle,
} from 'react-native';
import styled from 'styled-components/native';
import RNPickerSelect, { Item } from 'react-native-picker-select';
import DropDownPicker from 'react-native-dropdown-picker';
import i18n from '../../../i18n/i18n';

const InputHeaderText = styled.Text`
  color: #a7a7a7;
  font-size: 12px;
  text-align: left;
`;

interface Props {
  dispatch: React.Dispatch<any>;
  filter: any;
  style?: StyleProp<ViewStyle>;
}

export const TypePicker: FunctionComponent<Props> = props => {
  const TypesListIos = [
    { label: i18n.t('more_label.type_'), value: '', key: 0 },
    { label: i18n.t('more_label.type_ownership'), value: 'ownership', key: 1 },
    { label: i18n.t('more_label.type_refund'), value: 'refund', key: 2 },
    { label: i18n.t('more_label.type_close'), value: 'close', key: 3 },
    {
      label: i18n.t('more_label.type_expectedProfit'),
      value: 'expectedProfit',
      key: 4,
    },
    { label: i18n.t('more_label.type_profit'), value: 'profit', key: 5 },
  ];

  const TypesListAnd = [
    <Picker.Item key={0} label={i18n.t('more_label.type_')} value={''} />,
    <Picker.Item
      key={1}
      label={i18n.t('more_label.type_ownership')}
      value={'ownership'}
    />,
    <Picker.Item
      key={2}
      label={i18n.t('more_label.type_refund')}
      value={'refund'}
    />,
    <Picker.Item
      key={3}
      label={i18n.t('more_label.type_close')}
      value={'close'}
    />,
    <Picker.Item
      key={4}
      label={i18n.t('more_label.type_expectedProfit')}
      value={'expectedProfit'}
    />,
    <Picker.Item
      key={5}
      label={i18n.t('more_label.type_profit')}
      value={'profit'}
    />,
  ];

  return (
    <View style={props.style}>
      {Platform.OS === 'android' ? (
        <View style={pickerSelectStyles.inputAndroid}>
          <Picker
            // mode="dropdown"
            selectedValue={props.filter.type}
            onValueChange={value =>
              props.dispatch({
                type: 'UPDATE_TYPE',
                transactionType: value,
              })
            }>
            {TypesListAnd}
          </Picker>
        </View>
      ) : (
          <RNPickerSelect
            onValueChange={value =>
              props.dispatch({
                type: 'UPDATE_TYPE',
                transactionType: value,
              })
            }
            value={props.filter.type}
            items={TypesListIos}
            style={pickerSelectStyles}
            placeholder={{}}
          />
        )}
    </View>
  );
};

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    backgroundColor: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    paddingVertical: 12,
    paddingHorizontal: 5,
    borderWidth: 1,
    borderColor: '#d0d8df',
    borderRadius: 5,
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
