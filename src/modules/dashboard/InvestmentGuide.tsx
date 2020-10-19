import React, { FunctionComponent, useState } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import ViewPager from '@react-native-community/viewpager';
import styled from 'styled-components/native';
import investmentGuide1png from './images/investmentGuide1.png';
import investmentGuide2png from './images/investmentGuide2.png';
import investmentGuide3png from './images/investmentGuide3.png';
import investmentGuide4png from './images/investmentGuide4.png';
import { H1Text } from '../../shared/components/H1Text';
import { PText } from '../../shared/components/PText';
import QuitIcon from '../products/images/quitbutton.png';

const GuideImage = styled.Image`
  width: 90%;
  resize-mode: center;
  margin: 10% 5% 30px 5%;
  position: absolute;
`;
const Circle = styled.View`
  width: 10px;
  height: 10px;
  background-color: #BDD3E6;
  border-radius: 10px;
  overflow: hidden;
  margin: 10px;
`;

const InvestmentGuide: FunctionComponent<{}> = () => {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, backgroundColor: "#FFF", paddingTop: 55 }}>
      <TouchableOpacity
          onPress={() => { navigation.goBack(); }}
          style={{
          marginLeft: "auto",
          marginRight: "5%" }}
        >
          <Image
            style={{
              resizeMode: "center",
            }}
            source={QuitIcon}
          />
        </TouchableOpacity>
      <ViewPager style={styles.viewPager} initialPage={0}>
        <View style={styles.page} key="1">
          <GuideImage source={investmentGuide1png} />
          <View style={{ marginTop: 'auto', marginBottom: "35%" }}>
            <H1Text label={'EL토큰 입금하기'} style={{ fontSize: 25, textAlign: "center" }} />
            <PText label={'상장거래소에서 EL을 구입 후, \n본인의 인증지갑주소로 EL을 입급해주세요!'} style={{ fontSize: 15, marginTop: 20, textAlign: "center" }} />
          </View>
        </View>
        <View style={styles.page} key="2">
        <GuideImage source={investmentGuide2png} />
          <View style={{ marginTop: 'auto', marginBottom: "35%" }}>
            <H1Text label={'상품&수량 선택하기'} style={{ fontSize: 25, textAlign: "center" }} />
            <PText label={'마음에 드는 상품을 선택하신후,\n투자할 부동산 토큰 수량을 정해주세요!'} style={{ fontSize: 15, marginTop: 20, textAlign: "center" }} />
          </View>
        </View>
        <View style={styles.page} key="3">
        <GuideImage source={investmentGuide3png} />
          <View style={{ marginTop: 'auto', marginBottom: "35%" }}>
            <H1Text label={'트랜잭션 만들기'} style={{ fontSize: 25, textAlign: "center" }} />
            <PText label={'상장거래소에서 EL을 구입 후, \n본인의 인증지갑주소로 EL을 입급해주세요!'} style={{ fontSize: 15, marginTop: 20, textAlign: "center" }} />
          </View>
        </View>
        <View style={styles.page} key="4">
        <GuideImage source={investmentGuide4png} />
          <View style={{ marginTop: 'auto', marginBottom: "35%" }}>
            <H1Text label={'지분소유 완료!'} style={{ fontSize: 25, textAlign: "center" }} />
            <PText label={'상장거래소에서 EL을 구입 후, \n본인의 인증지갑주소로 EL을 입급해주세요!'} style={{ fontSize: 15, marginTop: 20, textAlign: "center" }} />
          </View>
        </View>
      </ViewPager>
      <View style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'row', bottom: "20%" }}>
        <Circle />
        <Circle />
        <Circle />
        <Circle />
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  viewPager: {
    flex: 1,
  },
  page: {
  },
});

export default InvestmentGuide;
