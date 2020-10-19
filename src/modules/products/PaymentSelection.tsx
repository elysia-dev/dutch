import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import React, { FunctionComponent, useContext, useEffect, useState } from 'react';
import { View, ScrollView, SafeAreaView, Image, Text } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import styled from 'styled-components/native';
import * as Linking from 'expo-linking';
import i18n from '../../i18n/i18n';
import { BackButton } from '../../shared/components/BackButton';
import { H1Text } from '../../shared/components/H1Text';
import { SubmitButton } from '../../shared/components/SubmitButton';
import Product from '../../types/Product';
import BuyingSummary from './components/BuyingSummary';
import InterestSummary from './components/InterestSummary';
import RootContext from '../../contexts/RootContext';
import { PText } from '../../shared/components/PText';


type ParamList = {
  PaymentSelection: {
    id: number;
    tokenCount: number;
    product: Product;
    type: string;
    elInterest?: string;
  };
};

type ButtonProps = {
  title: string;
  selected: boolean;
  modeHandler: () => void;
}

const MetaMaskButton: FunctionComponent<ButtonProps> = (props: ButtonProps) => {
  return (
    <TouchableOpacity onPress={props.modeHandler}
      style={{ width: "100%", height: 50, borderRadius: 5, borderWidth: 1, borderColor: props.selected ? "#3679B5" : "#D0D8DF", padding: 15, flexDirection: "row", marginBottom: 15 }}>
      <Image style={{ flex: 1, alignSelf: 'center', resizeMode: 'center' }} source={props.selected ? require('./images/metamask_logo.png') : require('./images/metamask_logo_gray.png')}></Image>
      <Text style={{ flex: 5, fontSize: 14, fontWeight: props.selected ? "bold" : "normal", color: "#1C1C1C", alignSelf: 'center' }}>{props.title}</Text>
      {props.selected && <Image style={{ alignSelf: 'center' }} source={require('./images/bluebuttoncheck.png')}></Image>}
    </TouchableOpacity>);
};

const PaymentSelection: FunctionComponent = () => {
  useEffect(() => { }, []);
  const navigation = useNavigation();
  const route = useRoute<RouteProp<ParamList, 'PaymentSelection'>>();
  const { id, tokenCount, product, type, elInterest } = route.params;
  const [state, setState] = useState({
    mobile: false,
    pc: false,
    emailRestriction: false,
  });
  const { mobile, pc, emailRestriction } = state;
  const { Server } = useContext(RootContext);


  const linkMetamask = () => {
    if (mobile) {
      Linking.openURL(
        `https://metamask.app.link/dapp/dapp-staging.elysia.land/request/${id}`);
    } else if (pc) {
      if (emailRestriction) { return (alert(i18n.t('product.email_restriction'))); }
      Server.sendEmailForTransaction(`${id}`)
        .then(res => {
          setState({ ...state, emailRestriction: true });
          alert(i18n.t('product.send_purchase_link'));
          setTimeout(() => {
            setState({
              ...state, emailRestriction: false,
            });
          }, 30000);
        })
        .catch(e => {
          if (e.response.status === 500) {
            alert(i18n.t('account_errors.server'));
          }
        });
    }
  };

  return (
    <View style={{ width: "100%", height: "100%", backgroundColor: "#fff", padding: 20 }}>
      <BackButton style={{ marginTop: 20 }} handler={() => navigation.goBack()}></BackButton>
      <H1Text label={i18n.t('product.transaction_ready')} style={{ fontSize: 25 }}></H1Text>
      {type === "buying" && <BuyingSummary product={product} tokenCount={tokenCount} />}
      {type === "interest" && <InterestSummary product={product} elInterest={elInterest || ""} />}
      <View style={{ marginTop: 40 }}>
        <MetaMaskButton title={'MetaMask Mobile'} selected={mobile} modeHandler={() => setState({ ...state, mobile: true, pc: false })} />
        <MetaMaskButton title={'MetaMask PC'} selected={pc} modeHandler={() => setState({ ...state, mobile: false, pc: true })} />
      </View>
      {pc && <PText label={i18n.t('product.link_will_be_sent')} />}
      <SubmitButton
        title={type === "buying" ? i18n.t('dashboard_label.ownership') : i18n.t('dashboard_label.profit')}
        // eslint-disable-next-line no-nested-ternary
        style={{ position: 'absolute', bottom: 30, alignSelf: 'center', width: "100%", backgroundColor: mobile ? "#3679B5" : (emailRestriction ? "#D0D8DF" : "#3679B5") }}
        handler={() => {
          if (!(mobile || pc)) {
            alert(i18n.t('product.select_metamask'));
          } else {
            linkMetamask();
          }
        }}></SubmitButton>
    </View>);
};

export default PaymentSelection;
