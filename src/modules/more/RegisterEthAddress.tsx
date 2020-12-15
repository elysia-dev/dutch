import React, {
  FunctionComponent,
  useContext,
  useEffect,
  useState,
} from 'react';
import {
  Dimensions,
  Image,
  View,
  AppState,
  AppStateStatus,
  TouchableOpacity,
  Pressable,
  Share,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styled from 'styled-components/native';
import * as Linking from 'expo-linking';
import * as Haptics from 'expo-haptics';
import i18n from '../../i18n/i18n';

import {
  P1Text,
  TitleText,
  P3Text,
  H2Text,
  P2Text,
} from '../../shared/components/Texts';
import AccountLayout from '../../shared/components/AccountLayout';
import { SubmitButton } from '../../shared/components/SubmitButton';
import { BackButton } from '../../shared/components/BackButton';
import RootContext from '../../contexts/RootContext';
import { Modal } from '../../shared/components/Modal';
import MetamaskFox from './images/metamask_logo.png';
import getEnvironment from '../../utiles/getEnvironment';

interface Props {
  resetHandler: () => void;
}

type State = {
  localeTerms?: string;
  confirmModal: boolean;
  balance: string | undefined;
  pressed: boolean;
};

const BlueCircle = styled.View`
  width: 10px;
  height: 10px;
  border-radius: 5px;
  background-color: #3679b5;
  margin-right: 10px;
`;

const RegisterEthAddress: FunctionComponent<Props> = (props: Props) => {
  const { Server, setEthAddress, user } = useContext(RootContext);

  const [state, setState] = useState<State>({
    confirmModal: false,
    balance: undefined,
    pressed: false,
  });

  const [appState, setAppState] = useState<AppStateStatus>(
    AppState.currentState,
  );

  const navigation = useNavigation();

  const userBalance = (address?: string) => {
    Server.getBalance(address || user.ethAddresses[0])
      .then((res) => {
        setState({ ...state, balance: res.data.result });
      })
      .catch((e) => {
        if (e.response.status === 500) {
          alert(i18n.t('account_errors.server'));
        }
      });
  };

  const callApi = () => {
    Server.requestEthAddressRegister()
      .then((res) => {
        Linking.openURL(
          `https://metamask.app.link/dapp/${
            getEnvironment().dappUrl
          }/ethAddress/${res.data.id}`,
        );
      })
      .catch((e) => {
        alert(i18n.t('account_errors.server'));
      });
  };

  useEffect(() => {
    AppState.addEventListener('change', () =>
      setAppState(AppState.currentState),
    );
    if (user.ethAddresses?.length > 0 && !state.balance) {
      userBalance();
    }
  }, []);

  useEffect(() => {
    if (appState === 'active' || !(user.ethAddresses?.length > 0)) {
      Server.me()
        .then((res) => {
          if (res.data.user.ethAddresses?.length > 0) {
            setEthAddress(res.data.user.ethAddresses[0]);
            userBalance(res.data.user.ethAddresses[0]);
          }
        })
        .catch((e) => {
          if (e.response.status === 500) {
            alert(i18n.t('account_errors.server'));
          }
        });
    }
  }, [appState]);

  return (
    <>
      <AccountLayout
        title={
          <>
            <BackButton handler={() => navigation.goBack()} />
            <TitleText
              style={{ paddingTop: 10 }}
              label={
                user.ethAddresses?.length > 0
                  ? i18n.t('more_label.my_wallet')
                  : i18n.t('more_label.wallet_connect')
              }
            />
            {!(user.ethAddresses?.length > 0) && (
              <P3Text
                label={i18n.t('more.check_text')}
                style={{ color: '#626368', textAlign: 'left', marginTop: 10 }}
              />
            )}
          </>
        }
        body={
          user.ethAddresses?.length > 0 ? (
            <>
              <View
                style={{
                  width: '100%',
                  height: 240,
                  borderRadius: 10,
                  elevation: 6,
                  shadowColor: '#1C1C1C4D',
                  shadowOffset: { width: 1, height: 2 },
                  shadowOpacity: 0.7,
                  shadowRadius: 4,
                  backgroundColor: '#fff',
                  flexDirection: 'column',
                  padding: 20,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <View style={{ flexDirection: 'column' }}>
                    <P1Text
                      style={{ color: '#7A7D8D' }}
                      label={i18n.t('more_label.metamask_wallet')}
                    />
                    <H2Text
                      style={{ marginTop: 5 }}
                      label={`EL ${
                        state.balance
                          ? (parseFloat(state.balance) / 10 ** 18).toFixed(2)
                          : '-.--'
                      }`}
                    />
                  </View>
                  <TouchableOpacity
                    onPress={() => {
                      setState({ ...state, balance: undefined });
                      userBalance();
                    }}
                    style={{
                      width: 54,
                      height: 54,
                      backgroundColor: '#fff',
                      elevation: 2,
                      borderRadius: 27,
                      shadowColor: '#1C1C1C4D',
                      shadowOffset: { width: 0, height: 1 },
                      shadowOpacity: 0.6,
                      shadowRadius: 2,
                      justifyContent: 'center',
                    }}>
                    <Image
                      style={{ width: 30, height: 29, alignSelf: 'center' }}
                      source={require('./images/metamask_logo.png')}
                    />
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    width: '100%',
                    height: 110,
                    backgroundColor: '#F6F6F8',
                    borderRadius: 10,
                    borderColor: '#F1F1F1',
                    borderWidth: 2,
                    marginTop: 30,
                    padding: 15,
                  }}>
                  <P1Text label={'Address'} style={{ color: '#838383' }} />

                  <Pressable
                    onPressIn={(_nativeEvent) => {
                      setState({ ...state, pressed: true });
                    }}
                    onPressOut={(_nativeEvent) => {
                      setState({ ...state, pressed: false });
                    }}
                    style={{
                      marginTop: 10,
                      backgroundColor: state.pressed
                        ? 'rgba(0,0,0,0.07)'
                        : 'rgba(0,0,0,0)',

                      borderRadius: 10,
                    }}
                    pressRetentionOffset={{
                      bottom: 30,
                      left: 20,
                      right: 20,
                      top: 20,
                    }}
                    onLongPress={(_nativeEvent) => {
                      if (user.ethAddresses?.length > 0) {
                        Share.share({
                          message: user.ethAddresses[0],
                        });
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
                      }
                    }}>
                    <P1Text
                      style={{
                        alignSelf: 'center',
                        alignItems: 'center',
                        textDecorationLine: 'underline',
                      }}
                      label={
                        user.ethAddresses?.length > 0
                          ? user.ethAddresses[0]
                          : ''
                      }
                    />
                  </Pressable>
                </View>
              </View>
            </>
          ) : (
            <View
              style={{
                width: '100%',
                alignItems: 'center',
                display: 'flex',
                alignSelf: 'center',
                marginTop: Dimensions.get('window').height * 0.1,
              }}>
              <Image
                source={MetamaskFox}
                style={{
                  marginLeft: 'auto',
                  marginRight: 'auto',
                }}></Image>
              <View
                style={{
                  width: Dimensions.get('window').width * 0.9,
                  height: 100,
                  flexDirection: 'column',
                  padding: 15,
                  backgroundColor: '#F6F6F8',
                  borderRadius: 10,
                  marginTop: 20,
                  marginBottom: 25,
                }}>
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <BlueCircle />
                  <P3Text
                    label={i18n.t('more.check_1')}
                    style={{ color: '#1C1C1C' }}
                  />
                </View>
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <BlueCircle />
                  <P3Text
                    label={i18n.t('more.check_2')}
                    style={{ color: '#1C1C1C' }}
                  />
                </View>
              </View>
            </View>
          )
        }
        button={
          user.ethAddresses?.length > 0 ? (
            <></>
          ) : (
            <SubmitButton
              title={i18n.t('more_label.connect')}
              handler={callApi}
              style={{
                width: Dimensions.get('window').width * 0.9,
                marginLeft: 0,
                marginRight: 0,
                alignSelf: 'center',
              }}
            />
          )
        }
      />
      {state.confirmModal && (
        <View
          style={{
            backgroundColor: 'rgba(0,0,0,0.5)',
            position: 'absolute',
            width: '100%',
            height: '100%',
          }}></View>
      )}
      <Modal
        visible={state.confirmModal}
        modalHandler={() => {
          setState({ ...state, confirmModal: false });
          navigation.goBack();
        }}
        child={
          <View style={{ width: '100%', padding: 15 }}>
            <Image
              source={require('./images/check.png')}
              style={{
                marginLeft: 'auto',
                marginRight: 'auto',
              }}></Image>
            <H2Text
              label={i18n.t('more.connected')}
              style={{ marginTop: 10 }}
            />
            <P2Text
              label={i18n.t('more.find_more')}
              style={{
                color: '#626368',
                textAlign: 'center',
                top: 5,
                marginBottom: 40,
              }}
            />
          </View>
        }
      />
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
