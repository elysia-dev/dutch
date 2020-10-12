import React, {
  Component,
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Picker,
  Platform,
  StyleProp,
  ViewStyle,
} from 'react-native';
import RNPickerSelect, { Item } from 'react-native-picker-select';
import { State } from '../../../hooks/reducers/TransactionFilterReducer';

interface Props {
  dispatch: React.Dispatch<any>;
  filter: State;
  style?: StyleProp<ViewStyle>;
  loadProducts: () => void;
  productList: {
    iosList: {
      label: string;
      value: string;
      key: number;
    }[];
    andList: JSX.Element[];
  };
}

export const ProductPicker: FunctionComponent<Props> = props => {
  useEffect(() => {
    props.loadProducts();
  }, []);

  return (
    <View style={props.style}>
      {Platform.OS === 'android' ? (
        <View style={pickerSelectStyles.inputAndroid}>
          <Picker
            // mode="dropdown"
            selectedValue={props.filter.type}
            onValueChange={(value: string) =>
              props.dispatch({
                type: 'UPDATE_PRODUCT',
                productId: parseInt(value, 10),
              })
            }>
            {props.productList.andList}
          </Picker>
        </View>
      ) : (
        <RNPickerSelect
          onValueChange={(value: string) => {
            props.dispatch({
              type: 'UPDATE_PRODUCT',
              value: parseInt(value, 10),
            });
          }}
          items={props.productList.iosList}
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
