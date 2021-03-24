import React, { FunctionComponent, useState } from 'react';
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
} from 'react-native';
import moment from 'moment';
import { SafeAreaView } from 'react-navigation';
import { SubmitButton } from '../../../shared/components/SubmitButton';
import { useTranslation } from 'react-i18next'
import { TypePicker } from './TypePicker';
import DateInput from './DateInput';
import { State } from '../../../hooks/reducers/TransactionFilterReducer';
import { H3Text, P1Text } from '../../../shared/components/Texts';
import IosPickerModal from '../../../shared/components/IosPickerModal';

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
    startDateModalVisible: false,
    endDateModalVisible: false,
  });
  const { t } = useTranslation();

  return (
    <>
      <SafeAreaView
        forceInset={{ top: 'never', bottom: 'always' }}
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
                label={t('more_label.period')}
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
                  title={t('more_label.30_day')}
                  handler={() => {
                    props.dispatch({ type: 'UPDATE_PERIOD', period: '30' });
                    props.dispatch({ type: 'UPDATE_STARTDATE', start: '' });
                    props.dispatch({ type: 'UPDATE_ENDDATE', end: '' });
                  }}
                />
                <Button
                  on={props.filter.period === '90'}
                  style={{ width: '31%' }}
                  title={t('more_label.90_day')}
                  handler={() => {
                    props.dispatch({ type: 'UPDATE_PERIOD', period: '90' });
                    props.dispatch({ type: 'UPDATE_STARTDATE', start: '' });
                    props.dispatch({ type: 'UPDATE_ENDDATE', end: '' });
                  }}
                />
                <Button
                  on={props.filter.period === ''}
                  style={{ width: '31%' }}
                  title={t('more_label._day')}
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
                  <View style={{ flex: 1 }}>
                    {Platform.OS === 'ios' ? (
                      <TouchableOpacity
                        style={{
                          width: '100%',
                          height: 40,
                          backgroundColor: 'transparent',
                          alignItems: 'center',
                          flexDirection: 'row',
                          justifyContent: 'center',
                        }}
                        onPress={() => {
                          setState({ ...state, startDateModalVisible: true });
                        }}>
                        {props.filter.start ? (
                          <H3Text
                            label={props.filter.start}
                            style={{
                              fontSize: 13,
                              textAlign: 'center',
                            }}
                          />
                        ) : (
                          <P1Text
                            label={moment().format('YYYY-MM-DD')}
                            style={{
                              color: '#A7A7A7',
                              fontSize: 13,
                              textAlign: 'center',
                            }}
                          />
                        )}
                      </TouchableOpacity>
                    ) : (
                      <DateInput
                        date={props.filter.start}
                        eventHandler={(date: string) =>
                          props.dispatch({
                            type: 'UPDATE_STARTDATE',
                            start: date,
                          })
                        }
                      />
                    )}
                  </View>
                  <Text
                    allowFontScaling={false}
                    style={{
                      textAlign: 'center',
                      alignItems: 'center',
                      flex: 0.2,
                    }}>
                    {'-'}
                  </Text>
                  <View style={{ flex: 1 }}>
                    {Platform.OS === 'ios' ? (
                      <TouchableOpacity
                        style={{
                          width: '100%',
                          height: 40,
                          backgroundColor: 'transparent',
                          alignItems: 'center',
                          flexDirection: 'row',
                          justifyContent: 'center',
                        }}
                        onPress={() => {
                          setState({ ...state, endDateModalVisible: true });
                        }}>
                        {props.filter.end ? (
                          <H3Text
                            label={
                              props.filter.end ? props.filter.end : 'end date'
                            }
                            style={{
                              fontSize: 13,
                              textAlign: 'center',
                            }}
                          />
                        ) : (
                          <P1Text
                            label={moment().format('YYYY-MM-DD')}
                            style={{
                              color: '#A7A7A7',
                              fontSize: 13,
                              textAlign: 'center',
                            }}
                          />
                        )}
                      </TouchableOpacity>
                    ) : (
                      <DateInput
                        date={props.filter.end}
                        eventHandler={(date: string) =>
                          props.dispatch({
                            type: 'UPDATE_ENDDATE',
                            end: date,
                          })
                        }
                      />
                    )}
                  </View>
                </View>
              )}

              <H3Text
                style={{ marginTop: 30, fontSize: 16, marginBottom: 10 }}
                label={t('more_label.types')}
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
                    label={t(`more_label.type_${props.filter.type}`)}
                    style={{
                      fontSize: 13,
                      textAlign: 'center',
                    }}
                  />
                </TouchableOpacity>
              )}
              <H3Text
                style={{ fontSize: 16, marginBottom: 10 }}
                label={t('more_label.product')}
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
            title={t('more_label.retrieve')}
            handler={() => {
              if (new Date(props.filter.start) > new Date(props.filter.end)) {
                return alert(t('more.invalid_date'));
              }
              props.filterTransactions();
              props.dispatch({ type: 'MODAL_CONTROL', modal: false });
            }}
          />
        </View>
      </SafeAreaView>
      {Platform.OS === 'ios' && (
        <>
          {(state.typeModalVisible ||
            state.productModalVisible ||
            state.startDateModalVisible ||
            state.endDateModalVisible) && (
              <View
                style={{
                  backgroundColor: 'rgba(0,0,0,0.3)',
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                }}
              />
            )}
          <IosPickerModal
            modalVisible={state.typeModalVisible}
            doneHandler={() => {
              setState({ ...state, typeModalVisible: false });
            }}
            buttonNumber={1}
            children={
              <TypePicker
                style={{ top: 35 }}
                dispatch={props.dispatch}
                filter={props.filter}
              />
            }
          />
          <IosPickerModal
            modalVisible={state.startDateModalVisible}
            doneHandler={() => {
              setState({ ...state, startDateModalVisible: false });
            }}
            buttonNumber={1}
            children={
              <DateInput
                date={props.filter.start}
                eventHandler={(date: string) =>
                  props.dispatch({ type: 'UPDATE_STARTDATE', start: date })
                }
              />
            }
          />
          <IosPickerModal
            modalVisible={state.endDateModalVisible}
            doneHandler={() => {
              setState({ ...state, endDateModalVisible: false });
            }}
            buttonNumber={1}
            children={
              <DateInput
                date={props.filter.end}
                eventHandler={(date: string) =>
                  props.dispatch({ type: 'UPDATE_ENDDATE', end: date })
                }
              />
            }
          />
          <IosPickerModal
            modalVisible={state.productModalVisible}
            doneHandler={() => {
              setState({ ...state, productModalVisible: false });
            }}
            buttonNumber={1}
            children={props.children}
          />
        </>
      )}
    </>
  );
};

export default Filter;
