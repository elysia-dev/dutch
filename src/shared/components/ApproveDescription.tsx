import React from 'react';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import AppColors from '../../enums/AppColors';
import useErcContract from '../../hooks/useErcContract';
import decimalFormatter from '../../utiles/decimalFormatter';
import { H3Text, P3Text } from './Texts';

type Props = {
  approveGasPrice: string;
};

const ApproveDescription: React.FC<Props> = ({ approveGasPrice }) => {
  const { t } = useTranslation();
  return (
    <View
      style={{
        alignItems: 'center',
        marginTop: 57,
      }}>
      <H3Text
        label={t('assets.approve_guide')}
        style={{
          fontSize: 18,
        }}
      />
      <View
        style={{
          width: '100%',
          borderTopWidth: 1,
          borderColor: AppColors.GREY,
          marginTop: 15,
          marginBottom: 29,
        }}
      />
      <P3Text
        label={t('assets.approve_guide_first')}
        style={{
          fontSize: 14,
          color: AppColors.BLACK,
          textAlign: 'center',
          marginBottom: 26,
        }}
      />
      <P3Text
        label={t('assets.approve_guide_second')}
        style={{
          fontSize: 14,
          color: AppColors.BLACK,
          textAlign: 'center',
        }}
      />
      <View
        style={{
          width: '100%',
          borderTopWidth: 1,
          borderColor: AppColors.GREY,
          marginTop: 33,
          marginBottom: 12,
        }}
      />
      <View
        style={{
          flexDirection: 'row',
        }}>
        <P3Text
          label={'*'}
          style={{
            fontSize: 12,
            color: AppColors.BLACK,
            lineHeight: 25,
            paddingRight: 3,
          }}
        />
        <P3Text
          label={t('assets.approve_guide_gasprice', {
            gasPrice: decimalFormatter(parseFloat(approveGasPrice), 6),
          })}
          style={{
            lineHeight: 20,
            fontSize: 12,
            color: AppColors.BLACK,
          }}
        />
      </View>
    </View>
  );
};

export default ApproveDescription;
