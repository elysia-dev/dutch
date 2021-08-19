import React, { useState, useContext, useEffect } from 'react';
import { View, Text, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BigNumber } from '@ethersproject/bignumber';
import { ethers, utils, constants } from 'ethers';
import { useTranslation } from 'react-i18next';
import AppColors from '../../enums/AppColors';
import SheetHeader from '../../shared/components/SheetHeader';
import LargeTextInput from './components/LargeTextInput';
import NumberPadShortcut from './components/NumberPadShortcut';
import NumberPad from '../../shared/components/NumberPad';
import NextButton from '../../shared/components/NextButton';
import UserContext from '../../contexts/UserContext';
import ConfirmationModal from '../../shared/components/ConfirmationModal';
import InputInfoBox from './components/InputInfoBox';
import PriceContext from '../../contexts/PriceContext';
import decimalFormatter from '../../utiles/decimalFormatter';
import { provider, getStakingPoolContract } from '../../utiles/getContract';
import WalletContext from '../../contexts/WalletContext';
import CryptoType from '../../enums/CryptoType';
import AppFonts from '../../enums/AppFonts';
import isNumericStringAppendable from '../../utiles/isNumericStringAppendable';
import newInputValueFormatter from '../../utiles/newInputValueFormatter';
import commaFormatter from '../../utiles/commaFormatter';
import {
  ELFI_STAKING_POOL_ADDRESS,
  EL_ADDRESS,
  EL_STAKING_POOL_ADDRESS,
} from 'react-native-dotenv';
import useTxHandler from '../../hooks/useTxHandler';
import { useNavigation } from '@react-navigation/native';
import NetworkType from '../../enums/NetworkType';
import moment from 'moment';
import { STAKING_POOL_ROUNDS_MOMENT } from '../../constants/staking';
import FinishedRoundModal from './components/FinishedRoundModal';
import useStakingInfo from '../../hooks/useStakingInfo';

const UnstakeAndMigrate: React.FC<{ route: any }> = ({ route }) => {
  const { cryptoType, selectedRound, currentRound, earnReward } = route.params;
  const [value, setValue] = useState('');
  const { isWalletUser, user } = useContext(UserContext);
  const { gasPrice } = useContext(PriceContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [isfinishRound, setIsFinishRound] = useState(false);
  const insets = useSafeAreaInsets();
  const { getCryptoPrice } = useContext(PriceContext);
  const { wallet } = useContext(WalletContext);
  const { afterTxFailed, afterTxHashCreated, afterTxCreated } = useTxHandler();
  const navigation = useNavigation();
  const rewardCryptoType =
    cryptoType === CryptoType.EL ? CryptoType.ELFI : CryptoType.DAI;
  const [estimagedGasPrice, setEstimatedGasPrice] = useState('');
  const { t } = useTranslation();
  const { stakingAddress, signer } = {
    stakingAddress:
      cryptoType === CryptoType.EL
        ? EL_STAKING_POOL_ADDRESS
        : ELFI_STAKING_POOL_ADDRESS,
    signer: wallet?.getFirstSigner() || provider,
  };
  const stakingPoolContract = getStakingPoolContract(stakingAddress, signer);
  const address = isWalletUser
    ? wallet?.getFirstAddress()
    : user.ethAddresses[0];

  const [stakingType, setStakingType] = useState('migrate');
  const { principal, reward } = useStakingInfo(
    stakingPoolContract,
    selectedRound,
    address || '',
  );
  const [confirmationList, setConfirmationList] = useState<
    {
      label: string;
      value: string;
      subvalue?: string;
    }[]
  >([
    {
      label: '',
      value: '',
    },
  ]);

  const setConfirmations = (gasFee?: string) => {
    if (earnReward) {
      setConfirmationList([
        {
          label: t('staking.unstaking_round'),
          value: t('staking.nth_unstaking', { round: selectedRound }),
        },
        {
          label: t('staking.unstaking_supply'),
          value: `${value} ${cryptoType}`,
          subvalue: `$ ${commaFormatter(
            decimalFormatter(
              parseFloat(value || '0') * getCryptoPrice(cryptoType),
              6,
            ),
          )}`,
        },
        {
          label: t('staking.migration_supply'),
          value: `${principal - parseFloat(value)} ${cryptoType}`,
          subvalue: `$ ${commaFormatter(
            decimalFormatter(
              (principal - parseFloat(value)) * getCryptoPrice(cryptoType),
              6,
            ),
          )}`,
        },
        {
          label: t('staking.migration_destination'),
          value: `${t('staking.round_with_affix', {
            round: selectedRound,
          })} → ${t('staking.round_with_affix', { round: currentRound })}`,
        },
        {
          label: t('staking.reward_supply'),
          value: `${reward} ${rewardCryptoType}`,
        },
        {
          label: t('staking.gas_price'),
          value: estimagedGasPrice || gasFee || '',
        },
      ]);
    } else {
      setConfirmationList([
        {
          label: t('staking.unstaking_round'),
          value: t('staking.nth_unstaking', { round: selectedRound }),
        },
        {
          label: t('staking.unstaking_supply'),
          value: `${value} ${cryptoType}`,
          subvalue: `$ ${commaFormatter(
            decimalFormatter(
              parseFloat(value || '0') * getCryptoPrice(cryptoType),
              6,
            ),
          )}`,
        },
        {
          label: t('staking.migration_supply'),
          value: `${principal - parseFloat(value)} ${cryptoType}`,
          subvalue: `$ ${commaFormatter(
            decimalFormatter(
              (principal - parseFloat(value)) * getCryptoPrice(cryptoType),
              6,
            ),
          )}`,
        },
        {
          label: t('staking.migration_destination'),
          value: `${t('staking.round_with_affix', {
            round: selectedRound,
          })} → ${t('staking.round_with_affix', { round: currentRound })}`,
        },
        {
          label: t('staking.gas_price'),
          value: estimagedGasPrice || gasFee || '',
        },
      ]);
    }
  };

  const estimateGas = async () => {
    let estimateGas: BigNumber | undefined;

    try {
      estimateGas = await stakingPoolContract.estimateGas.migrate(
        utils.parseEther('1'),
        utils.parseEther(selectedRound),
        { from: address },
      );
      if (estimateGas) {
        setEstimatedGasPrice(utils.formatEther(estimateGas.mul(gasPrice)));
      }
    } catch (e) {
      setEstimatedGasPrice('');
    }
  };

  const isProgressRound = () => {
    return moment().isBetween(
      STAKING_POOL_ROUNDS_MOMENT[currentRound - 1].endedAt,
      STAKING_POOL_ROUNDS_MOMENT[currentRound].startedAt,
    );
  };

  const migrate = async () => {
    try {
      return await stakingPoolContract.migrate(
        utils.parseUnits(String(principal - parseFloat(value))),
        selectedRound,
      );
    } catch (error) {
      console.log(error);
    }
  };

  const confirmExcludeMigrate = async () => {
    setConfirmationList([
      ...confirmationList.filter((text) => {
        return !(
          text.label === t('staking.migration_supply') ||
          text.label === t('staking.migration_destination')
        );
      }),
    ]);
    setModalVisible(true);
    setStakingType('unstake');
  };

  const unStake = async () => {
    try {
      return await stakingPoolContract.withdraw(
        utils.parseUnits(value),
        selectedRound,
      );
    } catch (error) {
      console.error(error);
    }
  };

  const onPressUnstaking = async () => {
    try {
      setModalVisible(false);
      const resTx = await unStake();
      navigation.goBack();
      afterTxHashCreated(
        address || '',
        EL_ADDRESS,
        resTx?.hash || '',
        NetworkType.ETH,
      );
      const successTx = await resTx?.wait();
      afterTxCreated(successTx?.transactionHash || '');
    } catch (error) {
      afterTxFailed('Transaction failed');
      console.log(error);
    }
  };

  const onPressMigrate = async () => {
    try {
      if (!isProgressRound()) {
        let estimateGas: BigNumber | undefined;
        estimateGas = await stakingPoolContract.estimateGas.withdraw(
          utils.parseEther('1'),
          selectedRound,
          { from: address },
        );
        console.log(estimateGas);
        if (estimateGas) {
          setConfirmations(utils.formatEther(estimateGas.mul(gasPrice)));
        }
        setModalVisible(false);
        setIsFinishRound(true);
        return;
      }
      setModalVisible(false);
      const resTx = await migrate();
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
    if (address) {
      estimateGas();
    }
  }, []);

  useEffect(() => {
    if (!modalVisible) {
      setStakingType('migrate');
    }
  }, [modalVisible]);

  return (
    <View style={{ backgroundColor: AppColors.WHITE, height: '100%' }}>
      <SheetHeader
        title={t('stking.nth_unstaking', { round: selectedRound })}
      />
      <View
        style={{
          // marginTop: Platform.OS === 'android' ? 20 : 10,
          paddingHorizontal: 20,
          flex: 1,
        }}>
        <LargeTextInput
          placeholder={t('staking.unstaking_placeholder')}
          value={value}
          unit={cryptoType}
          style={{ marginTop: 0 }}
        />
        <Text
          style={{
            fontFamily: AppFonts.Bold,
            fontSize: 30,
            color: '#646464',
            textAlign: 'center',
            marginVertical: 10,
          }}>
          ↕
        </Text>
        <LargeTextInput
          placeholder={t('staking.migration_placeholder')}
          value={value ? String(principal - parseFloat(value)) : ''}
          unit={cryptoType}
          style={{ marginTop: 0 }}
        />
        <InputInfoBox
          list={[
            `입력 가능 수량: ${commaFormatter(
              decimalFormatter(principal, 6),
            )} ${cryptoType}`,
            `${t('staking.migration_destination')}: ${t(
              'staking.round_with_affix',
              {
                round: selectedRound,
              },
            )} → ${t('staking.round_with_affix', { round: currentRound })}`,
            estimagedGasPrice
              ? `${t('staking.estimated_gas')}: ${estimagedGasPrice} ETH`
              : t('staking.cannot_estimate_gas'),
          ]}
          isInvalid={parseFloat(value) > principal}
          invalidText={t('staking.unstaking_value_excess')}
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
          disabled={!value || parseFloat(value) > principal}
          handler={() => {
            if (isWalletUser) {
              setConfirmations();
              setModalVisible(true);
            } else {
              console.log('언스테이킹 해야 함');
            }
          }}
        />
      </View>
      <ConfirmationModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        title={t('staking.unstaking_with_type', { stakingCrypto: cryptoType })}
        subtitle={t('staking.confirmation_title')}
        list={confirmationList}
        isApproved={true}
        submitButtonText={t('staking.nth_unstaking', { round: selectedRound })}
        handler={() =>
          stakingType === 'migrate' ? onPressMigrate() : onPressUnstaking()
        }
      />
      <FinishedRoundModal
        isfinishRound={isfinishRound}
        setIsFinishRound={setIsFinishRound}
        handler={() => confirmExcludeMigrate()}
        currentRound={currentRound}
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
};

export default UnstakeAndMigrate;
