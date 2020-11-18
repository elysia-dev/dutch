import React, { FunctionComponent, useContext, useState } from 'react';
import { View, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import i18n from '../../i18n/i18n';
import WrapperLayout from '../../shared/components/WrapperLayout';
import { P2Text, H2Text, P1Text } from '../../shared/components/Texts';

const MyWallet: FunctionComponent = () => {
  const navigation = useNavigation();

  return (
    <WrapperLayout
      isScrolling={false}
      title={'My Wallet'}
      backButtonHandler={() => navigation.goBack()}
      body={
        <View style={{
          backgroundColor: "#fff",
          padding: 20,
          height: 247,
          shadowOffset: { width: 2, height: 2 },
          shadowColor: '#1C1C1C4D',
          shadowOpacity: 0.8,
          shadowRadius: 7,
          elevation: 6,
          marginLeft: "5%",
          marginRight: "5%",
          borderRadius: 10,
        }}>
          <View style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}>
            <View>
              <P2Text label={i18n.t("more_label.metamask_wallet")} />
              <H2Text label={'$ 123'} />
            </View>
            <View style={{
              backgroundColor: "#fff",
              width: 54,
              height: 54,
              shadowOffset: { width: 2, height: 2 },
              shadowColor: '#1C1C1C4D',
              shadowOpacity: 0.8,
              shadowRadius: 7,
              elevation: 6,
              borderRadius: 32,
              justifyContent: 'center',
              alignContent: 'center',
            }}>
              <Image source={require('./images/metamask_icon.png')}
                style={{ marginLeft: 'auto', marginRight: 'auto' }} />
            </View>
          </View>
          <View style={{
            backgroundColor: "#F6F6F8",
            borderWidth: 2,
            borderColor: "#F1F1F1",
            height: 130,
            borderRadius: 10,
            marginTop: 17,
            flexDirection: "column",
          }}>
            <View style={{ padding: 12, flex: 2 }}>
              <P2Text label={i18n.t("more_label.ethaddress")} style={{ marginBottom: 5 }} />
              <P1Text label={'0x12312312312312312321312313123125453'} />
            </View>
            <View style={{ flex: 1, paddingHorizontal: 12, flexDirection: "row", justifyContent: "space-between", borderTopWidth: 2, borderColor: "#F1F1F1", paddingTop: 12 }}>
              <P2Text label={i18n.t("more_label.balance")} style={{ marginBottom: 5 }} />
              <P1Text label={'EL 1234.5678'} />
            </View>
          </View>
        </View>
      }
    />
  );
};

export default MyWallet;
