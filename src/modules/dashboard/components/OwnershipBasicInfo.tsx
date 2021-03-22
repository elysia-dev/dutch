import React, { FunctionComponent, useContext } from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import * as Linking from 'expo-linking';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next'
import { OwnershipResponse } from '../../../types/Ownership';
import { DashboardPage } from '../../../enums/pageEnum';
import {
  H2Text,
  H3Text,
  P1Text,
  P2Text,
} from '../../../shared/components/Texts';
import LocaleType from '../../../enums/LocaleType';
import getEnvironment from '../../../utiles/getEnvironment';
import UserContext from '../../../contexts/UserContext';
import PreferenceContext from '../../../contexts/PreferenceContext';

type props = React.PropsWithChildren<{ ownership: OwnershipResponse }>;

const OwnershipBasicInfo: FunctionComponent<props> = (props: props) => {
  const navigation = useNavigation();
  const ownership = props.ownership;
  const { currencyFormatter, language } = useContext(PreferenceContext)
  const { user } = useContext(UserContext);
  const { t } = useTranslation();

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
              label={`ELYSIA co.Ltd  |  ${ownership.product.title} ${ownership.isLegacy ? ownership.legacyPaymentMethod : ''
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
                    : `https://kovan.etherscan.io/token/${ownership.product.contractAddress}`,
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
                label={t('dashboard_label.token_contract')}
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
              label={t('dashboard_label.stake')}
              style={{ color: '#626368', flex: 1 }}
            />
            <P1Text
              style={{ flex: 1, textAlign: 'right' }}
              label={
                parseFloat(ownership.stake) < 0.01
                  ? `${language !== LocaleType.KO
                    ? t('dashboard_label.less')
                    : ''
                  } 0.01%${language === LocaleType.KO
                    ? t('dashboard_label.less')
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
              label={t('dashboard_label.total_interest')}
              style={{ color: '#626368' }}
            />
            <P1Text
              label={currencyFormatter(
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
                label={t('dashboard_label.available_interest')}
                style={{ color: '#626368' }}
              />
              <P1Text
                label={currencyFormatter(
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
          label={t('dashboard_label.product_info')}
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
            <P1Text label={t('dashboard_label.documents')} />
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
            <P1Text label={t('dashboard_label.notice')} />
            <Image source={require('../images/graynextbutton.png')} />
          </View>
        </TouchableOpacity>
      </View>
    </>
  );
};

export default OwnershipBasicInfo;
