import React, { useState, useContext, useEffect } from 'react';
import { View, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import moment from 'moment';
import {
  EL_STAKING_POOL_ADDRESS,
  ELFI_STAKING_POOL_ADDRESS,
} from 'react-native-dotenv';
import AppColors from '../../enums/AppColors';
import LargeTextInput from './components/LargeTextInput';
import NumberPadShortcut from './components/NumberPadShortcut';
import NumberPad from '../../shared/components/NumberPad';
import NextButton from '../../shared/components/NextButton';
import UserContext from '../../contexts/UserContext';
import InputInfoBox from './components/InputInfoBox';
import PriceContext from '../../contexts/PriceContext';
import decimalFormatter from '../../utiles/decimalFormatter';
import WalletContext from '../../contexts/WalletContext';
import CryptoType from '../../enums/CryptoType';
import AppFonts from '../../enums/AppFonts';
import PaymentSelection from '../../shared/components/PaymentSelection';
import isNumericStringAppendable from '../../utiles/isNumericStringAppendable';
import newInputValueFormatter from '../../utiles/newInputValueFormatter';
import commaFormatter from '../../utiles/commaFormatter';
import { STAKING_POOL_ROUNDS } from '../../constants/staking';
import FinishedRoundModal from './components/FinishedRoundModal';
import useStakingInfo from '../../hooks/useStakingInfo';
import useStakeEstimatedGas from '../../hooks/useStakeEstimatedGas';
import StakingType from '../../enums/StakingType';
import StakingConfirmModal from '../../shared/components/StakingConfirmModal';
import UnstakingGuideModal from '../../shared/components/UnstakingGuideModal';
import HelpQuestionHeader from '../../shared/components/HelpQuestionHeader';
import { isElfiV2 } from '../../utiles/getCurrentStakingRound';
import TransferType from '../../enums/TransferType';
import ToastStatus from '../../enums/ToastStatus';
import TransactionContext from '../../contexts/TransactionContext';
import addMigrationInternalInfo from '../../utiles/addMigrationInternalInfo';
import useUserAddress from '../../hooks/useUserAddress';
import useStakingByType from '../../hooks/useStakingByType';

type ParamList = {
  UnstakeAndMigrate: {
    cryptoType: CryptoType;
    selectedRound: number;
    currentRound: number;
    earnReward: boolean;
  };
};

const UnstakeAndMigrate: React.FC = () => {
  const route = useRoute<RouteProp<ParamList, 'UnstakeAndMigrate'>>();
  const { cryptoType, selectedRound, currentRound, earnReward } = route.params;
  const [value, setValue] = useState('');
  const { isWalletUser, user } = useContext(UserContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [isFinishRound, setIsFinishRound] = useState(false);
  const [selectionVisible, setSelectionVisible] = useState(false);
  const insets = useSafeAreaInsets();
  const { getCryptoPrice } = useContext(PriceContext);
  const { addPendingTx, setToastList } = useContext(TransactionContext);
  const { wallet } = useContext(WalletContext);
  const navigation = useNavigation();
  const rewardCryptoType =
    cryptoType === CryptoType.EL ? CryptoType.ELFI : CryptoType.DAI;
  const { t } = useTranslation();
  const isElfiV2Con = isElfiV2(cryptoType, selectedRound);
  const { principal, reward } = useStakingInfo(
    cryptoType,
    selectedRound,
    isElfiV2Con,
  );
  const [isLoading, setIsLoading] = useState(false);
  const { stakeByType } = useStakingByType(
    cryptoType,
    setIsLoading,
    isElfiV2Con,
    StakingType.Migrate,
  );
  const address = useUserAddress();
  const round = // 변경된 컨트랙트 현재라운드에서 2를 빼줘야함 (변수이름 변경해주고 리팩토링)
    cryptoType === CryptoType.EL || selectedRound <= 2
      ? selectedRound
      : selectedRound - 2;
  const [stakingType, setStakingType] = useState(StakingType.Migrate);
  const [isGuideModal, setIsGuideModal] = useState(false);
  const { estimagedGasPrice, setEstimatedGas, gasLimit } = useStakeEstimatedGas(
    cryptoType,
    StakingType.Migrate,
    isElfiV2Con,
    round,
  );
  const [userPrincipal, setUserPrincipal] = useState(principal);
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
  const stakingPoolAddress =
    cryptoType === CryptoType.EL
      ? EL_STAKING_POOL_ADDRESS
      : ELFI_STAKING_POOL_ADDRESS;

  const setConfirmations = (gasFee?: string) => {
    setConfirmationList([
      {
        label: t('staking.unstaking_round'),
        value: t('staking.nth_unstaking', { round: selectedRound }),
      },
      {
        label: t('staking.unstaking_supply'),
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
        label: t('staking.migration_supply'),
        value: `${commaFormatter(
          decimalFormatter(userPrincipal - parseFloat(value), 6),
        )} ${cryptoType}`,
        subvalue: `$ ${commaFormatter(
          decimalFormatter(
            (userPrincipal - parseFloat(value)) * getCryptoPrice(cryptoType),
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
        value: `${commaFormatter(reward)} ${rewardCryptoType}`,
      },
      {
        label: t('staking.gas_price'),
        value: estimagedGasPrice
          ? `${commaFormatter(
              decimalFormatter(parseFloat(estimagedGasPrice), 6),
            )} ETH`
          : t('staking.cannot_estimate_gas'),
      },
    ]);
  };

  const isProgressRound = () => {
    if (currentRound !== 4) {
      return moment().isBetween(
        STAKING_POOL_ROUNDS[currentRound - 1].endedAt,
        STAKING_POOL_ROUNDS[currentRound].startedAt,
      );
    } else {
      return moment().isAfter(STAKING_POOL_ROUNDS[currentRound - 1].endedAt);
    }
  };

  const confirmExcludeMigrate = async () => {
    setConfirmationList([
      ...confirmationList.filter((text) => {
        return !(
          text.label === t('staking.migration_supply') ||
          text.label === t('staking.migration_destination') ||
          text.label === t('staking.reward_supply')
        );
      }),
    ]);
    setModalVisible(true);
  };

  const onPressUnstaking = async () => {
    stakeByType(value, round, gasLimit, StakingType.Unstake)
      .then((res) => {
        addPendingTx(TransferType.Unstaking, value, res, cryptoType);
      })
      .catch((error) => {
        setToastList(TransferType.Unstaking, ToastStatus.Fail);
      })
      .finally(() => {
        navigation.goBack();
      });
  };

  const onPressMigrate = async () => {
    if (isProgressRound()) {
      setEstimatedGas(StakingType.Unstake, selectedRound, value);
      setStakingType(StakingType.Unstake);
      setModalVisible(false);
      setIsFinishRound(true);
      return;
    }
    const migrateAmount = String(userPrincipal - parseFloat(value));
    const internalInfo = addMigrationInternalInfo(
      value,
      reward.toString(),
      cryptoType,
      rewardCryptoType,
    );
    stakeByType(migrateAmount, round, gasLimit)
      .then((res) => {
        addPendingTx(
          TransferType.Migration,
          migrateAmount,
          res,
          cryptoType,
          '',
          internalInfo,
        );
      })
      .catch((error) => {
        setToastList(TransferType.Migration, ToastStatus.Fail);
      })
      .finally(() => {
        navigation.goBack();
      });
  };

  useEffect(() => {
    if (address) {
      if (stakingType === StakingType.Unstake) {
        setConfirmations(estimagedGasPrice);
      }
    }
  }, [stakingType, estimagedGasPrice]);

  useEffect(() => {
    if (!modalVisible && !isFinishRound) {
      setStakingType(StakingType.Migrate);
    }
  }, [modalVisible, isFinishRound]);

  useEffect(() => {
    if (principal === 0) return;
    setUserPrincipal(principal);
  }, [principal]);

  if (!selectionVisible) {
    return (
      <View style={{ backgroundColor: AppColors.WHITE, height: '100%' }}>
        <HelpQuestionHeader
          title={t('staking.unstaking_with_type', {
            stakingCrypto: cryptoType,
          })}
          setIsGuideModal={setIsGuideModal}
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
            value={value ? String(userPrincipal - parseFloat(value)) : ''}
            unit={cryptoType}
            style={{ marginTop: 0 }}
          />
          <InputInfoBox
            list={[
              `${t('staking.max_supply_available')}: ${commaFormatter(
                decimalFormatter(userPrincipal, 6),
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
            isInvalid={parseFloat(value) > userPrincipal}
            invalidText={t('staking.unstaking_value_excess')}
          />
          <NumberPadShortcut
            values={[0.01, 1, 10, 100, 1000]}
            inputValue={value}
            setValue={setValue}
          />
          <NumberPad
            addValue={(text) => {
              if (
                !isNumericStringAppendable(value, text, 12, 6) &&
                value !== ''
              )
                return;

              const next = newInputValueFormatter(
                value === '0' ? '' : value,
                text,
              );
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
            disabled={!value || parseFloat(value) > userPrincipal}
            handler={() => {
              if (isWalletUser) {
                setConfirmations();
                setModalVisible(true);
                setEstimatedGas(StakingType.Migrate, selectedRound, value);
              } else {
                setSelectionVisible(true);
              }
            }}
          />
        </View>
        <StakingConfirmModal
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          title={t('staking.unstaking_with_type', {
            stakingCrypto: cryptoType,
          })}
          subtitle={t('staking.confirmation_title')}
          list={confirmationList}
          isApproved={true}
          isAllowanced={true}
          submitButtonText={t('staking.nth_unstaking', {
            round: selectedRound,
          })}
          handler={() =>
            stakingType === StakingType.Migrate
              ? onPressMigrate()
              : onPressUnstaking()
          }
          isLoading={isLoading}
        />
        <FinishedRoundModal
          isFinishRound={isFinishRound}
          setIsFinishRound={setIsFinishRound}
          handler={() => confirmExcludeMigrate()}
          currentRound={currentRound}
        />
        <UnstakingGuideModal
          isGuideModal={isGuideModal}
          setIsGuideModal={setIsGuideModal}
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
        type: 'unstakeAndMigrate',
        unit: cryptoType,
        round: selectedRound,
        rewardValue: reward,
        migrationValue: userPrincipal - parseFloat(value),
      }}
      contractAddress={stakingPoolAddress}
    />
  );
};

export default UnstakeAndMigrate;
