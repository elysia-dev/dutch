import React, { FunctionComponent, useContext, useState } from 'react';
import { isAddress } from 'web3-utils';
import { useNavigation } from '@react-navigation/native';
import { Text } from 'react-native';
import i18n from '../../i18n/i18n';
import { H1Text } from '../../shared/components/H1Text';
import AccountLayout from '../../shared/components/AccountLayout';
import { SubmitButton } from '../../shared/components/SubmitButton';
import { TextField } from '../../shared/components/TextField';
import { BackButton } from '../../shared/components/BackButton';
import RootContext from '../../contexts/RootContext';

interface Props {
  resetHandler: () => void;
}

type State = {
  address: string;
  error: number;
}

const RegisterEthAddress: FunctionComponent<Props> = (props: Props) => {
  const [state, setState] = useState<State>({
    address: "",
    error: 0,
  });

  const navigation = useNavigation();

  const {
    Server,
    setEthAddress,
    user,
  } = useContext(RootContext);

  const callApi = () => {
    Server.registerAddress(state.address).then(() => {
      setEthAddress(state.address);
    }).catch(() => {
      alert(i18n.t('account_errors.server'));
    });
  };

  const hasAddress = user.ethAddresses?.length > 0;

  return (
    <AccountLayout
      title={
        <>
          <BackButton handler={() => navigation.goBack()} />
          <H1Text
            style={{ paddingTop: 20 }}
            label={
              hasAddress
                ? i18n.t('account.already_insert_ethaddress')
                : i18n.t('account.insert_ethaddress')
            }
          />
        </>
      }
      body={
        hasAddress ?
          <Text>{user.ethAddresses[0]}</Text>
          :
          <TextField
            label={i18n.t('account_label.ethaddress')}
            eventHandler={(input: string) => {
              setState({
                address: input,
                error: isAddress(input) ? 0 : 1,
              });
            }}
            placeHolder="0x"
          />
      }
      button={
        hasAddress
          ? <></>
          : <SubmitButton
            disabled={hasAddress}
            title={
              state.error === 1
                ? i18n.t('account_errors.ethaddress')
                : i18n.t('account.submit_ethaddress')
            }
            handler={
              state.error === 1
                ? () => { }
                : () => callApi()
            }
            variant={
              state.error === 1 || hasAddress
                ? 'GrayTheme'
                : undefined
            }
          />
      }
    />
  );
};

export default RegisterEthAddress;
