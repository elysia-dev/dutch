import React, { FunctionComponent } from 'react';
import { View, TouchableOpacity, Image, Text } from 'react-native';
import styled from 'styled-components/native';
import * as Linking from 'expo-linking';
import { useNavigation } from '@react-navigation/native';
import i18n from '../../../i18n/i18n';
import { OwnershipResponse } from '../../../types/Ownership';
import { DashboardPage } from '../../../enums/pageEnum';
import {
  H1Text,
  H2Text,
  H3Text,
  P1Text,
  P2Text,
} from '../../../shared/components/Texts';

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
  font-weight: 400;
`;

type props = React.PropsWithChildren<{ ownership: OwnershipResponse }>;

const OwnershipBasicInfo: FunctionComponent<props> = (props: props) => {
  const navigation = useNavigation();
  const ownership = props.ownership;

  return (
    <>
      <View
        style={{
          backgroundColor: '#fff',
          padding: 20,
          width: '100%',
          height: ownership.isLegacy ? 300 : 420,
          borderBottomColor: '#F6F6F8',
          borderBottomWidth: 5,
        }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View>
            <P2Text
              style={{ color: '#626368' }}
              label={`ELYSIA co.Ltd  |  ${ownership.product.title} ${
                ownership.isLegacy ? ownership.legacyPaymentMethod : ''
              }`}
            />
            <H2Text
              style={{
                marginTop: 7,

                zIndex: 3,
              }}
              label={`${ownership.product.tokenName} ${ownership.tokenValue}`}
            />
          </View>
          {!ownership.isLegacy && (
            <TouchableOpacity
              onPress={() => {
                Linking.openURL(
                  `https://etherscan.io/token/${ownership.product.contractAddress}`,
                );
              }}
              style={{
                backgroundColor: '#fff',
                width: 120,
                height: 30,
                borderRadius: 15,
                shadowOffset: { width: 1, height: 1 },
                shadowColor: '#00000029',
                shadowOpacity: 0.8,
                shadowRadius: 4,
                justifyContent: 'center',
                alignContent: 'center',
              }}>
              <P1Text
                label={'Token Contract'}
                style={{ textAlign: 'center', fontSize: 13 }}
              />
            </TouchableOpacity>
          )}
        </View>
        <View
          style={{
            marginTop: ownership.isLegacy ? 10 : 45,
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
            <P1Text
              label={i18n.t('dashboard_label.stake')}
              style={{ color: '#626368' }}
            />
            <P1Text
              label={`${
                parseFloat(ownership.stake) < 0.01
                  ? '< 0.01'
                  : parseFloat(ownership.stake).toFixed(2)
              }%`}
            />
          </View>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <P1Text
              label={i18n.t('dashboard_label.total_interest')}
              style={{ color: '#626368' }}
            />
            <P1Text
              label={`$ ${
                parseFloat(ownership.expectProfit) < 0.01
                  ? '< 0.01'
                  : parseFloat(ownership.expectProfit).toFixed(2)
              }`}
            />
          </View>
          {!ownership.isLegacy && (
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <P1Text
                label={i18n.t('dashboard_label.available_interest')}
                style={{ color: '#626368' }}
              />
              <P1Text
                label={`$ ${
                  parseFloat(ownership.availableProfit) < 0.01
                    ? '< 0.01'
                    : parseFloat(ownership.availableProfit).toFixed(2)
                }`}
              />
            </View>
          )}
        </View>
        {props.children}
      </View>
      <View
        style={{
          padding: 20,
          paddingBottom: 0,
          borderBottomColor: '#F6F6F8',
          borderBottomWidth: 5,
        }}>
        <H3Text
          label={i18n.t('dashboard_label.product_info')}
          style={{ marginTop: 5, marginBottom: 20 }}
        />
        <TouchableOpacity
          onPress={() => {
            navigation.navigate(DashboardPage.ProductData, {
              product: ownership.product,
            });
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              height: 60,
              alignItems: 'center',
            }}>
            <P1Text label={i18n.t('dashboard_label.documents')} />
            <Image source={require('../images/graynextbutton.png')} />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate(DashboardPage.ProductNotice, {
              productId: ownership.product.id,
            })
          }>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              height: 60,
              alignItems: 'center',
            }}>
            <P1Text label={i18n.t('dashboard_label.notice')} />
            <Image source={require('../images/graynextbutton.png')} />
          </View>
        </TouchableOpacity>
      </View>
    </>
  );
};

export default OwnershipBasicInfo;
