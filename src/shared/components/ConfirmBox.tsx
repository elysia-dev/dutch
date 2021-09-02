import React from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import AppColors from '../../enums/AppColors';
import { H3Text } from './Texts';

type Props = {
  isApprove: boolean;
};

const ConfirmBox: React.FC<Props> = ({ isApprove }) => {
  const { t } = useTranslation();

  return (
    <View
      style={{
        flexDirection: 'row',
      }}>
      <View
        style={{
          height: 37,
          width: '50%',
          backgroundColor: isApprove ? AppColors.SUB_GREY : AppColors.BLACK2,
          borderTopLeftRadius: 5,
          borderBottomLeftRadius: 5,
          justifyContent: 'center',
        }}>
        <H3Text
          label={`${t('assets.approve_step', { step: 1 })}\n${t(
            'assets.approve_step_authorization',
          )}`}
          style={{
            fontSize: 10,
            color: AppColors.WHITE,
            paddingLeft: 9,
          }}
        />
      </View>
      <View
        style={{
          height: 37,
          width: '50%',
          backgroundColor: !isApprove ? AppColors.SUB_GREY : AppColors.BLACK2,
          borderTopRightRadius: 5,
          borderBottomRightRadius: 5,
          justifyContent: 'center',
        }}>
        <H3Text
          label={`${t('assets.approve_step', { step: 2 })}\n${t(
            'assets.approve_step_confirm',
          )}`}
          style={{
            fontSize: 10,
            color: AppColors.WHITE,
            paddingRight: 9,
            textAlign: 'right',
          }}
        />
      </View>
      <View
        style={{
          position: 'absolute',
          left: '50%',
          borderTopWidth: 18.5,
          borderBottomWidth: 18.5,
          borderLeftWidth: 19,
          borderTopColor: 'rgba(0,0,0,0)',
          borderBottomColor: 'rgba(0,0,0,0)',
          borderLeftColor: isApprove ? AppColors.SUB_GREY : AppColors.BLACK2,
        }}
      />
    </View>
  );
};
export default ConfirmBox;
