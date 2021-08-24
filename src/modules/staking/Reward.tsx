import React, { useContext, useEffect, useState } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { BigNumber } from '@ethersproject/bignumber';
import { ethers, utils, constants } from 'ethers';
import { useRoute, RouteProp } from '@react-navigation/native';
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
import WalletContext from '../../contexts/WalletContext';
import PaymentSelection from '../../shared/components/PaymentSelection';
import AssetContext from '../../contexts/AssetContext';
import useTxHandler from '../../hooks/useTxHandler';
import useStakingInfo from '../../hooks/useStakingInfo';
import useEstimateGas from '../../hooks/useEstimateGas';
import StakingType from '../../enums/StakingType';
import useStakingByType from '../../hooks/useStakingByType';

type ParamList = {
  Reward: {
    cryptoType: CryptoType;
    rewardCryptoType: CryptoType;
    selectedRound: number;
    currentRound: number;
  };
};

const Reward: React.FC = () => {
  const route = useRoute<RouteProp<ParamList, 'Reward'>>();
  const { rewardCryptoType, selectedRound, cryptoType, currentRound } =
    route.params;
  const insets = useSafeAreaInsets();
  const { getCryptoPrice } = useContext(PriceContext);
  const { isWalletUser, user } = useContext(UserContext);
  const { wallet } = useContext(WalletContext);
  const { afterTxFailed } = useTxHandler();
  const { t } = useTranslation();
  const [selectionVisible, setSelectionVisible] = useState(false);
  const { getBalance } = useContext(AssetContext);
  const { estimagedGasPrice } = useEstimateGas(
    cryptoType,
    StakingType.Reward,
    selectedRound,
  );
  const { isLoading, stakeByType } = useStakingByType(cryptoType);
  const address = isWalletUser
    ? wallet?.getFirstAddress()
    : user.ethAddresses[0];
  const { reward } = useStakingInfo(cryptoType, selectedRound);

  const onPressClaim = async () => {
    try {
      stakeByType('', selectedRound, StakingType.Reward);
    } catch (error) {
      afterTxFailed('Transaction failed');
      console.log(error);
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
            value={commaFormatter(reward)}
            subValue={`$ ${commaFormatter(
              decimalFormatter(reward * getCryptoPrice(rewardCryptoType), 5),
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
      value={0}
      page="staking"
      stakingTxData={{
        type: 'reward',
        unit: rewardCryptoType,
        round: selectedRound,
        rewardValue: value,
      }}
      contractAddress={contract?.address}
    />
  );
};

export default Reward;
