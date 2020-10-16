import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import React, { FunctionComponent, useContext, useEffect, useState } from 'react';
import { View, ScrollView, SafeAreaView, Text, Image } from 'react-native';
import styled from 'styled-components/native';
import Server from '../../../api/server';
import RootContext from '../../../contexts/RootContext';
import i18n from '../../../i18n/i18n';
import { H1Text } from '../../../shared/components/H1Text';
import Product from '../../../types/Product';


const GrayBox = styled.View`
display: flex;
flex-direction:column;
align-content: space-between; 
width: 100%; 
height: 175px;
padding: 10px; 
border-radius: 10px; 
background-color: #F6F6F8;
border-width:1px;
border-color: #E5E5E5; 
margin-left: auto;
margin-right:auto;
`;

const WhiteBox = styled.View`
width: 100%;
height: 65px;
border-radius:10px;
background-color: #fff;
padding:10px;
display: flex;
flex-direction: column;
align-content: space-between;

`;
const GrayText = styled.Text`
font-size: 13px;
text-align: center;
align-items: center;
color: #626368`;

const BlackText = styled.Text`
font-size: 13px;
text-align: center;
align-items: center;
color: #1C1C1C`;

const TextWrapper = styled.View`
flex:1;
display: flex;
flex-direction: row;
justify-content: space-between;
align-items: center;
`;

type Props = {
    product: Product;
    tokenCount: number;
}

const BuyingSummary: FunctionComponent<Props> = (props: Props) => {
    const [elPrice, setELPrice] = useState(0.003);
    const { Server } = useContext(RootContext);

    const expectedUsdValue = (props.tokenCount || 0)
        * parseFloat(`${props.product.usdPricePerToken}`);
    const expectedElValue = expectedUsdValue / elPrice;

    useEffect(() => {
        Server.getELPrice().then(res => setELPrice(res.data.elysia.usd)).catch(e =>
            alert(i18n.t('account_errors.server')));
    }, []);

    return (
        <View style={{ paddingTop: 20 }}>
            <GrayBox>
                <WhiteBox>
                    <TextWrapper>
                        <GrayText style={{ flex: 1, textAlign: 'left' }} > FROM </GrayText>
                        <GrayText style={{ flex: 1 }}> TO </GrayText>
                        <GrayText style={{ flex: 3, textAlign: 'right' }}> VALUE </GrayText>
                    </TextWrapper>
                    <View style={{ flex: 1 }}>
                        <View style={{ position: 'relative', top: '50%', width: "100%", height: 1, backgroundColor: "#E5E5E5" }}></View>
                    </View>
                    <TextWrapper >
                        <BlackText style={{ flex: 1, textAlign: 'left' }}> YOU </BlackText>
                        <BlackText style={{ flex: 1 }}> ELYSIA </BlackText>
                        <BlackText style={{ flex: 3, textAlign: "right" }}> EL {expectedElValue.toFixed(2)} </BlackText>
                    </TextWrapper>
                </WhiteBox>
                <View style={{ width: 30, height: 21, marginLeft: 'auto', marginRight: 'auto', padding: 7 }}>
                    <Image style={{ width: "100%", height: "100%", resizeMode: 'center', marginLeft: 'auto', marginRight: 'auto' }} source={require('../images/downbutton.png')} />
                </View>
                <WhiteBox>
                    <TextWrapper>
                        <GrayText style={{ flex: 1, textAlign: 'left' }} > FROM </GrayText>
                        <GrayText style={{ flex: 1 }}> TO </GrayText>
                        <GrayText style={{ flex: 3, textAlign: 'right' }}> VALUE </GrayText>
                    </TextWrapper>
                    <View style={{ flex: 1 }}>
                        <View style={{ position: 'relative', top: '50%', width: "100%", height: 1, backgroundColor: "#E5E5E5" }}></View>
                    </View>
                    <TextWrapper>
                        <BlackText style={{ flex: 1, textAlign: 'left' }}> ELYSIA </BlackText>
                        <BlackText style={{ flex: 1 }}> YOU </BlackText>
                        <BlackText style={{ flex: 3, textAlign: "right" }}>{props.product.tokenName} {props.tokenCount} </BlackText>
                    </TextWrapper>
                </WhiteBox>
            </GrayBox>
            <View style={{ paddingHorizontal: 10, flexDirection: "row", justifyContent: "space-between", marginTop: 15 }}>
                <H1Text style={{ fontSize: 15 }} label={i18n.t('product_label.expected_return')}></H1Text>
                <H1Text style={{ fontSize: 15 }} label={`$ ${props.product.expectedAnnualReturn}`}></H1Text>
            </View>
        </View>

    );
};

export default BuyingSummary;
