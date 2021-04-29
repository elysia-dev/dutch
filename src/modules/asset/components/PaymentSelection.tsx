import {
  useNavigation,
} from '@react-navigation/native';
import React, {
  FunctionComponent,
  useContext,
  useEffect,
  useState,
} from 'react';
import { View, Image, Text } from 'react-native';
import {
  TouchableOpacity,
} from 'react-native-gesture-handler';
import * as Linking from 'expo-linking';
import { useTranslation } from 'react-i18next';
import { H3Text, H4Text } from '../../../shared/components/Texts';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SubmitButton } from '../../../shared/components/SubmitButton';
import getEnvironment from '../../../utiles/getEnvironment';
import useAppState from '../../../hooks/useAppState';
import WalletType from '../../../enums/WalletType';
import storeDeeplink from '../../../utiles/storeDeeplink';
import ProviderType from '../../../enums/ProviderType';
import { TextField } from '../../../shared/components/TextField';
import UserContext from '../../../contexts/UserContext';
import AppColors from '../../../enums/AppColors';
import SheetHeader from '../../../shared/components/SheetHeader';

type ButtonProps = {
  title: string;
  selected: boolean;
  modeHandler: () => void;
  type: string;
};

const buttonImage = (type: string, selected: boolean) => {
  switch (type) {
    case WalletType.METAMASK_MOBILE:
      return selected
        ? require('../images/selected_mobile.png')
        : require('../images/mobile.png');
    case WalletType.METAMASK_PC:
      return selected
        ? require('../images/selected_desktop.png')
        : require('../images/desktop.png');
    case WalletType.IMTOKEN_MOBILE:
      return selected
        ? require('../images/selected_imtoken.png')
        : require('../images/imtoken.png');
    default:
  }
};

const MetaMaskButton: FunctionComponent<ButtonProps> = (props: ButtonProps) => {
  return (
    <TouchableOpacity
      onPress={props.modeHandler}
      style={{
        width: '100%',
        height: 50,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: props.selected ? '#3679B5' : '#D0D8DF',
        padding: 15,
        flexDirection: 'row',
        marginBottom: 15,
      }}>
      <Image
        style={{ alignSelf: 'center' }}
        source={buttonImage(props.type, props.selected)}></Image>
      <Text
        style={{
          flex: 5,
          fontSize: 14,
          paddingLeft: 10,
          fontWeight: props.selected ? 'bold' : 'normal',
          color: '#1C1C1C',
          alignSelf: 'center',
        }}>
        {props.title}
      </Text>
      {props.selected && (
        <Image
          style={{ alignSelf: 'center' }}
          source={require('../images/bluebuttoncheck.png')}></Image>
      )}
    </TouchableOpacity>
  );
};

const PaymentSelection: React.FC<{ espressTxId: string }> = ({ espressTxId }) => {
  useEffect(() => { }, []);
  const navigation = useNavigation();
  const [state, setState] = useState({
    wallet: '',
    emailRestriction: false,
    email: '',
  });
  const { wallet, emailRestriction, email } = state;
  const { user, Server, refreshUser } = useContext(UserContext);
  const { t } = useTranslation();

  const appState = useAppState();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (appState === 'active' && espressTxId) {
      Server.getTransactionRequest(espressTxId).catch(async () => {
        await refreshUser();
        navigation.goBack();
      });
    }
  }, [appState]);

  const linkDapp = () => {
    switch (wallet) {
      case WalletType.IMTOKEN_MOBILE:
        Linking.openURL(
          `imtokenv2://navigate?screen=DappView&url=https://${getEnvironment().dappUrl
          }/requests/${espressTxId}`,
        ).catch((_e) => {
          storeDeeplink('imtoken-btc-eth-wallet/id1384798940', 'im.token.app');
        });
        navigation.goBack();
        break;
      case WalletType.METAMASK_MOBILE:
        Linking.openURL(
          `https://metamask.app.link/dapp/${getEnvironment().dappUrl
          }/requests/${espressTxId}`,
        ).catch((_e) => {
          storeDeeplink('metamask/id1438144202', 'io.metamask');
        });
        navigation.goBack();
        break;
      case WalletType.METAMASK_PC:
        if (emailRestriction) {
          return alert(t('product.email_restriction'));
        }
        if (user.provider === ProviderType.ETH) {
          if (!email) {
            return alert(t('account.check_email'));
          } else {
            Server.sendEmailForTransaction(espressTxId, email)
              .then((_res) => {
                setState({ ...state, emailRestriction: true });
                alert(t('product.send_purchase_link'));
                setTimeout(() => {
                  setState({
                    ...state,
                    emailRestriction: false,
                  });
                  navigation.goBack()
                }, 30000);
              })
              .catch((e) => {
                if (e.response.status === 500) {
                  alert(t('account_errors.server'));
                }
              });
          }
        } else {
          Server.sendEmailForTransaction(espressTxId)
            .then((_res) => {
              setState({ ...state, emailRestriction: true });
              alert(t('product.send_purchase_link'));
              setTimeout(() => {
                setState({
                  ...state,
                  emailRestriction: false,
                });

                navigation.goBack()
              }, 30000);
            })
            .catch((e) => {
              if (e.response.status === 500) {
                alert(t('account_errors.server'));
              }
            });
        }
        break;
      default:
        alert(t('product.select_metamask'));
    }
  };

  return (
    <View
      style={{
        backgroundColor: '#fff',
        height: "100%"
      }}>
      <SheetHeader title={t('product.select_payment')} />
      <View
        style={{
          paddingLeft: 20,
          paddingRight: 20,
          backgroundColor: '#fff',
        }}>
        <View style={{ marginTop: 40 }}>
          <MetaMaskButton
            title={t('product.metamask_mobile')}
            type={WalletType.METAMASK_MOBILE}
            selected={wallet === WalletType.METAMASK_MOBILE}
            modeHandler={() =>
              setState({ ...state, wallet: WalletType.METAMASK_MOBILE })
            }
          />
          <MetaMaskButton
            title={t('product.metamask_pc')}
            type={WalletType.METAMASK_PC}
            selected={wallet === WalletType.METAMASK_PC}
            modeHandler={() =>
              setState({ ...state, wallet: WalletType.METAMASK_PC })
            }
          />
          {wallet === WalletType.METAMASK_PC && (
            <>
              {user.provider === ProviderType.ETH && (
                <TextField
                  eventHandler={(input: string) =>
                    setState({ ...state, email: input })
                  }
                  value={email}
                  label={t('account.insert_account_email')}
                  placeHolder={'* ' + t('product.link_will_be_sent')}
                />
              )}
            </>
          )}
          <MetaMaskButton
            title={t('product.imtoken_mobile')}
            type={WalletType.IMTOKEN_MOBILE}
            selected={wallet === WalletType.IMTOKEN_MOBILE}
            modeHandler={() =>
              setState({ ...state, wallet: WalletType.IMTOKEN_MOBILE })
            }
          />
        </View>
      </View>
      <View
        style={{
          position: 'absolute',
          width: '100%',
          bottom: insets.bottom || 10,
          paddingLeft: '5%',
          paddingRight: '5%'
        }}
      >
        <SubmitButton
          title={t('account_label.continue')}
          // eslint-disable-next-line no-nested-ternary
          style={{
            alignSelf: 'center',
            width: '100%',
            backgroundColor:
              // eslint-disable-next-line no-nested-ternary
              wallet === WalletType.METAMASK_MOBILE
                ? '#3679B5'
                : emailRestriction
                  ? '#D0D8DF'
                  : '#3679B5',
          }}
          handler={linkDapp}></SubmitButton>
      </View>
    </View>
  );
};

export default PaymentSelection;
