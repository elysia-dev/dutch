import React, { FunctionComponent, useState, useEffect } from 'react';
import { StyleSheet, View, Image, TouchableOpacity, SegmentedControlIOS } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ViewPager from '@react-native-community/viewpager';
import styled from 'styled-components/native';
import investmentGuide1 from './images/investmentGuide1.png';
import investmentGuide2 from './images/investmentGuide2.png';
import investmentGuide3 from './images/investmentGuide3.png';
import investmentGuide4 from './images/investmentGuide4.png';
import { H2Text, P1Text } from '../../shared/components/Texts';
import QuitIcon from '../products/images/quitbutton.png';
import i18n from '../../i18n/i18n';

const GuideImage = styled.Image`
  width: 90%;
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
  const [state, setState] = useState(0);
  const viewPager = React.createRef<ViewPager>();
  const ReturnImage = (imgNumber: number) => {
    switch (imgNumber) {
      case 0: return investmentGuide1;
      case 1: return investmentGuide2;
      case 2: return investmentGuide3;
      default: return investmentGuide4;
    }
  };
  const ItemListing = Array(4)
    .fill(0)
    .map((_x, index) => {
      return (
        <View style={styles.page}>
          <GuideImage source={ReturnImage(index)} />
          <View style={{ marginTop: 'auto', marginBottom: "35%" }}>
            <H2Text label={i18n.t('dashboard.investment_guide_header.' + index)} style={{ fontSize: 25, textAlign: "center" }} />
            <P1Text label={i18n.t('dashboard.investment_guide_text.' + index)} style={{ marginTop: 20, textAlign: "center" }} />
          </View>
        </View>
      );
    });
  const ButtonListing = Array(4)
    .fill(0)
    .map((_x, index) => {
      return (
        <TouchableOpacity onPress={() => { viewPager.current?.setPage(index); }}>
          <Circle style={[state === index ? styles.enableCircle : styles.disableCircle]} />
        </TouchableOpacity>
      );
    });
  return (
    <View style={{ flex: 1, backgroundColor: "#FFF", paddingTop: 55 }}>
      <TouchableOpacity
        onPress={() => { navigation.goBack(); }}
        style={{
          marginLeft: "auto",
          marginRight: "5%",
        }}
      >
        <Image
          style={{
            resizeMode: "center",
          }}
          source={QuitIcon}
        />
      </TouchableOpacity>
      <ViewPager style={styles.viewPager} initialPage={0} ref={viewPager}
        onPageSelected={e => {
          setState(e.nativeEvent.position);
        }}
      >
        {ItemListing}
      </ViewPager>
      <View style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'row', bottom: "20%" }}>
        {ButtonListing}
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
  enableCircle: {
    backgroundColor: "#3679B5",
  },
  disableCircle: {
    backgroundColor: "#BDD3E6",
  },
});

export default InvestmentGuide;
