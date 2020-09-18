import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import styled from "styled-components/native";
import i18n from "../../i18n/i18n";
import { NavigationScreenProp, NavigationRoute } from "react-navigation";
import { BackButton } from "../../shared/components/BackButton";
import { DateInput } from "./components/DateInput";
import { PeriodPicker } from "./components/PeriodPicker";
import { Api } from "../../api/info";

const H1Text = styled.Text`
  color: #1c1c1c;
  font-size: 20px;
  text-align: left;
  margin-top: 15px;
  margin-bottom: 25px;
`;
const PText = styled.Text`
  color: #1c1c1c;
  font-size: 14px;
  text-align: left;
  margin-bottom: 10px;
`;
const GText = styled.Text`
  color: #a7a7a7;
  font-size: 12px;
  text-align: center;
  margin-top: 16px;
`;

interface props {
  navigation: NavigationScreenProp<any>;
  route: NavigationRoute;
}

interface state {
  period: string;
  startDate: string;
  endDate: string;
  all: string;
  deposit: string;
  withdraw: string;
}

const filterButton = (state: boolean, handler: () => void, title: string) => {
  return (
    <TouchableOpacity
      onPress={handler}
      style={{
        width: "100%",
        height: 35,
        backgroundColor: state ? "#64B6F4" : "#E6ECF2",
        borderRadius: 5,
        justifyContent: "center",
        alignContent: "center",
      }}
    >
      <Text
        style={{
          color: state ? "#FFFFFF" : "#5C5B5B",
          fontSize: 14,
          textAlign: "center",
        }}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const submitButton = (title: string, handler: () => void) => {
  return (
    <TouchableOpacity
      style={{
        width: "100%",
        height: 40,
        backgroundColor: "#3679B5",
        borderRadius: 5,
        justifyContent: "center",
        alignContent: "center",
      }}
    >
      <Text
        style={{
          color: "#F5F5F5",
          fontSize: 14,
          textAlign: "center",
        }}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export class TransactionHistory extends Component<props, state> {
  constructor(props: props) {
    super(props);
    this.state = {
      all: "",
      deposit: "",
      withdraw: "",
      period: "0",
      startDate: "",
      endDate: "",
    };
    this.setPeriod = this.setPeriod.bind(this);
    this.resetDate = this.resetDate.bind(this);
    this.setStartDate = this.setStartDate.bind(this);
    this.setEndDate = this.setEndDate.bind(this);
  }

  setPeriod(input: string) {
    this.setState({ period: input });
  }

  resetDate() {
    this.setState({ startDate: "", endDate: "" });
  }

  setStartDate(input: string) {
    this.setState({ startDate: input, period: "0" });
  }

  setEndDate(input: string) {
    this.setState({
      endDate: input,
      period: "0",
    });
  }

  callApi() {
    //startdate enddate 비교?

    const sortingTypes = [
      this.state.all,
      this.state.deposit,
      this.state.withdraw,
    ];

    const sortingTypesToSend = sortingTypes.filter((type) => {
      return type !== "";
    });

    Api.TransactionHistory(
      this.state.startDate,
      this.state.endDate,
      this.state.period,
      sortingTypesToSend.toString()
    )
      .then()
      .catch();
  }

  render() {
    const { navigation, route } = this.props;

    return (
      <View
        style={{
          backgroundColor: "#fff",
          width: "100%",
          height: "100%",
          padding: 20,
        }}
      >
        <BackButton
          style={{ marginTop: 30, marginBottom: 10 }}
          handler={() => navigation.goBack()}
        ></BackButton>
        <H1Text>{i18n.t("info_label.transaction_history")}</H1Text>
        <PText>{i18n.t("info_label.transaction_term")}</PText>
        <View
          style={{
            marginBottom: 15,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <View style={{ width: "20%" }}>
            <PeriodPicker
              period={this.state.period}
              resetHandler={this.resetDate}
              eventHandler={this.setPeriod}
            />
          </View>
          <View style={{ width: "35%" }}>
            <DateInput
              date={this.state.startDate}
              maxDate={this.state.endDate}
              eventHandler={this.setStartDate}
            />
          </View>
          <View
            style={{
              width: "2%",
              justifyContent: "center",
              alignContent: "center",
            }}
          >
            <Text
              style={{
                textAlign: "center",
                color: "#4E4E4E",
              }}
            >
              {"~"}
            </Text>
          </View>
          <View style={{ width: "35%" }}>
            <DateInput
              date={this.state.endDate}
              minDate={this.state.startDate}
              eventHandler={this.setEndDate}
            />
          </View>
        </View>
        <PText>{i18n.t("info_label.transaction_log")}</PText>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 15,
          }}
        >
          <View style={{ width: "30%" }}>
            {filterButton(
              this.state.all === "all",
              () =>
                this.setState({
                  all: this.state.all !== "all" ? "all" : "",
                  deposit: "",
                  withdraw: "",
                }),
              i18n.t("info_label.all")
            )}
          </View>
          <View style={{ width: "30%" }}>
            {filterButton(
              this.state.deposit === "deposit",
              () =>
                this.setState({
                  deposit: this.state.deposit !== "deposit" ? "deposit" : "",
                  all: "",
                  withdraw: "",
                }),
              i18n.t("info_label.deposit")
            )}
          </View>
          <View style={{ width: "30%" }}>
            {filterButton(
              this.state.withdraw === "withdraw",
              () =>
                this.setState({
                  withdraw:
                    this.state.withdraw !== "withdraw" ? "withdraw" : "",
                  all: "",
                  deposit: "",
                }),
              i18n.t("info_label.withdraw")
            )}
          </View>
        </View>

        <View
          style={{
            width: "100%",
            marginBottom: 15,
            marginTop: 20,
          }}
        >
          {submitButton(i18n.t("info_label.search"), () => {})}
        </View>
        <View
          style={{
            width: "100%",
            justifyContent: "center",
            flexDirection: "column",
            flex: 1,
          }}
        >
          <Image
            source={require("./images/warning.png")}
            style={{
              width: 45,
              height: 45,
              resizeMode: "center",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          />
          <GText>{i18n.t("info.no_transaction")}</GText>
        </View>
      </View>
    );
  }
}
