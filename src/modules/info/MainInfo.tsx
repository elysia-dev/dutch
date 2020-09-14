import React, { FunctionComponent, useContext } from "react";
import { View, ScrollView, TouchableOpacity, Platform } from "react-native";
import styled from "styled-components/native";
import { SubmitButton } from "../../shared/components/SubmitButton";
import i18n from "../../i18n/i18n";
import { useNavigation } from "@react-navigation/native";
import { KycStatus } from "../../enums/status";
import { InfoPage } from "../../enums/pageEnum";
import UserContext from "../../contexts/UserContext";

const MainInfoWrapper = styled.SafeAreaView`
  padding-top: ${Platform.OS === "android" ? "25px" : "0px"};
  background-color: #ffffff;
`;
const InfoHeaderH1Text = styled.Text`
  color: #1c1c1c;
  font-size: 20px;
  font-weight: bold;
  line-height: 21px;
`;
const InfoHeaderSettingImg = styled.Image`
  width: 21px;
  height: 21px;
`;
const InfoHeaderUserImg = styled.Image`
  width: 20px;
  height: 20px;
`;
const InfoHeaderUserName = styled.Text`
  font-size: 14px;
  color: #838383;
`;
const H1Text = styled.Text`
  color: #1c1c1c;
  font-weight: bold;
  text-align: left;
  margin-left: 20px;
  font-size: 18px;
  margin-top: 20px;
  margin-bottom: 25px;
`;
const PText = styled.Text`
  color: #5c5b5b;
  margin-bottom: 12px;
  font-size: 15px;
  line-height: 50px;
`;
const InfoArrowImg = styled.Image`
  width: 5px;
  height: 8px;
  margin: 20px 20px;
  resize-mode: center;
`;
const InfoButtonTabWrapper = styled.View`
  height: 50px;
  margin-right: 20px;
  margin-left: 20px;
  margin-bottom: 15px;
`;
const InfoButtonInnerWrapper = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

const MainInfo: FunctionComponent = () => {
  const { user } = useContext(UserContext);
  const navigation = useNavigation();

  return (
    <MainInfoWrapper>
      <ScrollView>
        <View style={{ margin: 20, display: "flex", flexDirection: "row" }}>
          <InfoHeaderH1Text>{user.email}</InfoHeaderH1Text>
          <View
            style={{
              marginLeft: "auto"
            }}
          >
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("Info", { screen: InfoPage.MyPage });
              }}
            >
              <InfoHeaderSettingImg
                source={require("../../../assets/setting.png")}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ marginTop: 10, marginLeft: 20, marginRight: 20, display: "flex", flexDirection: "row" }}>
          <InfoHeaderUserImg
            source={require("../kyc/images/userIcon.png")}
          />
          <InfoHeaderUserName style={{ marginLeft: 10 }}>
            {user.kycStatus !== KycStatus.SUCCESS ?
              i18n.t("info_label.need_kyc_label")
              :
              user.firstName + user.lastName
            }
          </InfoHeaderUserName>
        </View>
        <View
          style={{
            borderBottomColor: "#F6F6F8",
            borderBottomWidth: 5,
            marginTop: 20,
            paddingBottom: 20
          }}
        >
          {user.kycStatus === KycStatus.NONE && (
            <SubmitButton
              title={i18n.t("info_label.need_kyc")}
              handler={() => navigation.navigate("Kyc")}
            />
          )}
          {user.kycStatus === KycStatus.PENDING && (
            <SubmitButton
              title={i18n.t("info_label.proceed_kyc")}
              handler={() => {
                alert(i18n.t("info.kyc_proceeding_wait"));
              }}
              ButtonTheme={"GrayTheme"}
            />
          )}
          {user.kycStatus === KycStatus.SUCCESS && (
            <SubmitButton
              title={i18n.t("info_label.approved_kyc")}
              handler={() => { }}
              ButtonTheme={"GrayTheme"}
            />
          )}
        </View>
        <View
          style={{
            borderBottomColor: "#F6F6F8",
            borderBottomWidth: 5,
          }}
        >
          <H1Text>{i18n.t("info_label.confirm")}</H1Text>
          <InfoButtonTabWrapper>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("Info", {
                  screen: InfoPage.OwnershipHistory,
                })
              }
            >
              <InfoButtonInnerWrapper>
                <PText>{i18n.t("info_label.investment_history")}</PText>
                <InfoArrowImg
                  source={require("../../../assets/next_gray.png")}
                />
              </InfoButtonInnerWrapper>
            </TouchableOpacity>
          </InfoButtonTabWrapper>

          <InfoButtonTabWrapper>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("Info", {
                  screen: InfoPage.TransactionHistory,
                })
              }
            >
              <InfoButtonInnerWrapper>
                <PText>{i18n.t("info_label.transaction_history")}</PText>
                <InfoArrowImg
                  source={require("../../../assets/next_gray.png")}
                />
              </InfoButtonInnerWrapper>
            </TouchableOpacity>
          </InfoButtonTabWrapper>
        </View>
        <View
          style={{
            borderBottomColor: "#F6F6F8",
            borderBottomWidth: 5,
            justifyContent: "center",
            alignContent: "flex-start",
          }}
        >
          <View>
            <H1Text>{i18n.t("info_label.elysia")}</H1Text>
          </View>

          <InfoButtonTabWrapper>
            <TouchableOpacity onPress={() => { }}>
              <InfoButtonInnerWrapper>
                <PText>{i18n.t("info_label.notice")}</PText>
                <InfoArrowImg
                  source={require("../../../assets/next_gray.png")}
                />
              </InfoButtonInnerWrapper>
            </TouchableOpacity>
          </InfoButtonTabWrapper>
          <InfoButtonTabWrapper>
            <TouchableOpacity onPress={() => { }}>
              <InfoButtonInnerWrapper>
                <PText>{i18n.t("info_label.service_terms")}</PText>
                <InfoArrowImg
                  source={require("../../../assets/next_gray.png")}
                />
              </InfoButtonInnerWrapper>
            </TouchableOpacity>
          </InfoButtonTabWrapper>
          <InfoButtonTabWrapper>
            <TouchableOpacity onPress={() => { }}>
              <InfoButtonInnerWrapper>
                <PText>{i18n.t("info_label.contact")}</PText>
                <InfoArrowImg
                  source={require("../../../assets/next_gray.png")}
                />
              </InfoButtonInnerWrapper>
            </TouchableOpacity>
          </InfoButtonTabWrapper>
          <InfoButtonTabWrapper>
            <TouchableOpacity onPress={() => { }}>
              <InfoButtonInnerWrapper>
                <PText>{i18n.t("info_label.faq")}</PText>
                <InfoArrowImg
                  source={require("../../../assets/next_gray.png")}
                />
              </InfoButtonInnerWrapper>
            </TouchableOpacity>
          </InfoButtonTabWrapper>
        </View>
        <View
          style={{
            borderBottomColor: "#F6F6F8",
            borderBottomWidth: 5,
          }}
        >
          <H1Text>앱 설정</H1Text>
          <PText style={{ marginLeft: 20 }}>언어</PText>
        </View>
        <View
          style={{
            borderBottomColor: "#F6F6F8",
            borderBottomWidth: 5,
          }}
        >
          <H1Text>EL 거래소</H1Text>
        </View>
      </ScrollView>
    </MainInfoWrapper>
  );
};

export default MainInfo;
