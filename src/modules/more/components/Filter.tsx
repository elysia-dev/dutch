import React, { Children, FunctionComponent, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleProp,
  ViewStyle,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Platform,
  Modal,
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
};

type props = React.PropsWithChildren<{
  dispatch: React.Dispatch<any>;
  filter: State;
  productList: any;
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
          }}
          label={props.title}
        />
      </TouchableOpacity>
    </View>
  );
};

const Filter: FunctionComponent<props> = (props: props) => {
  const [state, setState] = useState({
    typeModalVisible: false,
    productModalVisible: false,
  });

  return (
    <>
      <View
        style={{
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
          paddingTop: 15,
          position: 'absolute',
          width: '100%',
          height: '80%',
          bottom: 0,
          backgroundColor: '#fff',
        }}>
        <View style={{ width: '100%', height: '100%' }}>
          <TouchableOpacity
            style={{
              width: 30,
              height: 30,
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
            onPress={() =>
              props.dispatch({ type: 'MODAL_CONTROL', modal: false })
            }>
            <Image
              style={{
                width: 30,
                height: 30,
              }}
              source={require('../images/bluedownarrow.png')}
            />
          </TouchableOpacity>
          <ScrollView style={{ paddingHorizontal: 15, paddingTop: 30 }}>
            <View style={{ width: '100%', position: 'relative' }}>
              <H3Text
                label={i18n.t('more_label.period')}
                style={{ fontSize: 16, marginBottom: 10 }}
              />
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
                  handler={() =>
                    props.dispatch({ type: 'UPDATE_PERIOD', period: '' })
                  }
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
                  <Text
                    allowFontScaling={false}
                    style={{ textAlign: 'center', alignItems: 'center' }}>
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
              <H3Text
                style={{ marginTop: 30, fontSize: 16, marginBottom: 10 }}
                label={i18n.t('more_label.types')}
              />
              {Platform.OS === 'android' ? (
                <TypePicker
                  style={{ marginBottom: 30 }}
                  dispatch={props.dispatch}
                  filter={props.filter}
                />
              ) : (
                <TouchableOpacity
                  style={{
                    width: '100%',
                    height: 40,
                    backgroundColor: '#fff',
                    borderRadius: 5,
                    borderWidth: 1,
                    borderColor: '#D0D8DF',
                    alignItems: 'center',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    marginBottom: 30,
                  }}
                  onPress={() => {
                    setState({ ...state, typeModalVisible: true });
                  }}>
                  <H3Text
                    label={i18n.t(`more_label.type_${props.filter.type}`)}
                    style={{
                      fontSize: 13,
                      textAlign: 'center',
                    }}
                  />
                </TouchableOpacity>
              )}
              <H3Text
                style={{ fontSize: 16, marginBottom: 10 }}
                label={i18n.t('more_label.product')}
              />
              {Platform.OS === 'android' ? (
                props.children
              ) : (
                <TouchableOpacity
                  style={{
                    width: '100%',
                    height: 40,
                    backgroundColor: '#fff',
                    borderRadius: 5,
                    borderWidth: 1,
                    borderColor: '#D0D8DF',
                    alignItems: 'center',
                    flexDirection: 'row',
                    justifyContent: 'center',
                  }}
                  onPress={() => {
                    setState({ ...state, productModalVisible: true });
                  }}>
                  <H3Text
                    label={
                      props.productList.iosList[props.filter.productId].label
                    }
                    style={{
                      fontSize: 13,
                      textAlign: 'center',
                    }}
                  />
                </TouchableOpacity>
              )}
            </View>
          </ScrollView>
          <SubmitButton
            style={{
              position: 'absolute',
              bottom: 15,
              width: Dimensions.get('screen').width - 30,
              marginLeft: 15,
              marginRight: 15,
              alignSelf: 'center',
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
      </View>
      {(state.typeModalVisible || state.productModalVisible) && (
        <View
          style={{
            backgroundColor: 'rgba(0,0,0,0.3)',
            position: 'absolute',
            width: '100%',
            height: '100%',
          }}
        />
      )}
      <Modal
        visible={state.typeModalVisible}
        animationType={'slide'}
        transparent={true}>
        <View
          style={{
            backgroundColor: 'rgba(250,250,250,0.9)',
            position: 'absolute',
            bottom: 0,
            width: '100%',
            height: 245,
          }}>
          <View
            style={{
              backgroundColor: '#fff',
              position: 'absolute',
              top: 0,
              width: '100%',
              height: 45,
              flexDirection: 'row',
              justifyContent: 'flex-end',
              alignItems: 'center',
              paddingHorizontal: '5%',
            }}>
            <TouchableOpacity
              onPress={async () => {
                setState({ ...state, typeModalVisible: false });
              }}>
              <P1Text
                label={i18n.t('more_label.done')}
                style={{ color: '#3679B5' }}
              />
            </TouchableOpacity>
          </View>
          <TypePicker
            style={{ top: 35 }}
            dispatch={props.dispatch}
            filter={props.filter}
          />
        </View>
      </Modal>
      <Modal
        visible={state.productModalVisible}
        animationType={'slide'}
        transparent={true}>
        <View
          style={{
            backgroundColor: 'rgba(250,250,250,0.9)',
            position: 'absolute',
            bottom: 0,
            width: '100%',
            height: 245,
          }}>
          <View
            style={{
              zIndex: 3,
              backgroundColor: '#fff',
              position: 'absolute',
              top: 0,
              width: '100%',
              height: 45,
              flexDirection: 'row',
              justifyContent: 'flex-end',
              alignItems: 'center',
              paddingHorizontal: '5%',
            }}>
            <TouchableOpacity
              onPress={async () => {
                setState({ ...state, productModalVisible: false });
              }}>
              <P1Text
                label={i18n.t('more_label.done')}
                style={{ color: '#3679B5' }}
              />
            </TouchableOpacity>
          </View>
          {props.children}
        </View>
      </Modal>
    </>
  );
};

export default Filter;
