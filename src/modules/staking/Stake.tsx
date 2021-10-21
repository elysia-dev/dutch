import { View, Text, Platform } from 'react-native';
import React, { useState, useContext, useEffect } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BigNumber } from '@ethersproject/bignumber';
import { constants, utils } from 'ethers';
import { useTranslation } from 'react-i18next';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import {
  EL_STAKING_POOL_ADDRESS,
  ELFI_STAKING_POOL_ADDRESS,
  ELFI_STAKING_POOL_V2_ADDRESS,
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
import useStakeEstimatedGas from '../../hooks/useStakeEstimatedGas';
import StakingType from '../../enums/StakingType';
import StakingConfrimModal from '../../shared/components/StakingConfirmModal';
import useStakingByType from '../../hooks/useStakingByType';
import useErcContract from '../../hooks/useErcContract';
import useStakingPool from '../../hooks/useStakingPool';
import CryptoType from '../../enums/CryptoType';
import useCountingEstimatedGas from '../../hooks/useCountingEstimatedGas';
import getCurrentStakingRound, {
  isElfiV2,
} from '../../utiles/getCurrentStakingRound';
import ToastStatus from '../../enums/ToastStatus';
import TransferType from '../../enums/TransferType';
import TransactionContext from '../../contexts/TransactionContext';
import useUserAddress from '../../hooks/useUserAddress';

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
  const [isMax, setIsMax] = useState(false); // 보여주는건반올림이더라도 최대인지아닌지표시
  const { isWalletUser, user } = useContext(UserContext);
  const { gasPrice } = useContext(PriceContext);
  const { addPendingTx, setToastList } = useContext(TransactionContext);
  const [modalVisible, setModalVisible] = useState(false);
  const insets = useSafeAreaInsets();
  const { getCryptoPrice } = useContext(PriceContext);
  const { getBalance } = useContext(AssetContext);
  const navigation = useNavigation();
  const crytoBalance = getBalance(cryptoType);
  const [selectionVisible, setSelectionVisible] = useState(false);
  const { wallet } = useContext(WalletContext);
  const isElfiV2Con = isElfiV2(cryptoType, selectedRound);
  const { estimagedGasPrice, setEstimatedGas, gasLimit } = useStakeEstimatedGas(
    cryptoType,
    StakingType.Stake,
    isElfiV2Con,
  );
  const { t } = useTranslation();
  const [allowanceInfo, setAllowanceInfo] = useState<{ value: string }>({
    value: '0',
  });
  const [approvalGasPrice, setApprovalGasPrice] = useState('');
  const { elContract, elfiContract } = useErcContract();
  const stakingPoolContract = useStakingPool(cryptoType, isElfiV2Con);
  const [totalPrincipal, setTotalPrincipal] = useState<BigNumber>(
    constants.Zero,
  );
  const { addCount, isApproved, setIsApproved, isLoading, setIsLoading } =
    useCountingEstimatedGas(setEstimatedGas, StakingType.Stake);
  const currentStakingRound = getCurrentStakingRound();
  const { stakeByType } = useStakingByType(
    cryptoType,
    setIsLoading,
    isElfiV2Con,
    StakingType.Stake,
  );
  const address = useUserAddress();
  const stakingPoolAddress =
    cryptoType === CryptoType.EL
      ? EL_STAKING_POOL_ADDRESS
      : currentStakingRound > 2
      ? ELFI_STAKING_POOL_V2_ADDRESS
      : ELFI_STAKING_POOL_ADDRESS;

  const getPoolData = async () => {
    const poolData = await stakingPoolContract.getPoolData(
      cryptoType === CryptoType.EL
        ? selectedRound
        : currentStakingRound > 2
        ? currentStakingRound - 2
        : selectedRound,
    );
    setTotalPrincipal(poolData[4]);
  };

  const getApproveGasPrice = async () => {
    try {
      if (!isAllowanceForApprove()) {
        const approveEstimateGas =
          cryptoType === CryptoType.EL
            ? await elContract.estimateGas.approve(
                stakingPoolAddress,
                constants.MaxUint256,
              )
            : await elfiContract.estimateGas.approve(
                stakingPoolAddress,
                constants.MaxUint256,
              );
        setApprovalGasPrice(
          utils.formatEther(approveEstimateGas.mul(gasPrice)),
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  const setAllowance = async () => {
    try {
      const allowance: BigNumber =
        cryptoType === CryptoType.EL
          ? await elContract.allowance(
              wallet?.getFirstNode()?.address || '',
              EL_STAKING_POOL_ADDRESS,
            )
          : await elfiContract.allowance(
              wallet?.getFirstNode()?.address || '',
              currentStakingRound > 2
                ? ELFI_STAKING_POOL_V2_ADDRESS
                : ELFI_STAKING_POOL_ADDRESS,
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
    return cryptoType === CryptoType.EL
      ? Number(allowanceInfo.value) > crytoBalance
      : Number(allowanceInfo.value) > getBalance(CryptoType.ELFI);
  };

  const setApprove = async () => {
    try {
      await approve();
      await setEstimatedGas(StakingType.Stake);
    } catch (error) {
      addCount();
      console.log(error);
    }
  };

  const approve = async () => {
    try {
      cryptoType === CryptoType.EL
        ? await elContract.approve(
            EL_STAKING_POOL_ADDRESS,
            constants.MaxUint256,
          )
        : await elfiContract.approve(
            currentStakingRound > 2
              ? ELFI_STAKING_POOL_V2_ADDRESS
              : ELFI_STAKING_POOL_ADDRESS,
            constants.MaxUint256,
          );
      setAllowanceInfo({ value: utils.formatEther(constants.MaxUint256) });
    } catch (error) {
      console.log(error);
    }
  };

  const onPressStaking = async () => {
    if (!isApproved) {
      setIsLoading(true);
      setApprove();
      return;
    }
    stakeByType(
      // isMax ? String(crytoBalance) : value,
      value,
      selectedRound,
      gasLimit,
      StakingType.Stake,
    )
      .then((res) => {
        addPendingTx(TransferType.Staking, value, res, cryptoType);
      })
      .catch((error) => {
        console.error(error);
        setToastList(TransferType.Staking, ToastStatus.Fail);
      })
      .finally(() => {
        navigation.goBack();
      });
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
                ? `${t('staking.estimated_gas')}: ${commaFormatter(
                    decimalFormatter(parseFloat(estimagedGasPrice), 6),
                  )} ETH`
                : t('staking.cannot_estimate_gas'),
            ]}
            isInvalid={!isMax && parseFloat(value) > getBalance(cryptoType)}
            invalidText={t('staking.insufficient_crypto', {
              stakingCrypto: cryptoType,
            })}
          />
          <NumberPadShortcut
            values={[0.01, 1, 10, 100]}
            inputValue={value}
            setValue={setValue}
            maxValue={crytoBalance}
            setIsMax={setIsMax}
          />
          <NumberPad
            addValue={(text) => {
              if (!isNumericStringAppendable(value, text, 12, 6)) return;

              const next = newInputValueFormatter(value, text);
              setValue(next);
              setIsMax(false);
            }}
            removeValue={() => {
              setValue(value.slice(0, -1));
              setIsMax(false);
            }}
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
            disabled={
              !value || (!isMax && parseFloat(value) > getBalance(cryptoType))
            }
            handler={() => {
              if (isWalletUser) {
                getApproveGasPrice();
                setIsApproved(isAllowanceForApprove());
                setModalVisible(true);
                setEstimatedGas(StakingType.Stake, selectedRound, value);
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
              value: `${commaFormatter(
                decimalFormatter(parseFloat(value), 6),
              )} ${cryptoType}`,
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
                ? `${commaFormatter(
                    decimalFormatter(parseFloat(estimagedGasPrice), 6),
                  )} ETH`
                : t('staking.cannot_estimate_gas'),
            },
          ]}
          isApproved={isApproved}
          submitButtonText={t('staking.nth_staking', { round: selectedRound })}
          handler={() => onPressStaking()}
          isLoading={isLoading}
          stakingType={StakingType.Stake}
          approvalGasPrice={approvalGasPrice}
        />
      </View>
    );
  }

  return (
    <PaymentSelection
      // value={isMax ? crytoBalance.toFixed(18) : value}
      value={value}
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
