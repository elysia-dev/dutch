import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import React, { FunctionComponent, useContext, useEffect, useState } from 'react';
import { View, ScrollView, SafeAreaView, Image, Text } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import styled from 'styled-components/native';
import i18n from '../../i18n/i18n';
import { BackButton } from '../../shared/components/BackButton';
import { H1Text } from '../../shared/components/H1Text';
import { SubmitButton } from '../../shared/components/SubmitButton';
import Product from '../../types/Product';
import BuyingSummary from './components/BuyingSummary';
import InterestSummary from './components/InterestSummary';

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
    });
    const { mobile, pc } = state;


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
            <SubmitButton
                title={i18n.t('dashboard_label.profit')}
                style={{ position: 'absolute', bottom: 30, alignSelf: 'center', width: "100%" }}
                handler={() => {
                    if (!(mobile || pc)) {
                        alert(i18n.t('product.select_metamask'));
                    }
                }}></SubmitButton>
        </View>);
};

export default PaymentSelection;
