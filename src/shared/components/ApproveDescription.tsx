import React from 'react';
import { useEffect } from 'react';
import { View } from 'react-native';
import AppColors from '../../enums/AppColors';
import useErcContract from '../../hooks/useErcContract';
import { H3Text, P3Text } from './Texts';

type Props = {
  approveGasPrice?: string;
};

const ApproveDescription: React.FC<Props> = ({ approveGasPrice }) => {
  return (
    <View
      style={{
        alignItems: 'center',
        marginTop: 57,
      }}>
      <H3Text
        label={'접근 권한을 승인해주세요!'}
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
        label={
          '부동산 토큰을 구매하기 위해서는 연결된 지갑에\n해당 앱이 접근할 수 있도록 접근 권한을 승인해야 합니다.'
        }
        style={{
          fontSize: 14,
          color: AppColors.BLACK,
          textAlign: 'center',
          marginBottom: 26,
        }}
      />
      <P3Text
        label={
          '최초 구매 시에만 승인이 필요하며, 승인이 성공적으로\n완료될 경우, 이후의 거래에는 권한 승인 없이 부동산\n토큰을 구매하실 수 있습니다.'
        }
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
          label={`접근 권한 승인 또한 이더리움 네트워크를 이용한 트랜잭션이기 때문에 가스비가 발생합니다. 예상 가스비는 ${approveGasPrice} ETH 입니다.`}
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
