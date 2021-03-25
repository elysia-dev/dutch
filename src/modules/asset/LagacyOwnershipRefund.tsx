/* eslint-disable radix */
import React, {
  FunctionComponent, useContext,
} from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { SubmitButton } from '../../shared/components/SubmitButton';
import { P1Text } from '../../shared/components/Texts';
import SheetHeader from '../../shared/components/SheetHeader';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { showMessage } from 'react-native-flash-message';
import UserContext from '../../contexts/UserContext';

type ParamList = {
  LegacyOwnershipRefund: {
    ownershipId: number,
  };
};

const LegacyOwnershipRefund: FunctionComponent = () => {
  const { t } = useTranslation();
  const route = useRoute<RouteProp<ParamList, 'LegacyOwnershipRefund'>>()
  const navigation = useNavigation();
  const { Server } = useContext(UserContext);

  const callApi = () => {
    Server.ownershipLegacyRefund(route.params.ownershipId)
      .then(() => {
        showMessage({
          message: t('more.question_submitted'),
        })
        navigation.goBack();
      })
      .catch((e) => {
        if (e.response.status === 404) {
          alert(t('dashboard.ownership_error'));
        } else if (e.response.status === 500) {
          alert(t('account_errors.server'));
        }
      });
  }

  return (
    <>
      <SheetHeader title={t('dashboard_label.withdraw_stake_legacy')} />
      <View
        style={{
          paddingLeft: 20,
          paddingRight: 20,
          height: '100%',
          backgroundColor: '#fff',
        }}>
        <View
          style={{
            flexDirection: 'column',
            alignContent: 'space-between',
            position: 'relative',
            width: '100%',
            backgroundColor: '#F6F6F8',
            borderWidth: 2,
            borderColor: '#F1F1F1',
            borderRadius: 10,
            padding: 15,
            marginTop: 30,
          }}
        >
          <P1Text
            label={t('legacy.refund_notice')}
          />
        </View>
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
          handler={() => { callApi() }}
          title={t('product_label.legacy_refund')}
        />
      </View>
    </>
  );
};

export default LegacyOwnershipRefund;
