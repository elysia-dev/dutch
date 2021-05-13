import React, { FunctionComponent } from 'react';
import {
  View,
  Image,
  ScrollView,SafeAreaView
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { P2Text, H2Text, P1Text, H3Text } from '../../shared/components/Texts';
import WrapperLayout from '../../shared/components/WrapperLayout';

const PropertyInfomation: FunctionComponent<{}> = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  return (
    <WrapperLayout
      isScrolling={true}
      title="투자방식"
      backButtonHandler={() => navigation.goBack()}
      body={
        <SafeAreaView>
          <View style={{ height: "100%", width: "100%" }}>
            <View style={{ marginLeft: "5%", marginRight: "5%", borderBottomColor:"#E6E6E6", borderBottomWidth: 1, paddingBottom: 40 }}>
              <H2Text label={"[개수 기준] 이란?"} style={{ fontSize: 20, marginBottom: "5%" }} />
              <View style={{ marginLeft: "5%", marginRight: "5%" }}>
                <H3Text label={"1. 개수기준 상품 정보"} style={{ marginBottom: 6 }} />
                <View style={{ marginBottom: 35 }}>
                  <P1Text label={":"} style={{ position: "absolute", marginLeft: "2.5%" }} />
                  <P1Text label={"연이자율 10% 상품, 현재 EL시세(1 EL = 1달러)의 상품이 있습니다."} style={{ marginLeft: "5%", marginRight: "5%"}} />
                </View> 
                <H3Text label={"2. 상품투자"} style={{ marginBottom: 6 }} />
                <View style={{ marginBottom: 35 }}>
                  <P1Text label={":"} style={{ position: "absolute", marginLeft: "2.5%" }} />
                  <P1Text label={"해당 상품에 1,000EL(=1,000달러)을 투자합니다."} style={{ marginLeft: "5%", marginRight: "5%"}} />
                </View>

                <H3Text label={"3. 1년 후, 상환금"} style={{ marginBottom: 6 }} />
                <View style={{
                  borderColor: "#E6E6E6",
                  borderWidth: 1,
                  borderRadius: 5,
                  padding: 10,
                  paddingBottom: 20
                }}>
                  <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                    <Image source={require('./images/el-main.png')} style={{ flex: 1, resizeMode: "contain" }} />
                    <H3Text label={"+"} style={{ position: 'absolute', left: "34%" }}/>
                    <Image source={require('./images/el-bonus.png')} style={{ flex: 1, resizeMode: "contain" }} />
                    <H3Text label={"="} style={{ position: 'absolute', right: "34%" }}/>
                    <Image source={require('./images/el-total.png')} style={{ flex: 1, resizeMode: "contain" }} />
                  </View>
                  <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
                    <View style={{
                      flexDirection: "column",
                      alignItems: "center",
                      flex: 1
                    }}>
                      <P1Text label={"원금 1,000달러"} style={{ fontSize: 11 }}/>
                    </View>
                    <View style={{
                      flexDirection: "column",
                      alignItems: "center",
                      flex: 1
                    }}>
                      <P1Text label={"이자 100달러"} style={{ fontSize: 11 }}/>
                    </View>
                    <View style={{
                      flexDirection: "column",
                      alignItems: "center",
                      flex: 1
                    }}>
                      <P1Text label={"상환금 1,100달러"} style={{ fontSize: 11 }}/>
                    </View>
                  </View>
                </View>
              </View>
            </View>
            <View style={{ marginLeft: "5%", marginRight: "5%", borderBottomColor:"#E6E6E6", borderBottomWidth: 1, paddingVertical  : 40 }}>
              <H2Text label={"[달러 기준] 이란?"} style={{ fontSize: 20, marginBottom: "5%" }} />
              <View style={{ marginLeft: "5%", marginRight: "5%" }}>
                <H3Text label={"1. 달러기준 상품 정보"} style={{ marginBottom: 6 }} />
                <View style={{ marginBottom: 35 }}>
                  <P1Text label={":"} style={{ position: "absolute", marginLeft: "2.5%" }} />
                  <P1Text label={"연이자율 10% 상품, 현재 EL시세(1 EL = 1달러)의 상품이 있습니다."} style={{ marginLeft: "5%", marginRight: "5%"}} />
                </View> 
                <H3Text label={"2. 상품투자"} style={{ marginBottom: 6 }} />
                <View style={{ marginBottom: 35 }}>
                  <P1Text label={":"} style={{ position: "absolute", marginLeft: "2.5%" }} />
                  <P1Text label={"해당 상품에 1,000EL(=1,000달러)을 투자합니다."} style={{ marginLeft: "5%", marginRight: "5%"}} />
                </View>

                <H3Text label={"3-1)"} style={{ marginBottom: 2 }} />
                <H3Text label={"1년 후, EL시세(1 EL = 2달러)일 경우, 상환금"} style={{ marginBottom: 6 }} />
                <View style={{
                  borderColor: "#E6E6E6",
                  borderWidth: 1,
                  borderRadius: 5,
                  padding: 10,
                  paddingBottom: 20,
                  marginBottom: 20
                }}>
                  <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                    <Image source={require('./images/usd-main.png')} style={{ flex: 1, resizeMode: "contain" }} />
                    <H3Text label={"+"} style={{ position: 'absolute', left: "34%" }}/>
                    <Image source={require('./images/usd-bonus.png')} style={{ flex: 1, resizeMode: "contain" }} />
                    <H3Text label={"="} style={{ position: 'absolute', right: "34%" }}/>
                    <Image source={require('./images/usd-total.png')} style={{ flex: 1, resizeMode: "contain" }} />
                  </View>
                  <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
                    <View style={{
                      flexDirection: "column",
                      alignItems: "center",
                      flex: 1
                    }}>
                      <P1Text label={"원금 1,000달러"} style={{ fontSize: 11 }}/>
                      <P1Text label={"(500EL)"} style={{ fontSize: 10 }}/>
                    </View>
                    <View style={{
                      flexDirection: "column",
                      alignItems: "center",
                      flex: 1
                    }}>
                      <P1Text label={"이자 100달러"} style={{ fontSize: 11 }}/>
                      <P1Text label={"(50EL)"} style={{ fontSize: 10 }}/>
                    </View>
                    <View style={{
                      flexDirection: "column",
                      alignItems: "center",
                      flex: 1
                    }}>
                      <P1Text label={"상환금 1,100달러"} style={{ fontSize: 11 }}/>
                      <P1Text label={"(550EL)"} style={{ fontSize: 10 }}/>
                    </View>
                  </View>
                </View>
                <H3Text label={"3-2)"} style={{ marginBottom: 2 }} />
                <H3Text label={"1년 후, EL시세(1 EL = 0.5달러)일 경우, 상환금"} style={{ marginBottom: 6 }} />
                <View style={{
                  borderColor: "#E6E6E6",
                  borderWidth: 1,
                  borderRadius: 5,
                  padding: 10,
                  paddingBottom: 20
                }}>
                  <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                    <Image source={require('./images/usd-main.png')} style={{ flex: 1, resizeMode: "contain" }} />
                    <H3Text label={"+"} style={{ position: 'absolute', left: "34%" }}/>
                    <Image source={require('./images/usd-bonus.png')} style={{ flex: 1, resizeMode: "contain" }} />
                    <H3Text label={"="} style={{ position: 'absolute', right: "34%" }}/>
                    <Image source={require('./images/usd-total.png')} style={{ flex: 1, resizeMode: "contain" }} />
                  </View>
                  <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
                    <View style={{
                      flexDirection: "column",
                      alignItems: "center",
                      flex: 1
                    }}>
                      <P1Text label={"원금 1,000달러"} style={{ fontSize: 11 }}/>
                      <P1Text label={"(2000EL)"} style={{ fontSize: 10 }}/>
                    </View>
                    <View style={{
                      flexDirection: "column",
                      alignItems: "center",
                      flex: 1
                    }}>
                      <P1Text label={"이자 100달러"} style={{ fontSize: 11 }}/>
                      <P1Text label={"(200EL)"} style={{ fontSize: 10 }}/>
                    </View>
                    <View style={{
                      flexDirection: "column",
                      alignItems: "center",
                      flex: 1
                    }}>
                      <P1Text label={"상환금 1,100달러"} style={{ fontSize: 11 }}/>
                      <P1Text label={"(2200EL)"} style={{ fontSize: 10 }}/>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </SafeAreaView>
      }
    />
  );
};


export default PropertyInfomation;
