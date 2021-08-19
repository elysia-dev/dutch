import React, { useContext, useState, useEffect } from 'react';
import { View, Text } from 'react-native';
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
import {
  getElStakingPoolContract,
  getElfiStakingPoolContract,
} from '../../utiles/getContract';
import CryptoType from '../../enums/CryptoType';
import decimalFormatter from '../../utiles/decimalFormatter';
import commaFormatter from '../../utiles/commaFormatter';
import UserContext from '../../contexts/UserContext';
import WalletContext from '../../contexts/WalletContext';
import PaymentSelection from '../../shared/components/PaymentSelection';
import AssetContext from '../../contexts/AssetContext';

type ParamList = {
  Reward: {
    rewardCryptoType: CryptoType;
    selectedRound: number;
  };
};

const Reward: React.FC = () => {
  const route = useRoute<RouteProp<ParamList, 'Reward'>>();
  const { rewardCryptoType, selectedRound } = route.params;
  const insets = useSafeAreaInsets();
  const { getCryptoPrice, gasPrice } = useContext(PriceContext);
  const { isWalletUser, user } = useContext(UserContext);
  const { wallet } = useContext(WalletContext);
  const [value, setValue] = useState(0);
  const contract =
    rewardCryptoType === CryptoType.ELFI
      ? getElStakingPoolContract()
      : getElfiStakingPoolContract();
  const { t } = useTranslation();
  const [selectionVisible, setSelectionVisible] = useState(false);
  const [estimagedGasPrice, setEstimatedGasPrice] = useState('');
  const { getBalance } = useContext(AssetContext);

  const estimateGas = async (address: string) => {
    let estimateGas: BigNumber | undefined;

    try {
      estimateGas = await contract?.estimateGas.claim({ from: address });

      if (estimateGas) {
        setEstimatedGasPrice(utils.formatEther(estimateGas.mul(gasPrice)));
      }
    } catch (e) {
      setEstimatedGasPrice('');
    }
  };

  useEffect(() => {
    contract
      ?.getUserData(
        selectedRound,
        isWalletUser ? wallet?.getFirstAddress() : user.ethAddresses[0],
      )
      .then((res: any) => {
        setValue(res[1]); // userReward
      });

    // const address = isWalletUser
    //   ? wallet?.getFirstAddress()
    //   : user.ethAddresses[0];

    // if (address) {
    //   estimateGas(address);
    // }
  }, []);

  useEffect(() => {
    const address = isWalletUser
      ? wallet?.getFirstAddress()
      : user.ethAddresses[0];

    if (address) {
      estimateGas(address);
    }
  }, []);

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
                  console.log('보상 수령 해야 함 (내부 지갑 유저)');
                } else {
                  setSelectionVisible(true);
                }
              }}
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
