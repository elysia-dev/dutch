import { useNavigation } from '@react-navigation/native';
import React, { FunctionComponent } from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import i18n from '../../../i18n/i18n';
import { P1Text } from '../../../shared/components/Texts';

interface Props {
  refundHandler: () => void;
  purchaseHandler: () => void;
  interestHandler: () => void;
  productId: number;
  paymentMethod: string;
  interestAvailability: boolean;
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
          elevation: 4,
          justifyContent: 'center',
          alignContent: 'center',
        }}>
        <Image
          style={{
            width: 45,
            height: 45,
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
          source={require('../images/purchase.png')}></Image>
        <P1Text
          style={{ textAlign: 'center' }}
          label={i18n.t('dashboard_label.purchase')}
        />
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
          elevation: 4,
          justifyContent: 'center',
          alignContent: 'center',
        }}>
        <Image
          style={{
            width: 45,
            height: 45,
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
          source={require('../images/stakeWithdraw.png')}></Image>
        <P1Text
          style={{ textAlign: 'center' }}
          label={i18n.t('dashboard_label.withdraw_stake', {
            paymentMethod: props.paymentMethod.toUpperCase(),
          })}
        />
      </TouchableOpacity>
      <TouchableOpacity
        disabled={!props.interestAvailability}
        onPress={props.interestHandler}
        style={{
          backgroundColor: '#fff',
          width: 100,
          height: 95,
          borderRadius: 10,
          shadowOffset: { width: 2, height: 1 },
          shadowColor: '#00000033',
          shadowOpacity: 0.8,
          shadowRadius: 5,
          elevation: 4,
          justifyContent: 'center',
          alignContent: 'center',
        }}>
        <Image
          style={{
            width: 45,
            height: 45,
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
          source={require('../images/withdraw_interest.png')}></Image>
        <P1Text
          style={{ textAlign: 'center' }}
          label={i18n.t('dashboard_label.withdraw_profit')}
        />
      </TouchableOpacity>
    </View>
  );
};

export default OptionButtons;
