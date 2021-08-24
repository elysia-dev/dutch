import React, { useContext, useEffect } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
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
import AssetContext from '../../contexts/AssetContext';
import useTxHandler from '../../hooks/useTxHandler';
import useStakingInfo from '../../hooks/useStakingInfo';
import useEstimateGas from '../../hooks/useEstimateGas';
import StakingType from '../../enums/StakingType';
import useStakingByType from '../../hooks/useStakingByType';

const Reward: React.FC<{ route: any }> = ({ route }) => {
  const { cryptoType, rewardCryptoType, selectedRound, currentRound } =
    route.params;
  const insets = useSafeAreaInsets();
  const { getCryptoPrice } = useContext(PriceContext);
  const { isWalletUser, user } = useContext(UserContext);
  const { wallet } = useContext(WalletContext);
  const { afterTxFailed } = useTxHandler();
  const { t } = useTranslation();
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
                console.log('보상 수령 해야 함 (외부 지갑 유저)');
              }
            }}
            isLoading={isLoading}
          />
        </View>
      </View>
    </View>
  );
};

export default Reward;
