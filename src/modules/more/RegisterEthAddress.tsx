import React, {
  FunctionComponent,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  Image,
  View,
  AppState,
  AppStateStatus,
  TouchableOpacity,
  Pressable,
  Share,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Linking from 'expo-linking';
import * as Haptics from 'expo-haptics';
import Clipboard from 'expo-clipboard';
import { useTranslation } from 'react-i18next';

import { DAPP_URL, ETH_NETWORK } from 'react-native-dotenv';
import {
  P1Text,
  TitleText,
  P3Text,
  H2Text,
  P2Text,
  H3Text,
} from '../../shared/components/Texts';
import AccountLayout from '../../shared/components/AccountLayout';
import { SubmitButton } from '../../shared/components/SubmitButton';
import { BackButton } from '../../shared/components/BackButton';
import { Modal } from '../../shared/components/Modal';
import WalletType from '../../enums/WalletType';
import commaFormatter from '../../utiles/commaFormatter';
import storeDeeplink from '../../utiles/storeDeeplink';
import { SignInStatus } from '../../enums/SignInStatus';
import ProviderType from '../../enums/ProviderType';
import UserContext from '../../contexts/UserContext';
import { getToken, setToken } from '../../asyncStorages/token';
import { getRequestId, setRequestId } from '../../asyncStorages/reqeustId';
import createGuestAndRegisterAddress from '../../utiles/createGuestAndRegisterAddress';
import { Page } from '../../enums/pageEnum';
import PreferenceContext from '../../contexts/PreferenceContext';
import LocaleType from '../../enums/LocaleType';
import PriceContext from '../../contexts/PriceContext';
import AppColors from '../../enums/AppColors';

interface Props {
  resetHandler: () => void;
}

type State = {
  localeTerms?: string;
  confirmModal: boolean;
  balance: string | undefined;
  pressed: boolean;
  wallet: string;
};

type ButtonProps = {
  title: string;
  selected: boolean;
  modeHandler: () => void;
  type: string;
};

const buttonImage = (type: string) => {
  switch (type) {
    case WalletType.METAMASK_MOBILE:
      return require('./images/metamask_icon.png');
    case WalletType.METAMASK_PC:
      return require('./images/metamask_pc.png');
    case WalletType.IMTOKEN_MOBILE:
      return require('./images/imToken_logo.png');
    case WalletType.ELYSIA:
      return require('./images/eth.png');
    default:
  }
};

const WalletButton: FunctionComponent<ButtonProps> = (props: ButtonProps) => {
  return (
    <TouchableOpacity
      onPress={props.modeHandler}
      style={{
        width: '90%',
        marginLeft: '5%',
        height: 50,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: props.selected ? '#3679B5' : '#D0D8DF',
        paddingVertical: 15,
        paddingHorizontal: 25,
        flexDirection: 'row',
        marginBottom: 15,
      }}>
      <Image
        style={{ alignSelf: 'center', width: 30, height: 30 }}
        source={buttonImage(props.type)}></Image>
      <P1Text
        style={{
          flex: 5,
          fontSize: 14,
          paddingLeft: 10,
          paddingRight: 30,
          fontWeight: props.selected ? 'bold' : 'normal',
          color: AppColors.BLACK,
          textAlign: 'center',
          alignSelf: 'center',
        }}
        label={props.title}
      />
    </TouchableOpacity>
  );
};

const RegisterEthAddress: FunctionComponent<Props> = (props: Props) => {
  const { user, Server, setEthAddress, signOut, signIn } =
    useContext(UserContext);
  const { elPrice } = useContext(PriceContext);
  const { currencyFormatter } = useContext(PreferenceContext);
  const { t } = useTranslation();
  const { language } = useContext(PreferenceContext);

  const [state, setState] = useState<State>({
    confirmModal: false,
    balance: undefined,
    pressed: false,
    wallet: '',
  });

  const appStateRef = useRef(AppState.currentState);

  const navigation = useNavigation();

  const userBalance = (address?: string) => {
    Server.getBalance(address || user.ethAddresses[0])
      .then((res) => {
        setState({ ...state, balance: res.data.result });
      })
      .catch((e) => {
        if (e.response.status === 500) {
          alert(t('account_errors.server'));
        }
      });
  };

  const callApi = async (type: string) => {
    const token = await getToken();

    if (!token) {
      const res = await createGuestAndRegisterAddress(
        language || LocaleType.EN,
      );
      setRequestId(res.requestId);
      openExternalWallet(type, res.requestId);
      signIn();
    } else {
      const requestId = (await Server.requestEthAddressRegister()).data.id;
      setRequestId(requestId);
      openExternalWallet(type, requestId);
    }
  };

  const openExternalWallet = (type: string, requestId: string) => {
    if (type === 'metamask') {
      Linking.openURL(
        `https://metamask.app.link/dapp/${DAPP_URL}/ethAddress/${requestId}`,
      ).catch((_e) => {
        storeDeeplink('metamask/id1438144202', 'io.metamask');
      });
    } else if (type === 'imtoken') {
      Linking.openURL(
        `imtokenv2://navigate?screen=DappView&url=https://${DAPP_URL}/ethAddress/${requestId}`,
      ).catch((_e) => {
        storeDeeplink('imtoken-btc-eth-wallet/id1384798940', 'im.token.app');
      });
    }
  };

  const copyLink = () => {
    Server.requestEthAddressRegister()
      .then((res) => {
        const url = `https://${DAPP_URL}/ethAddress/${res.data.id}`;
        Clipboard.setString(url);
        alert(t('more_label.copied', { url }));
      })
      .catch((e) => {
        alert(t('account_errors.server'));
      });
  };

  const checkGuestUserInfo = async () => {
    const requestId = await getRequestId();

    if (requestId) {
      Server.checkEthAddressRegisteration(requestId)
        .then(async (res) => {
          if (res.data.status === 'success' && res.data.token) {
            await setToken(res.data.token);
            signIn();
          }
        })
        .catch((e) => {
          if (e.response.status === 500) {
            alert(t('account_errors.server'));
          }
        });
    }
  };

  const checkUserInfo = () => {
    Server.me()
      .then((res) => {
        if (res.data.user.ethAddresses?.length > 0) {
          setEthAddress(res.data.user.ethAddresses[0]);
          userBalance(res.data.user.ethAddresses[0]);
        }
      })
      .catch((e) => {
        if (e.response.status === 500) {
          alert(t('account_errors.server'));
        }
      });
  };

  const handleAppStateChange = (nextAppState: AppStateStatus) => {
    if (appStateRef.current !== 'active' && nextAppState === 'active') {
      if (!(user.ethAddresses?.length > 0)) {
        if (user.provider === ProviderType.GUEST) {
          checkGuestUserInfo();
        } else {
          checkUserInfo();
        }
      }
    }
    appStateRef.current = nextAppState;
    // setAppState(appStateRef.current);
  };

  useEffect(() => {
    AppState.addEventListener('change', handleAppStateChange);

    if (user.ethAddresses?.length > 0 && !state.balance) {
      userBalance();
    }

    return () => {
      AppState.removeEventListener('change', handleAppStateChange);
    };
  }, []);

  useEffect(() => {
    if (user.ethAddresses?.length > 0) {
      userBalance(user.ethAddresses[0]);
    }
  }, [user]);

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
                  ? t('more_label.my_wallet')
                  : t('more_label.wallet_connect')
              }
            />
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
                  shadowColor: AppColors.SHADOW_BLACK2,
                  shadowOffset: { width: 1, height: 2 },
                  shadowOpacity: 0.7,
                  shadowRadius: 4,
                  backgroundColor: AppColors.WHITE,
                  flexDirection: 'column',
                  padding: 20,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                  }}>
                  <TouchableOpacity
                    onPress={() => {
                      setState({ ...state, balance: undefined });
                      userBalance();
                    }}
                    style={{
                      width: 40,
                      height: 40,
                      backgroundColor: AppColors.WHITE,
                      elevation: 2,
                      borderRadius: 21,
                      shadowColor: AppColors.SHADOW_BLACK2,
                      shadowOffset: { width: 0, height: 1 },
                      shadowOpacity: 0.6,
                      shadowRadius: 2,
                      justifyContent: 'center',
                      marginRight: 8,
                    }}>
                    <Image
                      style={{
                        width: 26,
                        height: 26,
                        alignSelf: 'center',
                        resizeMode: 'cover',
                      }}
                      source={require('./images/elysia_blue_logo.png')}
                    />
                  </TouchableOpacity>
                  <H3Text
                    label={ETH_NETWORK === 'mainnet' ? 'EL' : 'KEL'}
                    style={{
                      flex: 3,
                      marginTop: 9,
                    }}
                  />
                  <View style={{ flexDirection: 'column', flex: 4 }}>
                    <H3Text
                      style={{ marginTop: 9, textAlign: 'right' }}
                      label={`${
                        state.balance
                          ? commaFormatter(
                              (parseFloat(state.balance) / 10 ** 18).toFixed(3),
                            )
                          : '-.--'
                      }`}
                    />
                    <P3Text
                      style={{
                        color: '#7A7D8D',
                        marginTop: 8,
                        textAlign: 'right',
                      }}
                      label={`= ${
                        state.balance
                          ? currencyFormatter(
                              (elPrice * parseFloat(state.balance)) / 10 ** 18,
                              2,
                            )
                          : '$ -.--'
                      }`}
                    />
                  </View>
                </View>
                <View
                  style={{
                    width: '100%',
                    height: 110,
                    backgroundColor: AppColors.BACKGROUND_GREY,
                    borderRadius: 10,
                    borderColor: AppColors.GREY,
                    borderWidth: 2,
                    marginTop: 30,
                    padding: 15,
                  }}>
                  <P1Text
                    label={'Address'}
                    style={{ color: AppColors.BLACK2 }}
                  />
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
            <View />
          )
        }
        button={
          // eslint-disable-next-line no-nested-ternary
          user.ethAddresses?.length > 0 ? (
            user.provider === ProviderType.ETH ? (
              <SubmitButton
                title={t('more_label.disconnect_and_new')}
                handler={() => {
                  return Alert.alert(
                    t('more_label.disconnect'),
                    t('more.confirm_disconnect_and_new'),
                    [
                      {
                        text: 'Cancel',
                        onPress: () => {},
                        style: 'cancel',
                      },
                      {
                        text: 'OK',
                        onPress: () => {
                          signOut(SignInStatus.SIGNOUT);
                        },
                        style: 'default',
                      },
                    ],
                    { cancelable: false },
                  );
                }}
              />
            ) : (
              <></>
            )
          ) : (
            <>
              {user.provider === ProviderType.GUEST && (
                <WalletButton
                  title={'Ethereum Wallet'}
                  selected={state.wallet === WalletType.ELYSIA}
                  modeHandler={() => {
                    setState({ ...state, wallet: WalletType.ELYSIA });
                    navigation.navigate(Page.Wallet);
                  }}
                  type={WalletType.ELYSIA}
                />
              )}
              <WalletButton
                title={'MetaMask'}
                selected={state.wallet === WalletType.METAMASK_MOBILE}
                modeHandler={() => {
                  setState({ ...state, wallet: WalletType.METAMASK_MOBILE });
                  callApi('metamask');
                }}
                type={WalletType.METAMASK_MOBILE}
              />
              <WalletButton
                title={'imToken'}
                selected={state.wallet === WalletType.IMTOKEN_MOBILE}
                modeHandler={() => {
                  setState({ ...state, wallet: WalletType.IMTOKEN_MOBILE });
                  callApi('imtoken');
                }}
                type={WalletType.IMTOKEN_MOBILE}
              />
              <WalletButton
                title={'Copy Link'}
                selected={state.wallet === WalletType.METAMASK_PC}
                modeHandler={() => {
                  setState({ ...state, wallet: WalletType.METAMASK_PC });
                  copyLink();
                }}
                type={WalletType.METAMASK_PC}
              />
            </>
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
            <H2Text label={t('more.connected')} style={{ marginTop: 10 }} />
            <P2Text
              label={t('more.find_more')}
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

export default RegisterEthAddress;
