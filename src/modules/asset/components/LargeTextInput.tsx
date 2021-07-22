import React from 'react';
import { View, Text, Platform } from 'react-native';
import { useTranslation } from 'react-i18next';
import AppFonts from '../../../enums/AppFonts';
import commaFormatter from '../../../utiles/commaFormatter';
import GuideText from './GuideText';
import AppColors from '../../../enums/AppColors';
import PurposeType from '../../../enums/PurposeType';

interface Props {
  current: string;
  value: string;
  type: string;
  purpose: PurposeType;
  tokenType: string;
  priceInCryptocurrency: string;
  cryptocurrencyType: string;
}

const LargeTextInput: React.FC<Props> = ({
  current,
  value,
  type,
  purpose,
  tokenType,
  priceInCryptocurrency,
  cryptocurrencyType,
}) => {
  const { t } = useTranslation();

  if (value) {
    let valueFontSize = 30;
    if (value.length > 10) {
      valueFontSize -= value.length - 10;
    }

    return (
      <>
        <View
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: current === 'token' ? 'flex-end' : 'space-between',
            alignItems: 'flex-end',
            marginBottom: Platform.OS === 'ios' ? -2.5 : 0,
          }}>
          {current === 'fiat' && (
            <Text
              style={{
                fontSize: 25,
                color: AppColors.BLACK2,
                fontFamily: AppFonts.Bold,
              }}>
              $
            </Text>
          )}
          <View
            style={{
              height: 41.8,
              display: 'flex',
              justifyContent: 'flex-end',
            }}>
            <Text
              style={{
                fontSize: valueFontSize,
                color: AppColors.BLACK,
                fontFamily: AppFonts.Bold,
              }}>
              {commaFormatter(value)}
            </Text>
          </View>
          {current === 'token' && (
            <Text
              style={{
                fontSize: 25,
                color: AppColors.BLACK2,
                fontFamily: AppFonts.Bold,
              }}>
              {' ' + type}
            </Text>
          )}
        </View>
        {current === 'token' && (
          <GuideText
            text={`$ ${commaFormatter(
              (Number(value) * 5).toFixed(2),
            )} (= ${priceInCryptocurrency} ${cryptocurrencyType})`}
            style={{
              width: '100%',
              marginTop: 4,
            }}
          />
        )}
        {current === 'fiat' && (
          <GuideText
            text={`${commaFormatter(
              (Number(value) / 5).toFixed(4),
            )} ${tokenType} (= ${priceInCryptocurrency} ${cryptocurrencyType})`}
            style={{
              width: '100%',
              marginTop: 4,
            }}
          />
        )}
        <View
          style={{
            borderBottomWidth: 1,
            borderColor: AppColors.MAIN,
            width: '100%',
            marginTop: 12,
          }}
        />
      </>
    );
  } else {
    return (
      <>
        <Text
          style={{
            fontSize: 30,
            textAlign: 'center',
            color: AppColors.DEACTIVATED,
            fontFamily: AppFonts.Medium,
            marginTop: 12,
            marginBottom: 9,
          }}>
          {current === 'token'
            ? t(`assets.${purpose}_stake_placeholder`)
            : t(`assets.${purpose}_value_placeholder`)}
        </Text>
        <View
          style={{
            borderBottomWidth: 1,
            borderColor: AppColors.MAIN,
            width: '100%',
            marginTop: 12,
          }}
        />
      </>
    );
  }
};

export default LargeTextInput;
