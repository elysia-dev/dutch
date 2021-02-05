import {
  RouteProp,
  useNavigation,
  useRoute,
  StackActions,
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
  TouchableWithoutFeedback,
} from 'react-native-gesture-handler';
import * as Linking from 'expo-linking';
import i18n from '../../i18n/i18n';
import { BackButton } from '../../shared/components/BackButton';
import { H1Text, P1Text } from '../../shared/components/Texts';
import { SubmitButton } from '../../shared/components/SubmitButton';
import Product from '../../types/Product';
import RootContext from '../../contexts/RootContext';
import getEnvironment from '../../utiles/getEnvironment';
import useAppState from '../../hooks/useAppState';
import WalletType from '../../enums/WalletType';
import storeDeeplink from '../../utiles/storeDeeplink';
import ProviderType from '../../enums/ProviderType';
import { TextField } from '../../shared/components/TextField';

type ParamList = {
  PaymentSelection: {
    id: string;
    tokenCount: number;
    product: Product;
    type: 'refund' | 'buying' | 'interest';
    elInterest?: string;
  };
};

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
        ? require('./images/selected_mobile.png')
        : require('./images/mobile.png');
    case WalletType.METAMASK_PC:
      return selected
        ? require('./images/selected_desktop.png')
        : require('./images/desktop.png');
    case WalletType.IMTOKEN_MOBILE:
      return selected
        ? require('./images/selected_imtoken.png')
        : require('./images/imtoken.png');
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
          source={require('./images/bluebuttoncheck.png')}></Image>
      )}
    </TouchableOpacity>
  );
};

const PaymentSelection: FunctionComponent = () => {
  useEffect(() => {}, []);
  const navigation = useNavigation();
  const route = useRoute<RouteProp<ParamList, 'PaymentSelection'>>();
  const { id } = route.params;
  const [state, setState] = useState({
    wallet: '',
    emailRestriction: false,
    email: '',
  });
  const { wallet, emailRestriction, email } = state;
  const { Server, refreshUser, user } = useContext(RootContext);
  const appState = useAppState();

  useEffect(() => {
    if (appState === 'active' && id) {
      Server.getTransactionRequest(id).catch(async () => {
        await refreshUser();
        navigation.goBack();
      });
    }
  }, [appState]);

  const linkDapp = () => {
    switch (wallet) {
      case WalletType.IMTOKEN_MOBILE:
        Linking.openURL(
          `imtokenv2://navigate?screen=DappView&url=https://${
            getEnvironment().dappUrl
          }/requests/${id}`,
        ).catch((_e) => {
          storeDeeplink('imtoken-btc-eth-wallet/id1384798940', 'im.token.app');
        });
        break;
      case WalletType.METAMASK_MOBILE:
        Linking.openURL(
          `https://metamask.app.link/dapp/${
            getEnvironment().dappUrl
          }/requests/${id}`,
        ).catch((_e) => {
          storeDeeplink('metamask/id1438144202', 'io.metamask');
        });
        break;
      case WalletType.METAMASK_PC:
        if (emailRestriction) {
          return alert(i18n.t('product.email_restriction'));
        }
        if (user.provider === ProviderType.ETH) {
          if (!email) {
            return alert(i18n.t('account.check_email'));
          } else {
            Server.sendEmailForTransaction(id, email)
              .then((_res) => {
                setState({ ...state, emailRestriction: true });
                alert(i18n.t('product.send_purchase_link'));
                setTimeout(() => {
                  setState({
                    ...state,
                    emailRestriction: false,
                  });
                }, 30000);
              })
              .catch((e) => {
                if (e.response.status === 500) {
                  alert(i18n.t('account_errors.server'));
                }
              });
          }
        } else {
          Server.sendEmailForTransaction(id)
            .then((_res) => {
              setState({ ...state, emailRestriction: true });
              alert(i18n.t('product.send_purchase_link'));
              setTimeout(() => {
                setState({
                  ...state,
                  emailRestriction: false,
                });
              }, 30000);
            })
            .catch((e) => {
              if (e.response.status === 500) {
                alert(i18n.t('account_errors.server'));
              }
            });
        }
        break;
      default:
        alert(i18n.t('product.select_metamask'));
    }
  };

  const QuitButton: FunctionComponent = () => {
    return (
      <TouchableOpacity
        style={{ width: 40, height: 40, marginRight: -20, marginTop: 22 }}
        onPress={() => {
          navigation.navigate('Main', { screen: 'DashboardMain' });
        }}>
        <Image source={require('./images/quitbuttonblack.png')}></Image>
      </TouchableOpacity>
    );
  };

  return (
    <View
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: '#fff',
        padding: 20,
      }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: 5,
        }}>
        <BackButton handler={() => navigation.goBack()} />
        <QuitButton />
      </View>
      <H1Text
        label={i18n.t('product.select_payment')}
        style={{ fontSize: 25 }}></H1Text>
      <View style={{ marginTop: 40 }}>
        <MetaMaskButton
          title={i18n.t('product.metamask_mobile')}
          type={WalletType.METAMASK_MOBILE}
          selected={wallet === WalletType.METAMASK_MOBILE}
          modeHandler={() =>
            setState({ ...state, wallet: WalletType.METAMASK_MOBILE })
          }
        />
        <MetaMaskButton
          title={i18n.t('product.metamask_pc')}
          type={WalletType.METAMASK_PC}
          selected={wallet === WalletType.METAMASK_PC}
          modeHandler={() =>
            setState({ ...state, wallet: WalletType.METAMASK_PC })
          }
        />
        <MetaMaskButton
          title={i18n.t('product.imtoken_mobile')}
          type={WalletType.IMTOKEN_MOBILE}
          selected={wallet === WalletType.IMTOKEN_MOBILE}
          modeHandler={() =>
            setState({ ...state, wallet: WalletType.IMTOKEN_MOBILE })
          }
        />
      </View>
      {wallet === WalletType.METAMASK_PC && (
        <>
          {user.provider === ProviderType.ETH && (
            <TextField
              eventHandler={(input: string) =>
                setState({ ...state, email: input })
              }
              value={email}
              label={i18n.t('account.insert_account_email')}
            />
          )}
          <P1Text
            label={'* ' + i18n.t('product.link_will_be_sent')}
            style={{ color: '#a7a7a7' }}
          />
        </>
      )}
      <SubmitButton
        title={i18n.t('account_label.continue')}
        // eslint-disable-next-line no-nested-ternary
        style={{
          position: 'absolute',
          bottom: 30,
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
  );
};

export default PaymentSelection;
