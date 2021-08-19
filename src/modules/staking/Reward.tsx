import React, { useContext, useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { BigNumber } from '@ethersproject/bignumber';
import { ethers, utils, constants } from 'ethers';
import SheetHeader from '../../shared/components/SheetHeader';
import AppColors from '../../enums/AppColors';
import CryptoInput from '../asset/components/CryptoInput';
import PriceContext from '../../contexts/PriceContext';
import NextButton from '../../shared/components/NextButton';
import GasPrice from '../../shared/components/GasPrice';
import { provider, getStakingPoolContract } from '../../utiles/getContract';
import CryptoType from '../../enums/CryptoType';
import decimalFormatter from '../../utiles/decimalFormatter';
import commaFormatter from '../../utiles/commaFormatter';
import UserContext from '../../contexts/UserContext';
import WalletContext from '../../contexts/WalletContext';
import AssetContext from '../../contexts/AssetContext';
import {
  ELFI_ADDRESS,
  ELFI_STAKING_POOL_ADDRESS,
  EL_ADDRESS,
  EL_STAKING_POOL_ADDRESS,
} from 'react-native-dotenv';
import useTxHandler from '../../hooks/useTxHandler';
import NetworkType from '../../enums/NetworkType';
import { useNavigation } from '@react-navigation/native';

const Reward: React.FC<{ route: any }> = ({ route }) => {
  const { rewardCryptoType, selectedRound, currentRound } = route.params;
  const insets = useSafeAreaInsets();
  const { getCryptoPrice, gasPrice } = useContext(PriceContext);
  const { isWalletUser, user } = useContext(UserContext);
  const { wallet } = useContext(WalletContext);
  const { afterTxFailed, afterTxHashCreated, afterTxCreated } = useTxHandler();
  const [value, setValue] = useState(0);
  const { t } = useTranslation();
  const [estimagedGasPrice, setEstimatedGasPrice] = useState('');
  const navigation = useNavigation();
  const { getBalance } = useContext(AssetContext);
  const { stakingAddress, signer } = {
    stakingAddress:
      rewardCryptoType === CryptoType.EL
        ? EL_STAKING_POOL_ADDRESS
        : ELFI_STAKING_POOL_ADDRESS,
    signer: wallet?.getFirstSigner() || provider,
  };
  const stakingPoolContract = getStakingPoolContract(stakingAddress, signer);
  const address = isWalletUser
    ? wallet?.getFirstAddress()
    : user.ethAddresses[0];

  const estimateGas = async () => {
    let estimateGas: BigNumber | undefined;

    try {
      estimateGas = await stakingPoolContract?.estimateGas.claim(
        selectedRound,
        {
          from: address,
        },
      );

      if (estimateGas) {
        setEstimatedGasPrice(utils.formatEther(estimateGas.mul(gasPrice)));
      }
    } catch (e) {
      setEstimatedGasPrice('');
    }
  };

  const claim = async () => {
    try {
      return await stakingPoolContract.claim('1');
    } catch (error) {
      console.log(error);
    }
  };

  const onPressClaim = async () => {
    try {
      const resTx = await claim();
      afterTxHashCreated(
        address || '',
        EL_ADDRESS,
        resTx?.hash || '',
        NetworkType.ETH,
      );
      navigation.goBack();
      const successTx = await resTx?.wait();
      afterTxCreated(successTx?.transactionHash || '');
    } catch (error) {
      afterTxFailed('Transaction failed');
      console.log(error);
    }
  };

  useEffect(() => {
    stakingPoolContract
      ?.getUserData(selectedRound, address || '')
      .then((res: any) => {
        setValue(res[1]); // userReward
      });
    if (address) {
      estimateGas();
    }
  }, []);

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
          value={commaFormatter(decimalFormatter(value, 5))}
          subValue={`$ ${commaFormatter(
            decimalFormatter(value * getCryptoPrice(rewardCryptoType), 5),
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
          />
        </View>
      </View>
    </View>
  );
};

export default Reward;
