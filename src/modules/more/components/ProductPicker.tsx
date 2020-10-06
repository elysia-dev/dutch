import React, {
  Component,
  FunctionComponent,
  useCallback,
  useContext,
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
import styled from 'styled-components/native';
import RNPickerSelect, { Item } from 'react-native-picker-select';
import DropDownPicker from 'react-native-dropdown-picker';
import i18n from '../../../i18n/i18n';
import RootContext from '../../../contexts/RootContext';

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

export const ProductPicker: FunctionComponent<Props> = props => {
  const { Server } = useContext(RootContext);
  const [state, setState] = useState({
    iosList: [{ label: '전체', value: '0', key: 0 }],
    andList: [
      <Picker.Item key={0} label={i18n.t('more_label.type_')} value={'0'} />,
    ],
  });

  const loadProducts = useCallback(() => {
    Server.getAllProductIds()
      .then(res => {
        setState({
          ...state,
          iosList: state.iosList.concat(
            res.data.map((product, index) => ({
              label: product.title,
              value: `${product.productId}`,
              key: index + 1,
            })),
          ),
          andList: state.andList.concat(
            res.data.map((product, index) => (
              <Picker.Item
                key={index + 1}
                label={product.title}
                value={`${product.productId}`}
              />
            )),
          ),
        });
      })
      .catch(e => {
        if (e.response.status === 401) {
          alert(i18n.t('account.need_login'));
        } else if (e.response.status === 500) {
          alert(i18n.t('account_errors.server'));
        }
      });
  }, []);

  useEffect(() => {
    loadProducts();
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
                type: 'CHANGE_PRODUCT',
                value: parseInt(value, 10),
              })
            }>
            {state.andList}
          </Picker>
        </View>
      ) : (
        <RNPickerSelect
          onValueChange={(value: string) => {
            props.dispatch({
              type: 'CHANGE_PRODUCT',
              value: parseInt(value, 10),
            });
          }}
          items={state.iosList}
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
