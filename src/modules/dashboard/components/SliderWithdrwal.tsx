/* eslint-disable radix */
import React, { useState, FunctionComponent, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { View, Image, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import FunctionContext from '../../../contexts/FunctionContext';
import LegacyRefundStatus from '../../../enums/LegacyRefundStatus';
import { SubmitButton } from '../../../shared/components/SubmitButton';
import { TextField } from '../../../shared/components/TextField';
import { P1Text } from '../../../shared/components/Texts';

interface Props {
  modalHandler: () => void;
  switchingHandler: () => void;
  el: number;
  usd: number;
}

const InformationCircle = styled.View`
  width: 10px;
  height: 10px;
  background-color: #3679b5;
  border-radius: 10px;
  margin-right: 10px;
  top: 6px;
`;

const SliderWithdrawal: FunctionComponent<Props> = (props) => {
  const { Server, setRefundStatus } = useContext(FunctionContext);
  const [state, setState] = useState({
    inputEmail: '',
    inputWallet: '',
    errorReturn: 0,
  });
  const [focusing, setFocusing] = useState(false);
  const { t } = useTranslation();

  const refundLegacyWallet = () => {
    Server.setRefundLegacyWallet(state.inputWallet, state.inputEmail)
      .then((_res) => {
        setRefundStatus(LegacyRefundStatus.PENDING);
      })
      .catch((e) => {
        if (e.response.status === 400) {
          alert(t('dashboard.already_pending'));
        } else if (e.response.status === 500) {
          alert(t('account_errors.server'));
        } else {
          alert(t('account_errors.server'));
        }
      });
  };
  const checkWithdrawInput = () => {
    if (state.inputEmail === '' && state.inputWallet === '') {
      alert(t('dashboard.checking_withdraw_error.0'));
      return false;
    }
    if (props.el === 0 && props.usd === 0) {
      alert(t('account_errors.server'));
      return false;
    }

    if (state.inputWallet !== '' && state.inputEmail === '' && props.el === 0) {
      alert(t('dashboard.checking_withdraw_error.1'));
      return false;
    } else if (
      props.usd > 0 &&
      props.el > 0 &&
      state.inputWallet !== '' &&
      state.inputEmail === ''
    ) {
      alert(t('dashboard.checking_withdraw_error.2'));
      return false;
    } else if (
      state.inputWallet !== '' &&
      state.inputEmail !== '' &&
      props.usd === 0 &&
      props.el > 0
    ) {
      alert(t('dashboard.checking_withdraw_error.3'));
      return false;
    }

    if (
      state.inputEmail !== '' &&
      state.inputWallet === '' &&
      props.usd === 0
    ) {
      alert(t('dashboard.checking_withdraw_error.4'));
      return false;
    } else if (
      props.usd > 0 &&
      props.el > 0 &&
      state.inputWallet === '' &&
      state.inputEmail !== ''
    ) {
      alert(t('dashboard.checking_withdraw_error.5'));
      return false;
    } else if (
      state.inputWallet !== '' &&
      state.inputEmail !== '' &&
      props.el === 0 &&
      props.usd > 0
    ) {
      alert(t('dashboard.checking_withdraw_error.6'));
      return false;
    }
    return true;
  };

  return (
    <View
      style={{
        position: 'absolute',
        bottom: 0,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        paddingLeft: 20,
        paddingRight: 20,
        height: '70%',
        width: '100%',
        backgroundColor: '#fff',
        justifyContent: 'center',
      }}>
      <View style={{ width: '100%', height: '100%' }}>
        <TouchableOpacity
          style={{
            top: 10,
            width: 30,
            height: 30,
            alignSelf: 'center',
          }}
          onPress={props.modalHandler}>
          <Image
            source={require('../images/bluedownarrow.png')}
            style={{
              width: 30,
              height: 30,
            }}
          />
        </TouchableOpacity>
        <View style={{ paddingTop: 40 }} />
        <TextField
          label={t('dashboard_label.withdraw_paypal')}
          eventHandler={(input: string) => {
            setState({ ...state, inputEmail: input });
          }}
          focusHandler={(value) => setFocusing(value)}
        />
        <TextField
          label={t('dashboard_label.withdraw_eth')}
          eventHandler={(input: string) => {
            setState({ ...state, inputWallet: input });
          }}
          focusHandler={(value) => setFocusing(value)}
        />
        <View
          style={{
            backgroundColor: '#F6F6F8',
            borderRadius: 10,
            borderWidth: 1,
            borderColor: '#F1F1F1',
            padding: 15,
            marginTop: 15,
          }}>
          <View
            style={{
              flexDirection: 'row',
              marginBottom: 10,
              marginRight: '5%',
            }}>
            <InformationCircle />
            <P1Text
              label={t('dashboard.remaining_text.0')}
              style={{ fontSize: 13, lineHeight: 17 }}
            />
          </View>
          <View style={{ flexDirection: 'row', marginRight: '5%' }}>
            <InformationCircle />
            <P1Text
              label={t('dashboard.remaining_text.1')}
              style={{ fontSize: 13, lineHeight: 17 }}
            />
          </View>
        </View>
        {!focusing && (
          <SubmitButton
            title={t('dashboard_label.remaining_withdraw')}
            style={{
              position: 'absolute',
              bottom: 0,
              marginBottom: 10,
              width: '100%',
              marginLeft: 'auto',
              marginRight: 'auto',
              marginTop: 10,
              backgroundColor: '#3679B5',
            }}
            handler={() => {
              if (checkWithdrawInput()) {
                refundLegacyWallet();
                props.switchingHandler();
              }
            }}
          />
        )}
      </View>
    </View>
  );
};

export default SliderWithdrawal;