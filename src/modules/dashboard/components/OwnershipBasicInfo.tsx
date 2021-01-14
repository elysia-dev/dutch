import React, { FunctionComponent, useContext } from 'react';
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
import userChannel from '../../../utiles/userChannel';
import RootContext from '../../../contexts/RootContext';
import LocaleType from '../../../enums/LocaleType';
import currencyFormatter from '../../../utiles/currencyFormatter';
import getEnvironment from '../../../utiles/getEnvironment';

type props = React.PropsWithChildren<{ ownership: OwnershipResponse }>;

const OwnershipBasicInfo: FunctionComponent<props> = (props: props) => {
  const navigation = useNavigation();
  const ownership = props.ownership;
  const { user, currencyUnit, currencyRatio } = useContext(RootContext);

  return (
    <>
      <View
        style={{
          backgroundColor: '#fff',
          padding: 20,
          width: '100%',
          height: ownership.isLegacy ? 320 : 440,
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
                  getEnvironment().envName === 'PRODUCTION'
                    ? `https://etherscan.io/token/${ownership.product.contractAddress}`
                    : `https://ropsten.etherscan.io/token/${ownership.product.contractAddress}`,
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
                elevation: 4,
                justifyContent: 'center',
                alignContent: 'center',
              }}>
              <P1Text
                label={i18n.t('dashboard_label.token_contract')}
                style={{ textAlign: 'center', fontSize: 13 }}
              />
            </TouchableOpacity>
          )}
        </View>
        <View
          style={{
            marginTop: ownership.isLegacy ? 10 : 45,
            width: '100%',
            height: 170,
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
              style={{ color: '#626368', flex: 1 }}
            />
            <P1Text
              style={{ flex: 1, textAlign: 'right' }}
              label={
                parseFloat(ownership.stake) < 0.01
                  ? `${
                      user.language !== LocaleType.KO
                        ? i18n.t('dashboard_label.less')
                        : ''
                    } 0.01%${
                      user.language === LocaleType.KO
                        ? i18n.t('dashboard_label.less')
                        : ''
                    }`
                  : `${parseFloat(ownership.stake).toFixed(2)}%`
              }
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
              label={currencyFormatter(
                currencyUnit,
                currencyRatio,
                parseFloat(ownership.expectProfit),
                4,
              )}
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
                label={currencyFormatter(
                  currencyUnit,
                  currencyRatio,
                  parseFloat(ownership.availableProfit),
                  4,
                )}
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
