import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text } from 'react-native';
import PreferenceContext from '../../contexts/PreferenceContext';
import PriceContext from '../../contexts/PriceContext';
import AppColors from '../../enums/AppColors';
import CryptoType from '../../enums/CryptoType';
import { P3Text } from './Texts';

const GasPrice: React.FC<{
  estimatedGas: string;
  gasCrypto: CryptoType;
  insufficientGas: boolean;
}> = ({ estimatedGas, gasCrypto, insufficientGas }) => {
  const { currencyFormatter } = useContext(PreferenceContext);
  const { getCryptoPrice } = useContext(PriceContext);
  const { t } = useTranslation();

  if (!estimatedGas) {
    return <></>;
  }

  return (
    <>
      <P3Text
        label={
          estimatedGas !== 'NaN'
            ? `${t(
                'assets.transaction_fee',
              )}: ${estimatedGas} ${gasCrypto} (${currencyFormatter(
                parseFloat(estimatedGas) * getCryptoPrice(gasCrypto),
              )})`
            : t('staking.cannot_estimate_gas')
        }
        style={{ textAlign: 'center', marginBottom: insufficientGas ? 5 : 10 }}
      />
      <View>
        {insufficientGas && (
          <Text
            style={{
              fontSize: 10,
              right: 0,
              color: AppColors.ERROR_RED,
              textAlign: 'center',
              marginBottom: 5,
            }}>
            {t('assets.insufficient_eth', { crypto: gasCrypto })}
          </Text>
        )}
      </View>
    </>
  );
};

export default GasPrice;
