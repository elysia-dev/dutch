import React, { FunctionComponent, useState } from 'react';
import { View } from 'react-native';
import { TextField } from '../../shared/components/TextField';
import { BackButton } from '../../shared/components/BackButton';
import { SubmitButton } from '../../shared/components/SubmitButton';
import { H1Text } from '../../shared/components/H1Text';
import styled from 'styled-components/native';
import i18n from '../../i18n/i18n';
import { useNavigation } from '@react-navigation/native';
import AccountLayout from '../../shared/components/AccountLayout';
import ValidationMessage from '../../shared/components/ValidationMessage';
import checkPassword from '../../utiles/checkPassword';

interface Iprops {
  email?: string;
  submitHandler: (password: string) => void;
  submitButtonTitle: string;
  message1: string;
  message2: string;
}

const PasswordForm: FunctionComponent<Props> = (props: Props) => {
  const [state, setState] = useState({
    step: 1,
    password: '',
    passwordConfirmation: '',
    errorLength: 0,
    errorReg: 0,
  });

  const navigation = useNavigation();

  return (
    <AccountLayout
      title={
        <>
          <BackButton
            handler={() => {
              state.step == 2
                ? setState({
                    ...state,
                    step: 1,
                    passwordConfirmation: '',
                    errorLength: 0,
                    errorReg: 0,
                  })
                : navigation.goBack();
            }}
          />
          <H1Text label={state.step == 1 ? props.message1 : props.message2} />
        </>
      }
      body={
        <>
          {state.step == 2 && (
            <>
              <TextField
                label={i18n.t('account_label.account_password_confirm')}
                eventHandler={(input: string) => {
                  setState({
                    ...state,
                    passwordConfirmation: input,
                    errorLength: input !== state.password ? 2 : 0,
                  });
                }}
                secure={true}
                helperText={
                  state.step == 2 && state.errorLength == 2
                    ? i18n.t('errors.messages.password_do_not_match')
                    : undefined
                }
                helperIcon={
                  state.step == 2 && state.errorLength == 2
                    ? 'Error'
                    : undefined
                }
              />
            </>
          )}
          <TextField
            label={i18n.t('account_label.account_password')}
            editable={state.step === 1}
            eventHandler={(input: string) => {
              setState({
                ...state,
                password: input,
                errorLength: input.length < 8 ? 1 : 0,
                errorReg: checkPassword(input) ? 0 : 1,
              });
            }}
            helperText={
              state.errorLength == 1
                ? i18n.t('errors.messages.password_too_short')
                : state.errorLength == 0 && state.errorReg == 1
                ? i18n.t('errors.messages.simple_password')
                : undefined
            }
            helperIcon={
              state.errorLength == 1 || state.errorReg == 1
                ? 'Error'
                : undefined
            }
            value={state.step == 2 ? state.password : ''}
            secure={true}
          />
          {props.email && (
            <TextField
              label={i18n.t('account_label.account_email')}
              editable={false}
              eventHandler={() => {}}
              value={props.email}
            />
          )}
        </>
      }
      button={
        <>
          {state.step == 1 ? (
            <SubmitButton
              title={i18n.t('account_label.continue')}
              handler={() => {
                if (state.password.length < 8) {
                  alert(i18n.t('errors.messages.password_too_short'));
                  return;
                }
                setState({ ...state, step: 2 });
              }}
              disabled={state.errorLength !== 0 || state.errorReg !== 0}
              variant={
                state.errorLength === 1 || state.errorReg === 1
                  ? 'GrayTheme'
                  : undefined
              }
            />
          ) : (
            <SubmitButton
              title={props.submitButtonTitle}
              handler={() => props.submitHandler(state.password)}
              disabled={
                !state.passwordConfirmation ||
                state.errorLength !== 0 ||
                state.errorReg !== 0
              }
              variant={
                !state.passwordConfirmation ||
                state.errorLength !== 0 ||
                state.errorReg !== 0
                  ? 'GrayTheme'
                  : undefined
              }
            />
          )}
        </>
      }
    />
  );
};

export default PasswordForm;
