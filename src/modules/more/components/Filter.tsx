import React, {
  Children,
  FunctionComponent,
} from 'react';
import {
  View,
  Text,
  Image,
  StyleProp,
  ViewStyle,
  TouchableOpacity,
} from 'react-native';
import styled from 'styled-components/native';
import { SubmitButton } from '../../../shared/components/SubmitButton';
import i18n from '../../../i18n/i18n';
import { TypePicker } from './TypePicker';
import { DateInput } from './DateInput';
import { State } from '../../../hooks/reducers/TransactionFilterReducer';
import { H3Text, P1Text } from '../../../shared/components/Texts';

type ButtonProps = {
  title: string;
  style?: StyleProp<ViewStyle>;
  handler?: () => void;
  on: boolean;
}

type props = React.PropsWithChildren<{
  dispatch: React.Dispatch<any>;
  filter: State;
  filterTransactions: () => void;
}>;

const Button: FunctionComponent<ButtonProps> = (props: ButtonProps) => {
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
        <P1Text
          style={{
            color: props.on ? '#1C1C1C' : '#A7A7A7',
            fontSize: 13,
            textAlign: 'center',
            fontFamily: props.on ? 'Roboto_700Bold' : 'Roboto_400Regular',
          }} label={props.title}/>
      </TouchableOpacity>
    </View>
  );
};

const Filter: FunctionComponent<props> = (props: props) => {
  return (
    <View
      style={{
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        padding: 15,
        position: 'absolute',
        width: '100%',
        height: '78%',
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
        onPress={() => props.dispatch({ type: 'MODAL_CONTROL', modal: false })}>
        <Image
          style={{
            width: '100%',
            height: '100%',
            resizeMode: 'center',
          }}
          source={require('../images/bluedownarrow.png')}
        />
      </TouchableOpacity>
      <View style={{ width: '100%', position: 'relative', top: -10 }}>
        <H3Text label={i18n.t('more_label.period')} style={{ fontSize: 16, marginBottom: 10 }} />
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
              props.dispatch({ type: 'UPDATE_PERIOD', period: '30' });
              props.dispatch({ type: 'UPDATE_STARTDATE', start: '' });
              props.dispatch({ type: 'UPDATE_ENDDATE', end: '' });
            }}
          />
          <Button
            on={props.filter.period === '90'}
            style={{ width: '31%' }}
            title={i18n.t('more_label.90_day')}
            handler={() => {
              props.dispatch({ type: 'UPDATE_PERIOD', period: '90' });
              props.dispatch({ type: 'UPDATE_STARTDATE', start: '' });
              props.dispatch({ type: 'UPDATE_ENDDATE', end: '' });
            }}
          />
          <Button
            on={props.filter.period === ''}
            style={{ width: '31%' }}
            title={i18n.t('more_label._day')}
            handler={() => props.dispatch({ type: 'UPDATE_PERIOD', period: '' })}
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
                props.dispatch({ type: 'UPDATE_STARTDATE', start: date })
              }
            />
            <Text allowFontScaling={false} style={{ textAlign: 'center', alignItems: 'center' }}>
              {'-'}
            </Text>
            <DateInput
              date={props.filter.end}
              eventHandler={(date: string) =>
                props.dispatch({ type: 'UPDATE_ENDDATE', end: date })
              }
            />
          </View>
        )}
        <H3Text style={{ marginTop: 30, fontSize: 16, marginBottom: 10 }} label={i18n.t('more_label.types')} />
        <TypePicker
          style={{ marginBottom: 30 }}
          dispatch={props.dispatch}
          filter={props.filter}
        />
        <H3Text style={{ fontSize: 16, marginBottom: 10 }} label={i18n.t('more_label.product')} />
        {props.children}
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
          props.filterTransactions();
          props.dispatch({ type: 'MODAL_CONTROL', modal: false });
        }}
      />
    </View>
  );
};

export default Filter;
