import React, { FunctionComponent, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { View, TouchableOpacity } from 'react-native';
import PreferenceContext from '../../../contexts/PreferenceContext';
import AppColors from '../../../enums/AppColors';
import CryptoType from '../../../enums/CryptoType';
import CryptoImage from '../../../shared/components/CryptoImage';
import { H3Text, P1Text } from '../../../shared/components/Texts';

interface Props {
  balance: number;
  handler: () => void;
}

const LegacyWallet: FunctionComponent<Props> = ({
  balance,
  handler,
}) => {
  const { t } = useTranslation();
  const { currencyFormatter } = useContext(PreferenceContext);

  return (
    <View style={{ marginTop: 20 }}>
      <View style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingBottom: 15,
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: AppColors.GREY,
      }}>
        <H3Text label={t("dashboard_label.remaining_balance")} />
      </View>
      <TouchableOpacity
        onPress={() => { handler(); }}
        style={{ display: 'flex', flexDirection: 'row', height: 60, paddingTop: 5, paddingBottom: 5, alignItems: 'center' }}
      >
        <CryptoImage type={CryptoType.EL} />
        <View style={{ marginLeft: 15 }}>
          <P1Text label={'EL / USD'} />
        </View>
        <P1Text
          style={{ marginLeft: 'auto' }}
          label={currencyFormatter(
            balance,
            2,
          )}
        />
      </TouchableOpacity>
      <View style={{
        height: 15,
        borderBottomWidth: 1,
        borderBottomColor: AppColors.GREY,
      }} />
    </View>
  );
};

export default LegacyWallet;
