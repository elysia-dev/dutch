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
import { TouchableOpacity } from 'react-native-gesture-handler';
import * as Linking from 'expo-linking';
import i18n from '../../i18n/i18n';
import { BackButton } from '../../shared/components/BackButton';
import { H1Text, P1Text } from '../../shared/components/Texts';
import { SubmitButton } from '../../shared/components/SubmitButton';
import Product from '../../types/Product';
import BuyingSummary from './components/BuyingSummary';
import RefundSummary from './components/RefundSummary';
import InterestSummary from './components/InterestSummary';
import RootContext from '../../contexts/RootContext';
import getEnvironment from '../../utiles/getEnvironment';
import useAppState from '../../hooks/useAppState';
import { DashboardPage } from '../../enums/pageEnum';

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
  if (type === 'mobile') {
    return selected
      ? require('./images/selected_mobile.png')
      : require('./images/mobile.png');
  }
  return selected
    ? require('./images/selected_desktop.png')
    : require('./images/desktop.png');
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
  const { id, tokenCount, product, type, elInterest } = route.params;
  const [state, setState] = useState({
    mobile: false,
    pc: false,
    emailRestriction: false,
  });
  const { mobile, pc, emailRestriction } = state;
  const { Server, refreshUser } = useContext(RootContext);
  const appState = useAppState();

  useEffect(() => {
    if (appState === 'active' && id) {
      Server.getTransactionRequest(id).catch(async () => {
        await refreshUser();
        navigation.goBack();
      });
    }
  }, [appState]);

  const linkMetamask = () => {
    if (mobile) {
      Linking.openURL(
        `https://metamask.app.link/dapp/${
          getEnvironment().dappUrl
        }/requests/${id}`,
      );
    } else if (pc) {
      if (emailRestriction) {
        return alert(i18n.t('product.email_restriction'));
      }
      Server.sendEmailForTransaction(`${id}`)
        .then((res) => {
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
          marginTop: 20,
        }}>
        <BackButton handler={() => navigation.goBack()} />
        <QuitButton />
      </View>
      <H1Text
        label={i18n.t('product.transaction_ready')}
        style={{ fontSize: 25 }}></H1Text>
      {type === 'buying' && (
        <BuyingSummary product={product} tokenCount={tokenCount} />
      )}
      {type === 'interest' && (
        <InterestSummary product={product} elInterest={elInterest || ''} />
      )}
      {type === 'refund' && (
        <RefundSummary product={product} tokenCount={tokenCount} />
      )}
      <View style={{ marginTop: 40 }}>
        <MetaMaskButton
          title={i18n.t('product.metamask_mobile')}
          type={'mobile'}
          selected={mobile}
          modeHandler={() => setState({ ...state, mobile: true, pc: false })}
        />
        <MetaMaskButton
          title={i18n.t('product.metamask_pc')}
          type={'pc'}
          selected={pc}
          modeHandler={() => setState({ ...state, mobile: false, pc: true })}
        />
      </View>
      {pc && <P1Text label={i18n.t('product.link_will_be_sent')} />}
      <SubmitButton
        title={i18n.t('account_label.continue')}
        // eslint-disable-next-line no-nested-ternary
        style={{
          position: 'absolute',
          bottom: 30,
          alignSelf: 'center',
          width: '100%',
          // eslint-disable-next-line no-nested-ternary
          backgroundColor: mobile
            ? '#3679B5'
            : emailRestriction
            ? '#D0D8DF'
            : '#3679B5',
        }}
        handler={() => {
          if (!(mobile || pc)) {
            alert(i18n.t('product.select_metamask'));
          } else {
            linkMetamask();
          }
        }}></SubmitButton>
    </View>
  );
};

export default PaymentSelection;
