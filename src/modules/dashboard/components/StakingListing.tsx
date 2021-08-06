import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import AppColors from '../../../enums/AppColors';
import { H3Text, P1Text } from '../../../shared/components/Texts';
import CryptoImage from '../../../shared/components/CryptoImage';
import CryptoType from '../../../enums/CryptoType';
import StakingInfoBox from './StakingInfoBox';

const StakingListing: React.FC = () => {
  // dummy data
  const myStakingList = {
    EL: [1, 5],
    ELFI: [1, 5],
  };

  return (
    <View
      style={{
        borderBottomWidth: 1,
        borderBottomColor: AppColors.GREY,
        paddingBottom: 12,
        marginTop: 12,
        marginBottom: 10,
      }}>
      <H3Text
        label="내 스테이킹 및 리워드"
        style={{
          paddingBottom: 15,
          marginBottom: 10,
          borderBottomWidth: 1,
          borderBottomColor: AppColors.GREY,
        }}
      />
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          height: 60,
          paddingTop: 5,
          paddingBottom: 5,
          alignItems: 'center',
        }}>
        <CryptoImage type={CryptoType.EL} />
        <CryptoImage
          type={CryptoType.ELFI}
          style={{
            width: 25,
            height: 25,
            position: 'absolute',
            bottom: 5,
            left: 20,
            backgroundColor: 'lime',
          }}
        />
        <P1Text label="EL 스테이킹 및 ELFI 리워드" style={{ marginLeft: 15 }} />
      </View>
      <View style={{ marginTop: 8 }}>
        {myStakingList.EL.map((cycle) => {
          return <StakingInfoBox cryptoType={CryptoType.EL} />;
        })}
      </View>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          height: 60,
          paddingTop: 5,
          paddingBottom: 5,
          alignItems: 'center',
        }}>
        <CryptoImage type={CryptoType.ELFI} />
        <CryptoImage
          type={CryptoType.DAI}
          style={{
            width: 25,
            height: 25,
            position: 'absolute',
            bottom: 5,
            left: 20,
            backgroundColor: 'lime',
          }}
        />
        <P1Text
          label="ELFI 스테이킹 및 DAI 리워드"
          style={{ marginLeft: 15 }}
        />
      </View>
      <View style={{ marginTop: 8 }}>
        {myStakingList.ELFI.map((cycle) => {
          return <StakingInfoBox cryptoType={CryptoType.ELFI} />;
        })}
      </View>
    </View>
  );
};

export default StakingListing;