import React, { Component } from "react";
import { View, ScrollView } from "react-native";
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
import { page } from "./Kyc";
import Api from "../../api/kyc";

const H1Text = styled.Text`
  font-size: 20px;
  color: #1c1c1c;
  text-align: center;
  margin: 25px auto;
  font-weight: bold;
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
`;
const ConfirmImg = styled.Image`
  width: 150px;
  height: 150px;
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

  render() {
    const { route, navigation } = this.props;
    const { selfie_hash, id_type, photoId_hash, photoId } = route.params;
    return (
      <View
        style={{
          width: "100%",
          backgroundColor: "#fff",
          height: "100%",
          flex: 1,
          top: 0,
          position: "relative",
        }}
      >
        <ScrollView
          style={{
            width: "100%",
            flex: 1,
          }}
          contentContainerStyle={{ flex: 1 }}
        >
          <BackButton handler={() => navigation.goBack()} />
          <H1Text>{i18n.t("kyc.kyc_step3")}</H1Text>
          <PText>{i18n.t("kyc.kyc_step3_text")}</PText>
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
          <View style={{ display: "flex", flexDirection: "row" }}>
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
            handler={() => {
              if (this.state.gender === "") {
                alert(i18n.t("kyc.alert_data"));
              } else {
                // Api.submission(
                //   this.state.firstName,
                //   this.state.lastName,
                //   this.state.nationality,
                //   this.state.birthday,
                //   this.state.gender,
                //   id_type === "passport" ? "passport" : "government_id",
                //   photoId_hash,
                //   selfie_hash
                // )
                //   .then((res) => {
                this.setModalVisible(true);
                // })
                // .catch((e) => console.error(e));
              }
            }}
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
              }}
              // 다시 더보기 페이지로 돌아가게끔!
            ></Modal>
          )}
        </ScrollView>
      </View>
      // </ScrollView>
    );
  }
}
