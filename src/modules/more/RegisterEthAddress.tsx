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
import LocaleType from '../../enums/LocaleType';

interface Props {
  resetHandler: () => void;
}

type State = {
  address: string;
  error: number;
  localeTerms?: string;
}

const RegisterEthAddress: FunctionComponent<Props> = (props: Props) => {
  const [state, setState] = useState<State>({
    address: "",
    error: 0,
    localeTerms: "",
  });

  const navigation = useNavigation();

  const {
    Server,
    setEthAddress,
    user,
    locale,
  } = useContext(RootContext);

  switch (locale) {
    case LocaleType.KO:
      state.localeTerms = terms[LocaleType.KO];
      break;
    case LocaleType.CH:
      state.localeTerms = terms[LocaleType.CH];
      break;
    default:
      state.localeTerms = terms[LocaleType.EN];
      break;
  }

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
          <P3Text label={state.localeTerms} style={{ marginTop: 30 }}/>
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
en: `Please enter only the Ethereum wallet address where you know the exact private key of the address.
(e.g. metamask my wallet address)

When entering the wallet address of the centralization platform, you may not have permission for these tokens after exchanging them.
(The wallet on the centralization platform means the wallet address for deposit provided by the centralization exchange, centralization wallet service, etc.)

I'd like to remind you once again that you are solely responsible for entering the wrong address.

Required Checkpoints
- Is this Ethereum's address?
- Do you know the exact private key?`,
zhHans: `请仅输入您知道该地址正确私钥的以太坊钱包地址。
（例如，Metamask中的钱包地址）

输入集中式平台的钱包地址时，令牌交换后，您可能无法获得相应令牌的权限。
（集中平台的钱包是指通过集中交易所，集中式钱包服务等提供的存款的钱包地址。）

我们想再次提醒您，您应自行负责输入错误的地址。

必需的检查点
-这是一个以太坊钱包地址吗？
-您正确知道私钥的地址吗？`,
};

export default RegisterEthAddress;
