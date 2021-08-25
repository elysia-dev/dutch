import { View, Text, Platform } from 'react-native';
import React, { useState, useContext, useEffect } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BigNumber } from '@ethersproject/bignumber';
import { constants, utils } from 'ethers';
import { useTranslation } from 'react-i18next';
import { useRoute, RouteProp } from '@react-navigation/native';
import {
  EL_STAKING_POOL_ADDRESS,
  ELFI_STAKING_POOL_ADDRESS,
} from 'react-native-dotenv';
import AppColors from '../../enums/AppColors';
import SheetHeader from '../../shared/components/SheetHeader';
import LargeTextInput from './components/LargeTextInput';
import NumberPadShortcut from './components/NumberPadShortcut';
import NumberPad from '../../shared/components/NumberPad';
import NextButton from '../../shared/components/NextButton';
import UserContext from '../../contexts/UserContext';
import AppFonts from '../../enums/AppFonts';
import InputInfoBox from './components/InputInfoBox';
import PriceContext from '../../contexts/PriceContext';
import AssetContext from '../../contexts/AssetContext';
import decimalFormatter from '../../utiles/decimalFormatter';
import PaymentSelection from '../../shared/components/PaymentSelection';
import calculateAPR, { aprFormatter } from '../../utiles/calculateAPR';
import isNumericStringAppendable from '../../utiles/isNumericStringAppendable';
import newInputValueFormatter from '../../utiles/newInputValueFormatter';
import commaFormatter from '../../utiles/commaFormatter';
import WalletContext from '../../contexts/WalletContext';
import useTxHandler from '../../hooks/useTxHandler';
import useEstimateGas from '../../hooks/useEstimateGas';
import StakingType from '../../enums/StakingType';
import StakingConfrimModal from '../../shared/components/StakingConfirmModal';
import useStakingByType from '../../hooks/useStakingByType';
import useErcContract from '../../hooks/useErcContract';
import useStakingPool from '../../hooks/useStakingPool';
import CryptoType from '../../enums/CryptoType';

type ParamList = {
  Stake: {
    cryptoType: CryptoType;
    selectedRound: number;
  };
};

const Stake: React.FC = () => {
  const route = useRoute<RouteProp<ParamList, 'Stake'>>();
  const { cryptoType, selectedRound } = route.params;
  const [value, setValue] = useState('');
  const { isWalletUser, user } = useContext(UserContext);
  const [modalVisible, setModalVisible] = useState(false);
  const insets = useSafeAreaInsets();
  const { getCryptoPrice } = useContext(PriceContext);
  const { getBalance } = useContext(AssetContext);
  const { afterTxFailed } = useTxHandler();
  const crytoBalance = getBalance(cryptoType);
  const [selectionVisible, setSelectionVisible] = useState(false);
  const { wallet } = useContext(WalletContext);
  const { estimagedGasPrice } = useEstimateGas(cryptoType, StakingType.Stake);
  const { t } = useTranslation();
  const [allowanceInfo, setAllowanceInfo] = useState<{ value: string }>({
    value: '0',
  });
  const [isApprove, setIsApprove] = useState(true);
  const { elContract } = useErcContract();
  const { isLoading, stakeByType, setIsLoading } = useStakingByType(cryptoType);
  const stakingPoolContract = useStakingPool(cryptoType);
  const [totalPrincipal, setTotalPrincipal] = useState<BigNumber>(
    constants.Zero,
  );
  const address = isWalletUser
    ? wallet?.getFirstAddress()
    : user.ethAddresses[0];
  const stakingPoolAddress =
    cryptoType === CryptoType.EL
      ? EL_STAKING_POOL_ADDRESS
      : ELFI_STAKING_POOL_ADDRESS;

  const getPoolData = async () => {
    const poolData = await stakingPoolContract.getPoolData(selectedRound);
    setTotalPrincipal(poolData[4]);
  };

  const setAllowance = async () => {
    try {
      const allowance: BigNumber = await elContract.allowance(
        wallet?.getFirstNode()?.address || '',
        EL_STAKING_POOL_ADDRESS,
      );
      setAllowanceInfo({
        ...allowanceInfo,
        value: utils.formatEther(allowance),
      });
    } catch (error) {
      console.log(error);
    }
  };

  const isAllowanceForApprove = (): boolean => {
    return Number(allowanceInfo.value) > crytoBalance;
  };

  const setApporve = async () => {
    try {
      await approve();
      setIsApprove(true);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const approve = async () => {
    try {
      await elContract.approve(EL_STAKING_POOL_ADDRESS, '1' + '0'.repeat(30));
      setAllowanceInfo({ value: utils.formatEther('1' + '0'.repeat(30)) });
    } catch (error) {
      console.log(error);
    }
  };
  const onPressStaking = async () => {
    try {
      if (!isApprove) {
        setIsLoading(true);
        setApporve();
        return;
      }
      stakeByType(value, selectedRound, StakingType.Stake);
    } catch (error) {
      afterTxFailed('Transaction failed');
      console.log(error);
    }
  };

  useEffect(() => {
    if (address) {
      setAllowance();
      getPoolData();
    }
  }, []);

  if (!selectionVisible) {
    return (
      <View style={{ backgroundColor: AppColors.WHITE, height: '100%' }}>
        <SheetHeader
          title={t('staking.staking_with_type', { stakingCrypto: cryptoType })}
        />
        <View
          style={{
            alignSelf: 'center',
            borderColor: AppColors.SUB_GREY,
            borderRadius: 5,
            borderWidth: 1,
            width: '90%',
            height: 45,
            padding: 12,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <Text
            style={{
              color: AppColors.BLACK,
              fontFamily: AppFonts.Bold,
              fontSize: 14,
            }}>
            {t('staking.nth_apr', { round: selectedRound })}
          </Text>
          <Text
            style={{
              color: AppColors.BLACK,
              fontFamily: AppFonts.Bold,
              fontSize: 14,
            }}>
            {`${aprFormatter(calculateAPR(cryptoType, totalPrincipal))} %`}
          </Text>
        </View>
        <View
          style={{
            marginTop: Platform.OS === 'android' ? 20 : 10,
            paddingHorizontal: 20,
            flex: 1,
          }}>
          <LargeTextInput
            placeholder={t('staking.staking_placeholder')}
            value={value}
            unit={cryptoType}
          />
          <InputInfoBox
            list={[
              `${t('staking.staking_in_dollars')}: $ ${commaFormatter(
                decimalFormatter(
                  parseFloat(value || '0') * getCryptoPrice(cryptoType),
                  6,
                ),
              )}`,
              `${t('staking.staking_supply_available')}: ${commaFormatter(
                decimalFormatter(getBalance(cryptoType), 6),
              )} ${cryptoType}`,
              estimagedGasPrice
                ? `${t('staking.estimated_gas')}: ${estimagedGasPrice} ETH`
                : t('staking.cannot_estimate_gas'),
            ]}
            isInvalid={parseFloat(value) > getBalance(cryptoType)}
            invalidText={t('staking.insufficient_crypto', {
              stakingCrypto: cryptoType,
            })}
          />
          <NumberPadShortcut
            values={[0.01, 1, 10, 100, 1000]}
            inputValue={value}
            setValue={setValue}
          />
          <NumberPad
            addValue={(text) => {
              if (!isNumericStringAppendable(value, text, 12, 6)) return;

              const next = newInputValueFormatter(value, text);
              setValue(next);
            }}
            removeValue={() => setValue(value.slice(0, -1))}
          />
        </View>
        <View
          style={{
            marginBottom: insets.bottom || 10,
            paddingLeft: '5%',
            paddingRight: '5%',
          }}>
          <NextButton
            title={t('staking.done')}
            disabled={!value || parseFloat(value) > getBalance(cryptoType)}
            handler={() => {
              if (isWalletUser) {
                setIsApprove(isAllowanceForApprove);
                setModalVisible(true);
              } else {
                setSelectionVisible(true);
              }
            }}
          />
        </View>
        <StakingConfrimModal
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          title={t('staking.staking_with_type', { stakingCrypto: cryptoType })}
          subtitle={t('staking.confirmation_title')}
          list={[
            {
              label: t('staking.staking_round'),
              value: t('staking.nth_staking', { round: selectedRound }),
            },
            {
              label: t('staking.staking_supply'),
              value: `${value} ${cryptoType}`,
              subvalue: `$ ${commaFormatter(
                decimalFormatter(
                  parseFloat(value || '0') * getCryptoPrice(cryptoType),
                  6,
                ),
              )}`,
            },
            {
              label: t('staking.gas_price'),
              value: estimagedGasPrice
                ? `${estimagedGasPrice} ETH`
                : t('staking.cannot_estimate_gas'),
            },
          ]}
          isApproved={isApprove}
          submitButtonText={t('staking.nth_staking', { round: selectedRound })}
          handler={() => onPressStaking()}
          isLoading={isLoading}
        />
        {/* <OverlayLoading
        visible={[
          TxStep.Approving,
          Platform.OS === 'android' && TxStep.CheckAllowance,
          TxStep.Creating,
        ].includes(step)}
      /> */}
      </View>
    );
  }

  return (
    <PaymentSelection
      value={parseFloat(value)}
      page="staking"
      stakingTxData={{
        type: 'stake',
        unit: cryptoType,
        round: selectedRound,
      }}
      contractAddress={stakingPoolAddress}
    />
  );
};

export default Stake;
