import { useNavigation } from '@react-navigation/native';
import React, { FunctionComponent } from 'react';
import { View, Image, Text, TouchableOpacity } from 'react-native';
import { ProductPage } from '../../../enums/pageEnum';
import i18n from '../../../i18n/i18n';

interface Props {
  refundHandler: () => void;
  purchaseHandler: () => void;
  productId: number;
}

const OptionButtons: FunctionComponent<Props> = (props: Props) => {
  const navigation = useNavigation();

  return (
    <View
      style={{
        marginTop: 30,
        flexDirection: 'row',
        justifyContent: 'space-between',
      }}>
      <TouchableOpacity
        onPress={props.purchaseHandler}
        style={{
          backgroundColor: '#fff',
          width: 100,
          height: 95,
          borderRadius: 10,
          shadowOffset: { width: 2, height: 1 },
          shadowColor: '#00000033',
          shadowOpacity: 0.8,
          shadowRadius: 5,
          justifyContent: 'center',
          alignContent: 'center',
        }}>
        <Image
          style={{
            width: 45,
            height: 45,
            resizeMode: 'center',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
          source={require('../images/purchase.png')}></Image>
        <Text style={{ fontSize: 15, color: '#1C1C1C', textAlign: 'center' }}>
          {i18n.t('dashboard_label.purchase')}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={props.refundHandler}
        style={{
          backgroundColor: '#fff',

          width: 100,
          height: 95,
          borderRadius: 10,
          shadowOffset: { width: 2, height: 1 },
          shadowColor: '#00000033',
          shadowOpacity: 0.8,
          shadowRadius: 5,
          justifyContent: 'center',
          alignContent: 'center',
        }}>
        <Image
          style={{
            width: 45,
            height: 45,
            resizeMode: 'center',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
          source={require('../images/stakeWithdraw.png')}></Image>
        <Text style={{ fontSize: 15, color: '#1C1C1C', textAlign: 'center' }}>
          {i18n.t('dashboard_label.withdraw_stake')}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {}}
        style={{
          backgroundColor: '#fff',

          width: 100,
          height: 95,
          borderRadius: 10,
          shadowOffset: { width: 2, height: 1 },
          shadowColor: '#00000033',
          shadowOpacity: 0.8,
          shadowRadius: 5,
          justifyContent: 'center',
          alignContent: 'center',
        }}>
        <Image
          style={{
            width: 45,
            height: 45,
            resizeMode: 'center',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
          source={require('../images/profitWithdraw.png')}></Image>
        <Text style={{ fontSize: 15, color: '#1C1C1C', textAlign: 'center' }}>
          {i18n.t('dashboard_label.withdraw_profit')}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default OptionButtons;
