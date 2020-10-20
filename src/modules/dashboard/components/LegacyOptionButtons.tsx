import React, { FunctionComponent } from 'react';
import { View } from 'react-native';
import LegacyRefundStatus from '../../../enums/LegacyRefundStatus';
import i18n from '../../../i18n/i18n';
import { OwnershipResponse } from '../../../types/Ownership';
import { SubmitButton } from '../../../shared/components/SubmitButton';

interface Props {
  refundHandler: () => void;
  ownership: OwnershipResponse;
}

const LegacyOptionButtons: FunctionComponent<Props> = (props: Props) => {
  return (
    <View>
      <SubmitButton
        style={{
          position: 'relative',
          bottom: 0,
          marginBottom: 10,
          width: '100%',
          marginLeft: 'auto',
          marginRight: 'auto',
          marginTop: 20,
        }}
        disabled={props.ownership.legacyRefundStatus !== LegacyRefundStatus.NONE}
        handler={props.refundHandler}
        title={
          props.ownership.legacyRefundStatus === LegacyRefundStatus.NONE ?
            i18n.t('dashboard_label.withdraw_stake_legacy')
            :
            i18n.t('dashboard_label.withdraw_stake_pending')
        }
        variant={
          props.ownership.legacyRefundStatus === LegacyRefundStatus.NONE ?
            ''
            : 'GrayTheme'
        }
      />
    </View>
  );
};

export default LegacyOptionButtons;
