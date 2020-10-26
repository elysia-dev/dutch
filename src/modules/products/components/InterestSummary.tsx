import React, { FunctionComponent } from 'react';
import { View } from 'react-native';
import styled from 'styled-components/native';
import Product from '../../../types/Product';

const GrayBox = styled.View`
display: flex;
flex-direction:column;
align-content: space-between;
width: 100%;
height: 90px;
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
height: 70px;
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
  elInterest: string;
}

const InterestSummary: FunctionComponent<Props> = (props: Props) => {
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
          <TextWrapper>
            <BlackText style={{ flex: 1, textAlign: 'left' }}> ELYSIA </BlackText>
            <BlackText style={{ flex: 1 }}> YOU </BlackText>
            <View style={{ flexDirection: "row", flex: 3, justifyContent: "flex-end" }}>
              <BlackText style={{ textAlign: "right" }}>EL</BlackText>
              <BlackText style={{ fontWeight: 'bold', textAlign: "right" }}> {props.elInterest} </BlackText>
            </View>
          </TextWrapper>
        </WhiteBox>
      </GrayBox>
    </View >
  );
};

export default InterestSummary;
