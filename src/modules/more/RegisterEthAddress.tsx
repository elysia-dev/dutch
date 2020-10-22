import React, { FunctionComponent, useContext, useState } from 'react';
import { isAddress } from 'web3-utils';
import { useNavigation } from '@react-navigation/native';
import { Text } from 'react-native';
import i18n from '../../i18n/i18n';
import { P1Text, TitleText, P3Text } from '../../shared/components/Texts';
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
          <TitleText
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
          <P1Text label={user.ethAddresses[0]} />
          : (<>
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
          <P3Text label={terms.ko} style={{ marginTop: 30 }}/>
          </>)
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

const terms = {
ko: `본인이 해당 주소의 프라이빗 키를 정확이 알고 있는 이더리움 지갑 주소만 입력해주시기 바랍니다.
(예를 들어, 메타마스크 내 지갑 주소)

중앙화 플랫폼의 지갑 주소 입력 시 토큰 교환 후 해당 토큰들의 권한을 갖지 못할 수 있습니다. 
(중앙화 플랫폼의 지갑이란, 중앙화 거래소, 중앙화 지갑 서비스 등에서 제공하는 입금용 지갑 주소 등을 의미합니다.)

잘못된 주소 입력으로 인한 책임은 전적으로 사용자 본인에게 있음을 한 번 더 알려 드립니다.

필수 확인 사항
- 이더리움 지갑 주소인가요?
- 본인이 프라이빗 키를 정확히 알고 있는 주소인가요?`,
};

export default RegisterEthAddress;
