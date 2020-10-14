import React, { FunctionComponent } from 'react';
import { View, Image, Text, TouchableOpacity } from 'react-native';
import LegacyRefundStatus from '../../../enums/LegacyRefundStatus';
import i18n from '../../../i18n/i18n';
import { OwnershipResponse } from '../../../types/Ownership';

interface Props {
  refundHandler: () => void;
  ownership: OwnershipResponse;
}

const LegacyOptionButtons: FunctionComponent<Props> = (props: Props) => {
  return (
    <View
      style={{
        marginTop: 30,
      }}>
      <TouchableOpacity
        disabled={props.ownership.legacyRefundStatus !== LegacyRefundStatus.NONE}
        onPress={props.refundHandler}
        style={{
          backgroundColor: '#fff',
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
          {
            props.ownership.legacyRefundStatus === LegacyRefundStatus.NONE ?
              i18n.t('dashboard_label.withdraw_stake')
              :
              i18n.t('dashboard_label.withdraw_stake_pending')
          }
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default LegacyOptionButtons;
