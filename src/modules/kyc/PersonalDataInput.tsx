import React, { Component } from "react";
import { View, ScrollView, SafeAreaView } from "react-native";
import { TextInput } from "../../shared/components/TextInput";
import { SubmitButton } from "../../shared/components/SubmitButton";
import { Modal } from "../../shared/components/Modal";
import styled from "styled-components/native";
import KycSubmitPng from "./images/kycsubmit.png";
import i18n from "../../i18n/i18n";
import { BackButton } from "../../shared/components/BackButton";
import { NationInput } from "./components/NationInput";
import { DateInput } from "./components/DateInput";
import { ShortOptionButton } from "./components/ShortOptionButton";
import { NavigationRoute, NavigationScreenProp } from "react-navigation";
import Api from "../../api/kyc";

const H1Text = styled.Text`
  color: #1c1c1c;
  font-size: 20px;
  font-weight: bold;
  text-align: left;
  margin-top: 40px;
  margin-left: 5%;
  margin-bottom: 6px;
`;
const PText = styled.Text`
  font-size: 12px;
  color: #626368;
  text-align: left;
  margin: 5px auto 32px auto;
  width: 90%;
`;
const InputHeaderText = styled.Text`
  color: #a7a7a7;
  margin: 5px 20px;
  font-size: 12px;
  text-align: left;
`;
const IdImg = styled.Image`
  width: 90%;
  height: 30%;
  justify-content: center;
  align-content: center;
  left: 5%;
  position: relative;
  elevation: 5;
`;
const ConfirmImg = styled.Image`
  width: 150px;
  height: 150px;
`;
const PersonalDataInputWrapper = styled.SafeAreaView`
  padding-top: 25px;
  flex: 1;
  background-color: #ffffff;
`;
const ScrollViewWrapper = styled.ScrollView.attrs(() => ({
  backgroundColor: "#fff",
  contentContainerStyle: {
    showsVerticalScrollIndicator: false,
  },
}))`
  flex-direction: column;
  background-color: rgba(250, 250, 250, 1);
  width: 90%;
  margin-left: 5%;
  margin-right: 5%;
  border-radius: 10px;
  border: 1px solid rgba(167, 167, 167, 1);
  overflow: hidden;
  margin-bottom: 30px;
`;

interface props {
  navigation: NavigationScreenProp<any>;
  route: NavigationRoute;
}

interface state {
  gender: string;
  firstName: string;
  lastName: string;
  nationality: string;
  birthday: string;
  modalVisible: boolean;
}

export class PersonalDataInput extends Component<props, state> {
  constructor(props: props) {
    super(props);
    this.state = {
      gender: "",
      firstName: "",
      lastName: "",
      nationality: "",
      birthday: "",
      modalVisible: false,
    };
    this.setNationality = this.setNationality.bind(this);
    this.setBirthday = this.setBirthday.bind(this);
    this.setModalVisible = this.setModalVisible.bind(this);
  }

  setModalVisible = (visible: boolean) => {
    this.setState({ modalVisible: visible });
    console.log(this.state.modalVisible);
  };

  setNationality(input: string) {
    this.setState({ nationality: input });
    console.log(this.state.nationality);
  }

  setBirthday(input: string) {
    this.setState({ birthday: input });
  }

  callKycApi() {
    const { route, navigation } = this.props;
    const { selfie_hash, id_type, photoId_hash, photoId } = route.params;
    if (this.state.gender === "") {
      alert(i18n.t("kyc.alert_data"));
      return;
    } else if (this.state.firstName === "" || this.state.lastName === "") {
      alert(i18n.t("kyc.alert_data"));
      return;
    } else if (this.state.birthday === "" || this.state.nationality === "") {
      alert(i18n.t("kyc.alert_data"));
      return;
    } else {
      Api.submission(
        this.state.firstName,
        this.state.lastName,
        this.state.nationality,
        this.state.birthday,
        this.state.gender,
        id_type === "passport" ? "passport" : "government_id",
        photoId_hash,
        selfie_hash
      )
        .then((res) => {
          this.setModalVisible(true);
        })
        .catch((e) => {
          alert(i18n.t("kyc.submit_error"));
          navigation.navigate("Main", { screen: "Info" });
        });
    }
  }

  render() {
    const { route, navigation } = this.props;
    const { photoId } = route.params;
    return (
      <PersonalDataInputWrapper>
        <BackButton handler={() => navigation.goBack()} />
        <H1Text>{i18n.t("kyc.kyc_step3")}</H1Text>
        <PText>{i18n.t("kyc.kyc_step3_text")}</PText>
        <ScrollViewWrapper>
          <IdImg source={{ uri: photoId.uri }} />
          <H1Text>{i18n.t("kyc_label.personal_data")}</H1Text>
          <TextInput
            type={i18n.t("kyc_label.last_name")}
            value=""
            edit={true}
            eventHandler={(input: string) => {
              this.setState({ lastName: input });
            }}
            secure={false}
          />
          <TextInput
            type={i18n.t("kyc_label.first_name")}
            value=""
            edit={true}
            eventHandler={(input: string) => {
              this.setState({ firstName: input });
            }}
            secure={false}
          />
          <NationInput
            type={i18n.t("kyc_label.nationality")}
            eventHandler={this.setNationality}
            nationality={this.state.nationality}
          />
          <DateInput
            type={i18n.t("kyc_label.birthday")}
            eventHandler={this.setBirthday}
            birthday={this.state.birthday}
          />

          <InputHeaderText>{i18n.t("kyc_label.gender")}</InputHeaderText>
          <View
            style={{ display: "flex", flexDirection: "row", marginBottom: 80 }}
          >
            <ShortOptionButton
              check={this.state.gender === "male" ? "checked" : ""}
              title={i18n.t("kyc_label.male")}
              handler={() =>
                this.setState({
                  gender: this.state.gender === "male" ? "" : "male",
                })
              }
            />
            <ShortOptionButton
              check={this.state.gender === "female" ? "checked" : ""}
              title={i18n.t("kyc_label.female")}
              handler={() =>
                this.setState({
                  gender: this.state.gender === "female" ? "" : "female",
                })
              }
            />
          </View>
          <SubmitButton
            title={i18n.t("kyc_label.complete_input")}
            handler={() => this.setModalVisible(true)}
          />
          {this.state.modalVisible === true && (
            <Modal
              child={
                <View>
                  <ConfirmImg source={KycSubmitPng} />
                  <H1Text>{i18n.t("kyc.kyc_submit")}</H1Text>
                  <PText>{i18n.t("kyc.kyc_submit_text")}</PText>
                </View>
              }
              visible={this.state.modalVisible}
              modalHandler={() => {
                this.setModalVisible(false);
                navigation.navigate("Main", { screen: "Info" });
              }}
              // 다시 더보기 페이지로 돌아가게끔!
            ></Modal>
          )}
        </ScrollViewWrapper>
      </PersonalDataInputWrapper>
    );
  }
}
