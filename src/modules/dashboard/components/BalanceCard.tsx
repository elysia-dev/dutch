import React, { FunctionComponent } from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import i18n from '../../../i18n/i18n';
import { P1Text, H1Text } from '../../../shared/components/Texts';

interface Props {
  balance: string;
  handler: () => void;
}

export const BalanceCard: FunctionComponent<Props> = props => {
  return (
    <TouchableOpacity onPress={props.handler}>
      <View
        style={{
          backgroundColor: '#3679B5',
          width: '100%',
          height: 200,
          borderRadius: 10,
          shadowOffset: { width: 2, height: 2 },
          shadowColor: '#3679B54D',
          shadowOpacity: 0.8,
          shadowRadius: 6,
          padding: 20,
          marginBottom: 25,
          elevation: 6,
        }}>
        <P1Text
          label={i18n.t('dashboard_label.total_balance')}
          style={{
            color: "#F6F6F8",
            marginBottom: 30,
          }}
        />
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View style={{ top: 15 }}>
            <H1Text
              label={`$ ${parseFloat(props.balance).toFixed(2)}`}
              style={{
                color: "#FFFFFF",
                fontSize: 40,
                bottom: 11,
              }}
            />
          </View>
          <View
            style={{
              backgroundColor: '#fff',
              width: 60,
              height: 60,
              borderRadius: 30,
              shadowOffset: { width: 0, height: 3 },
              shadowColor: '#1C1C1C4D',
              shadowOpacity: 0.8,
              shadowRadius: 6,
              justifyContent: 'center',
              alignContent: 'center',
              elevation: 6,
            }}>
            <Image
              style={{
                marginLeft: 'auto',
                marginRight: 'auto',
                width: 25,
                height: 25,
                resizeMode: 'center',
              }}
              source={require('../images/chart.png')}></Image>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};
