import React, {
  FunctionComponent,
  useContext,
  useReducer,
  useState,
} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Image,
  StyleProp,
  ViewStyle,
  TouchableOpacity,
} from 'react-native';
import styled from 'styled-components/native';
import { useNavigation } from '@react-navigation/native';
import { SubmitButton } from '../../shared/components/SubmitButton';
import i18n from '../../i18n/i18n';
import { TypePicker } from './components/TypePicker';
import { ProductPicker } from './components/ProductPicker';
import { DateInput } from './components/DateInput';
import RootContext from '../../contexts/RootContext';

const H1Text = styled.Text`
  color: #1c1c1c;
  font-size: 16px;
  text-align: left;
  margin-bottom: 10px;
`;

interface ButtonProps {
  title: string;
  style?: StyleProp<ViewStyle>;
  handler?: () => void;
  on: boolean;
}

interface Props {
  dispatch: React.Dispatch<any>;
  filter: any;
}

const Button: FunctionComponent<ButtonProps> = props => {
  return (
    <View style={props.style}>
      <TouchableOpacity
        onPress={props.handler}
        style={{
          height: 40,
          width: '100%',
          justifyContent: 'center',
          alignContent: 'center',
          borderRadius: 5,
          borderWidth: 1,
          borderColor: props.on ? '#3679B5' : '#D0D8DF',
        }}>
        <Text
          style={{
            color: props.on ? '#1C1C1C' : '#A7A7A7',
            fontSize: 13,
            textAlign: 'center',
            fontWeight: props.on ? 'bold' : 'normal',
          }}>
          {props.title}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const Filter: FunctionComponent<Props> = (props: Props) => {
  const { Server } = useContext(RootContext);

  // 서버 풀받고 체크하기
  const filterTransactions = () => {
    Server.getTransactionHistory(
      props.filter.page,
      props.filter.start,
      props.filter.end,
      props.filter.type,
      props.filter.period,
      props.filter.productId,
    )
      .then(res => {
        props.dispatch({
          type: 'FILTER_LIST',
          value: res.data,
        });
      })
      .catch(e => {
        if (e.response.status === 401) {
          alert(i18n.t('account.need_login'));
        } else if (e.response.status === 500) {
          alert(i18n.t('account_errors.server'));
        }
      });
  };

  return (
    <View
      style={{
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        padding: 15,
        position: 'absolute',
        width: '100%',
        height: '70%',
        bottom: 0,
        backgroundColor: '#fff',
      }}>
      <TouchableOpacity
        style={{
          width: 30,
          height: 30,
          marginLeft: 'auto',
          marginRight: 'auto',
          marginBottom: 40,
        }}
        onPress={() => props.dispatch({ type: 'MODAL_CONTROL', value: false })}>
        <Image
          style={{
            width: '100%',
            height: '100%',
            resizeMode: 'center',
          }}
          source={require('./images/bluedownarrow.png')}
        />
      </TouchableOpacity>
      <View style={{ width: '100%', position: 'relative', top: -10 }}>
        <H1Text>{i18n.t('more_label.period')}</H1Text>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '100%',
            marginBottom: 10,
          }}>
          <Button
            on={props.filter.period === '30'}
            style={{ width: '31%' }}
            title={i18n.t('more_label.30_day')}
            handler={() => {
              props.dispatch({ type: 'CHANGE_PERIOD', value: '30' });
              props.dispatch({ type: 'CHANGE_STARTDATE', value: '' });
              props.dispatch({ type: 'CHANGE_ENDDATE', value: '' });
            }}
          />
          <Button
            on={props.filter.period === '90'}
            style={{ width: '31%' }}
            title={i18n.t('more_label.90_day')}
            handler={() => {
              props.dispatch({ type: 'CHANGE_PERIOD', value: '90' });
              props.dispatch({ type: 'CHANGE_STARTDATE', value: '' });
              props.dispatch({ type: 'CHANGE_ENDDATE', value: '' });
            }}
          />
          <Button
            on={props.filter.period === ''}
            style={{ width: '31%' }}
            title={i18n.t('more_label._day')}
            handler={() => props.dispatch({ type: 'CHANGE_PERIOD', value: '' })}
          />
        </View>
        {!props.filter.period && (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              height: 40,
              width: '100%',
              borderRadius: 5,
              borderColor: '#D0D8DF',
              borderWidth: 1,
            }}>
            <DateInput
              date={props.filter.start}
              eventHandler={(date: string) =>
                props.dispatch({ type: 'CHANGE_STARTDATE', value: date })
              }
            />
            <Text style={{ textAlign: 'center', alignItems: 'center' }}>
              {'-'}
            </Text>
            <DateInput
              date={props.filter.end}
              eventHandler={(date: string) =>
                props.dispatch({ type: 'CHANGE_ENDDATE', value: date })
              }
            />
          </View>
        )}
        <H1Text style={{ marginTop: 30 }}>{i18n.t('more_label.types')}</H1Text>
        <TypePicker
          style={{ marginBottom: 30 }}
          dispatch={props.dispatch}
          filter={props.filter}
        />
        <H1Text>{i18n.t('more_label.product')}</H1Text>
        <ProductPicker
          style={{ marginBottom: 30 }}
          dispatch={props.dispatch}
          filter={props.filter}
        />
      </View>
      <SubmitButton
        style={{
          position: 'absolute',
          left: 15,
          bottom: 15,
          width: '100%',
          marginLeft: 'auto',
          marginRight: 'auto',
        }}
        title={i18n.t('more_label.retrieve')}
        handler={() => {
          if (new Date(props.filter.start) > new Date(props.filter.end)) {
            return alert(i18n.t('more.invalid_date'));
          }

          props.dispatch({ type: 'UPDATE_PAGE', value: 1 });
          filterTransactions();
          props.dispatch({ type: 'MODAL_CONTROL', value: false });
        }}
      />
    </View>
  );
};

export default Filter;
