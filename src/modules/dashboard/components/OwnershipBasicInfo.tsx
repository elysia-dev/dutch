import React, {
  FunctionComponent,
  ReactChild,
  ReactElement,
  ReactNode,
} from 'react';
import { View, TouchableOpacity, Image, Text } from 'react-native';
import styled from 'styled-components/native';
import * as Linking from 'expo-linking';
import { useNavigation } from '@react-navigation/native';
import i18n from '../../../i18n/i18n';
import { OwnershipResponse } from '../../../types/Ownership';
import OptionButtons from './OptionButtons';
import { DashboardPage } from '../../../enums/pageEnum';
import Api from '../../../api/product';
import { Api as TransactionApi } from '../../../api/transactions';
import { Transaction } from '../../../types/Transaction';

interface Props {
  ownership: OwnershipResponse;
}

const H1Text = styled.Text`
  color: #1c1c1c;
  font-size: 25px;
  font-weight: bold;
  margin-top: 7px;
  margin-bottom: 6px;
  text-align: left;
  z-index: 3;
`;
const GText = styled.Text`
  color: #626368;
  font-size: 15px;
  text-align: left;
  font-weight: 300;
`;
const ValueText = styled.Text`
  color: #1c1c1c;
  font-size: 15px;
  text-align: right;
  margin-top: 4px;
  font-weight: bold;
`;

const OwnershipBasicInfo: FunctionComponent<Props> = (props: Props) => {
  const navigation = useNavigation();
  const ownership = props.ownership;

  const callPostApi = () => {
    Api.productPost(ownership.product.id)
      .then(res => {
        navigation.navigate(DashboardPage.ProductNotice, { posts: res.data });
      })
      .catch(e => {
        if (e.response.status === 401) {
          alert(i18n.t('account.need_login'));
          navigation.navigate('Account');
        } else if (e.response.status === 500) {
          alert(i18n.t('errors.server.duplicate_email'));
        }
      });
  };

  const callDocsApi = () => {
    Api.productDocs(ownership.product.id)
      .then(res => {
        navigation.navigate(DashboardPage.ProductData, {
          product: ownership.product,
          docs: res.data,
        });
      })
      .catch(e => {
        if (e.response.status === 401) {
          alert(i18n.t('account.need_login'));
          navigation.navigate('Account');
        } else if (e.response.status === 500) {
          alert(i18n.t('errors.server.duplicate_email'));
        }
      });
  };

  return (
    <View
      style={{
        backgroundColor: '#fff',
        padding: 20,
        width: '100%',
        height: 420,
        borderBottomColor: '#F6F6F8',
        borderBottomWidth: 5,
      }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <View>
          <GText>{ownership.product.title}</GText>
          <H1Text>{`$ ${parseFloat(ownership.value).toFixed(2)}`}</H1Text>
          <GText
            onPress={() => {
              Linking.openURL(
                `https://etherscan.io/token/${ownership.product.contractAddress}`,
              );
            }}
            style={{ fontSize: 12, textDecorationLine: 'underline' }}>
            {ownership.product.contractAddress}
          </GText>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
          <TouchableOpacity
            onPress={() => {
              callDocsApi();
            }}
            style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              shadowOffset: { width: 1, height: 2 },
              shadowColor: '#00000033',
              shadowOpacity: 0.8,
              shadowRadius: 3,
              justifyContent: 'center',
              alignContent: 'center',
              backgroundColor: '#fff',
            }}>
            <Image
              style={{
                width: 24,
                height: 24,
                position: 'absolute',
                top: 10,
                left: 10,
                resizeMode: 'center',
              }}
              source={require('../images/productInfo.png')}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => callPostApi()}
            style={{
              marginLeft: 10,
              width: 44,
              height: 44,
              borderRadius: 22,
              shadowOffset: { width: 1, height: 2 },
              shadowColor: '#00000033',
              shadowOpacity: 0.8,
              shadowRadius: 3,
              justifyContent: 'center',
              alignContent: 'center',
              backgroundColor: '#fff',
            }}>
            <Image
              style={{
                width: 24,
                height: 24,
                position: 'absolute',
                top: 10,
                left: 10,
                resizeMode: 'center',
              }}
              source={require('../images/productNotice.png')}
            />
          </TouchableOpacity>
        </View>
      </View>
      <View
        style={{
          marginTop: 45,
          width: '100%',
          height: 120,
          padding: 20,
          backgroundColor: '#F6F6F8',
          borderRadius: 10,
          borderWidth: 1,
          borderColor: '#F1F1F1',
          flexDirection: 'column',
          alignContent: 'space-between',
        }}>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <GText>{i18n.t('dashboard_label.stake')}</GText>
          <ValueText>{`${parseFloat(ownership.stake).toFixed(2)}%`}</ValueText>
        </View>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <GText>{i18n.t('dashboard_label.total_interest')}</GText>
          <ValueText>{`$ ${parseFloat(ownership.expectProfit).toFixed(
            2,
          )}`}</ValueText>
        </View>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <GText>{i18n.t('dashboard_label.available_interest')}</GText>
          <ValueText>{`$ ${parseFloat(ownership.availableProfit).toFixed(
            2,
          )}`}</ValueText>
        </View>
      </View>
      <OptionButtons />
    </View>
  );
};

export default OwnershipBasicInfo;
