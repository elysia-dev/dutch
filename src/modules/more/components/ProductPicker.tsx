import React, { FunctionComponent, useEffect } from 'react';
import { StyleSheet, View, Platform, StyleProp, ViewStyle } from 'react-native';
import { Picker } from '@react-native-community/picker';
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

export const ProductPicker: FunctionComponent<Props> = (props) => {
  useEffect(() => {
    props.loadProducts();
  }, []);

  return (
    <View style={props.style}>
      <View
        style={
          Platform.OS === 'android'
            ? pickerSelectStyles.inputAndroid
            : pickerSelectStyles.inputIOS
        }>
        <Picker
          // mode="dropdown"
          accessibilityLabel={'product'}
          selectedValue={`${props.filter.productId}`}
          onValueChange={(value) =>
            props.dispatch({
              type: 'UPDATE_PRODUCT',
              productId: parseInt(value.toString(), 10),
            })
          }>
          {props.productList.andList}
        </Picker>
      </View>
    </View>
  );
};

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    top: 35,
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
