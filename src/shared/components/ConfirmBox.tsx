import React from 'react';
import { View } from 'react-native';
import AppColors from '../../enums/AppColors';
import { H3Text } from './Texts';

type Props = {
  isApprove: boolean;
};

const ConfirmBox: React.FC<Props> = ({ isApprove }) => {
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
          label={'1단계\n권한승인'}
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
          label={'2단계\n최종확인'}
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
