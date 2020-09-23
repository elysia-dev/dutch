/* eslint-disable radix */
import React, { Component, useState, useContext } from 'react';
import {
  View,
  ScrollView,
  Image,
  Text,
  SafeAreaView,
  Platform,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import styled from 'styled-components/native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { NavigationScreenProp, NavigationRoute } from 'react-navigation';
import i18n from '../../i18n/i18n';
import { Calculator } from './components/Calculator';
import { SubmitButton } from '../../shared/components/SubmitButton';
import Api from '../../api/product';

const DesView = styled.View`
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;
const GText = styled.Text`
  color: #626368;
  font-size: 15px;
  text-align: left;
`;
const PText = styled.Text`
  color: #1c1c1c;
  font-size: 15px;
  text-align: right;
  font-weight: bold;
`;
const BText = styled.Text`
  color: #3679b5;
  font-size: 20px;
  text-align: right;
  font-weight: bold;
`;

type ParamList = {
  ProductBuying: {
    return: string;
  };
};

interface Props {
  navigation: NavigationScreenProp<any>;
  route: RouteProp<ParamList, 'ProductBuying'>;
}

interface State {
  tokenCount: number;
  elPrice: number;
  ethPrice: number;
}

class SliderProductBuying extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { tokenCount: 10, elPrice: 0, ethPrice: 0 };
  }

  callApi() {
    Api.elysiaPrice()
      .then((res) => this.setState({ elPrice: res.data.elysia.usd }))
      .catch((e) => {
        if (e.response.status === 500) {
          alert(i18n.t('account_errors.server'));
        }
      });
    Api.ethereumPrice()
      .then((res) => this.setState({ ethPrice: res.data.ethereum.usd }))
      .catch((e) => {
        if (e.response.status === 500) {
          alert(i18n.t('account_errors.server'));
        }
      });
  }

  componentDidMount() {
    this.callApi();
  }
  render() {
    const { route, navigation } = this.props;
    return (
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
          paddingLeft: 20,
          paddingRight: 20,
          height: '70%',
          width: '100%',
          backgroundColor: '#fff',
          justifyContent: 'center',
        }}>
        <TouchableOpacity
          style={{
            position: 'relative',
            top: 0,
            width: '100%',
          }}
          onPress={() => navigation.goBack()}>
          <Image
            source={require('./images/bluedownarrow.png')}
            style={{
              width: 30,
              height: 30,
              marginLeft: 'auto',
              marginRight: 'auto',
              resizeMode: 'center',
            }}
          />
        </TouchableOpacity>
        <Calculator
          countHandler={(token: number) => {
            this.setState({ tokenCount: token });
          }}
          tokenCount={this.state.tokenCount}
          return={route.params.return}
        />
        <View
          style={{
            flexDirection: 'column',
            alignContent: 'space-between',
            position: 'relative',
            top: 0,
            width: '100%',
            height: '35%',
            backgroundColor: '#F6F6F8',
            borderWidth: 2,
            borderColor: '#F1F1F1',
            borderRadius: 10,
            padding: 15,
          }}>
          <DesView>
            <GText>{i18n.t('product_label.investment')}</GText>
            <PText>{`$${parseFloat(`${5.0 * this.state.tokenCount}`).toFixed(
              2,
            )}`}</PText>
          </DesView>
          <DesView>
            <GText>{i18n.t('product_label.el_price')}</GText>
            <PText>{`EL ${parseFloat(
              `${(5.0 * this.state.tokenCount) / this.state.elPrice}`,
            ).toFixed(2)}`}</PText>
          </DesView>
          <DesView>
            <GText>{i18n.t('product_label.eth_price')}</GText>
            <PText>{`ETH ${parseFloat(
              `${(5 * this.state.tokenCount) / this.state.ethPrice}`,
            ).toFixed(2)}`}</PText>
          </DesView>
          <View
            style={{
              flex: 1,
              alignContent: 'center',
              justifyContent: 'center',
            }}>
            <View
              style={{
                width: '100%',
                height: 0,
                borderWidth: 1,
                borderColor: '#F1F1F1',
              }}></View>
          </View>
          <DesView>
            <GText style={{ color: '#1C1C1C' }}>
              {i18n.t('product_label.expected_return')}
            </GText>
            <BText>{`$${parseFloat(
              `${0.01 *
                parseInt(route.params.return) *
                5 *
                this.state.tokenCount}`,
            ).toFixed(2)}`}</BText>
          </DesView>
        </View>
        <SubmitButton
          style={{
            position: 'relative',
            bottom: 0,
            marginBottom: 10,
            width: '100%',
            marginLeft: 'auto',
            marginRight: 'auto',
            marginTop: 10,
          }}
          handler={() => {}}
          title={i18n.t('product_label.buy_now')}
        />
      </View>
    );
  }
}

export default SliderProductBuying;
