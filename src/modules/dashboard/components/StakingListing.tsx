import React, {
  useContext,
  useEffect,
  useState,
  Dispatch,
  SetStateAction,
} from 'react';
import { View } from 'react-native';
import { Contract } from '@ethersproject/contracts';
import { useTranslation } from 'react-i18next';
import AppColors from '../../../enums/AppColors';
import { H3Text, P1Text } from '../../../shared/components/Texts';
import CryptoImage from '../../../shared/components/CryptoImage';
import CryptoType from '../../../enums/CryptoType';
import StakingInfoBox from './StakingInfoBox';
import {
  getElStakingPoolContract,
  getElfiStakingPoolContract,
  getStakingPoolContract,
  provider,
} from '../../../utiles/getContract';
import WalletContext from '../../../contexts/WalletContext';
import {
  ELFI_STAKING_POOL_ADDRESS,
  EL_STAKING_POOL_ADDRESS,
} from 'react-native-dotenv';
import { StakingPool } from '@elysia-dev/contract-typechain';
import { utils } from '@elysia-dev/contract-typechain/node_modules/ethers';

const StakingListing: React.FC<{
  elStakingInfoBoxes: any;
  elfiStakingInfoBoxes: any;
}> = ({ elStakingInfoBoxes, elfiStakingInfoBoxes }) => {
  const { t } = useTranslation();

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
        label={t('main.my_staking')}
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
        <P1Text
          label={t('main.staking_by_crypto', {
            stakingCrypto: CryptoType.EL,
            rewardCrypto: CryptoType.ELFI,
          })}
          style={{ marginLeft: 15 }}
        />
      </View>
      <View style={{ marginTop: 8 }}>{elStakingInfoBoxes}</View>
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
          label={t('main.staking_by_crypto', {
            stakingCrypto: CryptoType.ELFI,
            rewardCrypto: CryptoType.DAI,
          })}
          style={{ marginLeft: 15 }}
        />
      </View>
      <View style={{ marginTop: 8 }}>{elfiStakingInfoBoxes}</View>
    </View>
  );
};

export default StakingListing;
