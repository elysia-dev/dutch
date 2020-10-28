import React, { Children, FunctionComponent, useContext, useState } from 'react';
import { Dimensions, Image, View } from 'react-native';
import { isAddress } from 'web3-utils';
import { useNavigation } from '@react-navigation/native';
import styled from 'styled-components/native';
import i18n from '../../i18n/i18n';
import { P1Text, TitleText, P3Text, H2Text, P2Text } from '../../shared/components/Texts';
import AccountLayout from '../../shared/components/AccountLayout';
import { SubmitButton } from '../../shared/components/SubmitButton';
import { TextField } from '../../shared/components/TextField';
import { BackButton } from '../../shared/components/BackButton';
import RootContext from '../../contexts/RootContext';
import { Modal } from '../../shared/components/Modal';

interface Props {
  resetHandler: () => void;
}

type State = {
  address: string;
  error: number;
  localeTerms?: string;
  firstModal: boolean;
  confirmModal: boolean;
}

const BlueCircle = styled.View`
 width: 10px;
height: 10px;
border-radius: 5px;
background-color: #3679B5;
margin-right: 10px;
`;

const RegisterEthAddress: FunctionComponent<Props> = (props: Props) => {
  const [state, setState] = useState<State>({
    address: "",
    error: 0,
    firstModal: true,
    confirmModal: false,
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
      setState({ ...state, confirmModal: true });
    }).catch(() => {
      alert(i18n.t('account_errors.server'));
    });
  };

  const hasAddress = user.ethAddresses?.length > 0;

  return (
    <>
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
                    ...state,
                    address: input,
                    error: isAddress(input) ? 0 : 1,
                  });
                }}
                placeHolder="0x"
              />
              <P3Text label={terms[user.language]} style={{ marginTop: 30 }} />
              <Modal visible={state.firstModal}
                modalHandler={() => setState({ ...state, firstModal: false })}
                child={
                  <View style={{ width: "100%", padding: 15 }}>
                    <H2Text label={i18n.t('more.check')} style={{ textAlign: 'center', marginBottom: 3 }} />
                    <P3Text label={i18n.t('more.check_text')} style={{ color: "#626368", textAlign: 'center' }} />
                    <View style={{ width: Dimensions.get("window").width * 0.9 - 40, height: 100, flexDirection: "column", padding: 15, backgroundColor: "#F6F6F8", borderRadius: 10, marginTop: 20, marginBottom: 60 }}>
                      <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
                        <BlueCircle />
                        <P3Text label={i18n.t('more.check_1')} style={{ color: "#1C1C1C" }} />
                      </View>
                      <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
                        <BlueCircle />
                        <P3Text label={i18n.t('more.check_2')} style={{ color: "#1C1C1C" }} />
                      </View>
                    </View>
                    <SubmitButton title={i18n.t('more_label.connect')} handler={() => setState({ ...state, firstModal: false })} style={{ width: Dimensions.get("window").width * 0.9 - 40, marginLeft: 0, marginRight: 0, alignSelf: 'center' }} />
                  </View>
                }
              />
              <Modal visible={state.confirmModal}
                modalHandler={() => {
                  setState({ ...state, confirmModal: false });
                  navigation.goBack();
                }}
                child={
                  <View style={{ width: "100%", padding: 15 }}>
                    <Image source={require('./images/check.png')} style={{ marginLeft: 'auto', marginRight: 'auto' }}></Image>
                    <H2Text label={i18n.t('more.connected')} style={{ marginTop: 10 }} />
                    <P2Text label={i18n.t('more.find_more')} style={{ color: "#626368", textAlign: 'center', top: 5, marginBottom: 40 }} />
                  </View>
                }
              />
            </>
            )
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
      {(state.firstModal || state.confirmModal) && (
        <View
          style={{
            backgroundColor: 'rgba(0,0,0,0.5)',
            position: 'absolute',
            width: '100%',
            height: '100%',
          }}></View>
      )}
    </>
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
  zhHans: `请输入您知道正确私钥的以太坊钱包地址。
（例如，Metamask钱包地址。）
如果输入的是中心化平台的钱包地址，在交换代币后，您可能无法获得相应代币的所有权。
（中心化平台的钱包是指通过中心化交易所、中心化式钱包等提供存币服务的钱包。）
我们想再次提醒您，您需要自行承担输入错误的钱包地址而产生的损失。
请务必再次检查以下两项：
-这是一个以太坊钱包地址吗？
-您知道该以太坊钱包地址的私钥吗？`,
};

export default RegisterEthAddress;
