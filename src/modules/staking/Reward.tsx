import React, { useContext, useState } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useRoute, RouteProp } from '@react-navigation/native';
import {
  EL_STAKING_POOL_ADDRESS,
  ELFI_STAKING_POOL_ADDRESS,
} from 'react-native-dotenv';
import SheetHeader from '../../shared/components/SheetHeader';
import AppColors from '../../enums/AppColors';
import CryptoInput from '../asset/components/CryptoInput';
import PriceContext from '../../contexts/PriceContext';
import NextButton from '../../shared/components/NextButton';
import GasPrice from '../../shared/components/GasPrice';
import CryptoType from '../../enums/CryptoType';
import decimalFormatter from '../../utiles/decimalFormatter';
import commaFormatter from '../../utiles/commaFormatter';
import UserContext from '../../contexts/UserContext';
import PaymentSelection from '../../shared/components/PaymentSelection';
import AssetContext from '../../contexts/AssetContext';
import useTxHandler from '../../hooks/useTxHandler';
import useStakingInfo from '../../hooks/useStakingInfo';
import useStakeEstimatedGas from '../../hooks/useStakeEstimatedGas';
import StakingType from '../../enums/StakingType';
import useStakingByType from '../../hooks/useStakingByType';
import { useEffect } from 'react';

type ParamList = {
  Reward: {
    cryptoType: CryptoType;
    rewardCryptoType: CryptoType;
    selectedRound: number;
  };
};

const Reward: React.FC = () => {
  const route = useRoute<RouteProp<ParamList, 'Reward'>>();
  const { rewardCryptoType, selectedRound, cryptoType } = route.params;
  const insets = useSafeAreaInsets();
  const { getCryptoPrice } = useContext(PriceContext);
  const { isWalletUser } = useContext(UserContext);
  const { afterTxFailed } = useTxHandler();
  const { t } = useTranslation();
  const [selectionVisible, setSelectionVisible] = useState(false);
  const { getBalance } = useContext(AssetContext);
  const { estimagedGasPrice } = useStakeEstimatedGas(
    cryptoType,
    StakingType.Reward,
    selectedRound,
  );

  const [isLoading, setIsLoading] = useState(false);
  const { stakeByType } = useStakingByType(cryptoType, setIsLoading);
  const { reward } = useStakingInfo(cryptoType, selectedRound);
  const stakingPoolAddress =
    cryptoType === CryptoType.EL
      ? EL_STAKING_POOL_ADDRESS
      : ELFI_STAKING_POOL_ADDRESS;

  const onPressClaim = async () => {
    try {
      await stakeByType('', selectedRound, StakingType.Reward);
    } catch (error) {
      console.log(error);
      afterTxFailed('Transaction failed');
    }
  };

  if (!selectionVisible) {
    return (
      <View style={{ backgroundColor: AppColors.WHITE, height: '100%' }}>
        <SheetHeader title={t('staking.claim_rewards')} />
        <View
          style={{
            paddingHorizontal: 20,
            flex: 1,
            alignItems: 'center',
          }}>
          <CryptoInput
            title={t('staking.rewards')}
            value={commaFormatter(userReward)}
            subValue={`$ ${commaFormatter(
              decimalFormatter(
                userReward * getCryptoPrice(rewardCryptoType),
                5,
              ),
            )}`}
            cryptoTitle={rewardCryptoType}
            cryptoType={rewardCryptoType}
            onPress={() => {}}
            active={true}
            style={{ width: '100%' }}
          />
          <View style={{ height: 10 }} />
          <GasPrice
            estimatedGas={estimagedGasPrice}
            gasCrypto={CryptoType.ETH}
            insufficientGas={
              getBalance(CryptoType.ETH) < parseFloat(estimagedGasPrice)
            }
          />
          <View
            style={{
              position: 'absolute',
              width: '100%',
              bottom: insets.bottom || 10,
            }}>
            <NextButton
              title={t('staking.claim')}
              disabled={false}
              handler={() => {
                if (isWalletUser) {
                  onPressClaim();
                } else {
                  setSelectionVisible(true);
                }
              }}
              isLoading={isLoading}
            />
          </View>
        </View>
      </View>
    );
  }

  return (
    <PaymentSelection
      value={reward}
      page="staking"
      stakingTxData={{
        type: 'reward',
        unit: rewardCryptoType,
        round: selectedRound,
        rewardValue: 0,
      }}
      contractAddress={stakingPoolAddress}
    />
  );
};

export default Reward;
