import React, { useState, useContext } from 'react';
import { View, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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
import InputInfoBox from './components/InputInfoBox';
import PriceContext from '../../contexts/PriceContext';
import decimalFormatter from '../../utiles/decimalFormatter';
import CryptoType from '../../enums/CryptoType';
import PaymentSelection from '../../shared/components/PaymentSelection';
import isNumericStringAppendable from '../../utiles/isNumericStringAppendable';
import newInputValueFormatter from '../../utiles/newInputValueFormatter';
import commaFormatter from '../../utiles/commaFormatter';
import useTxHandler from '../../hooks/useTxHandler';
import useStakingInfo from '../../hooks/useStakingInfo';
import useEstimateGas from '../../hooks/useEstimateGas';
import StakingType from '../../enums/StakingType';
import StakingConfrimModal from '../../shared/components/StakingConfirmModal';
import useStakingByType from '../../hooks/useStakingByType';

type ParamList = {
  Unstake: {
    cryptoType: CryptoType;
    selectedRound: number;
  };
};

const Unstake: React.FC = () => {
  const route = useRoute<RouteProp<ParamList, 'Unstake'>>();
  const { cryptoType, selectedRound } = route.params;
  const [value, setValue] = useState('');
  const { isWalletUser } = useContext(UserContext);
  const [modalVisible, setModalVisible] = useState(false);
  const insets = useSafeAreaInsets();
  const { getCryptoPrice } = useContext(PriceContext);
  const { afterTxFailed } = useTxHandler();
  const [selectionVisible, setSelectionVisible] = useState(false);
  const { estimagedGasPrice } = useEstimateGas(
    cryptoType,
    StakingType.Unstake,
    selectedRound,
  );
  const { t } = useTranslation();
  const { principal } = useStakingInfo(cryptoType, selectedRound);
  const { isLoading, stakeByType } = useStakingByType(cryptoType);
  const stakingPoolAddress =
    cryptoType === CryptoType.EL
      ? EL_STAKING_POOL_ADDRESS
      : ELFI_STAKING_POOL_ADDRESS;

  const confirmationList = [
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
      label: t('staking.gas_price'),
      value: estimagedGasPrice
        ? `${estimagedGasPrice} ETH`
        : t('staking.cannot_estimate_gas'),
    },
  ];

  const onPressUnstaking = async () => {
    try {
      await stakeByType(value, selectedRound, StakingType.Unstake);
    } catch (error) {
      afterTxFailed('Transaction failed');
      console.log(error);
    }
  };

  if (!selectionVisible) {
    return (
      <View style={{ backgroundColor: AppColors.WHITE, height: '100%' }}>
        <SheetHeader
          title={t('staking.nth_unstaking', { round: selectedRound })}
        />
        <View
          style={{
            marginTop: Platform.OS === 'android' ? 20 : 10,
            paddingHorizontal: 20,
            flex: 1,
          }}>
          <LargeTextInput
            placeholder={t('staking.unstaking_placeholder')}
            value={value}
            unit={cryptoType}
          />
          <InputInfoBox
            list={[
              `${t('staking.unstaking_in_dollars')}: $ ${commaFormatter(
                decimalFormatter(
                  parseFloat(value || '0') * getCryptoPrice(cryptoType),
                  6,
                ),
              )}`,
              `${t('staking.unstaking_supply_available')}: ${commaFormatter(
                decimalFormatter(principal, 6),
              )} ${cryptoType}`,
              estimagedGasPrice
                ? `${t('staking.estimated_gas')}: ${estimagedGasPrice} ETH`
                : t('staking.cannot_estimate_gas'),
            ]}
            isInvalid={parseFloat(value) > principal}
            invalidText={t('staking.unstaking_value_excess')}
          />
          <NumberPadShortcut
            values={[0.01, 1, 10, 100, 'max']}
            inputValue={value}
            setValue={setValue}
            maxValue={principal}
          />
          <NumberPad
            addValue={(text) => {
              if (!isNumericStringAppendable(value, text, 12, 6)) return;

              const next = newInputValueFormatter(value, text);
              setValue(next);
            }}
            removeValue={() => setValue(value.slice(0, -1))}
          />
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
            title={t('staking.unstaking_with_type', {
              stakingCrypto: cryptoType,
            })}
            subtitle={t('staking.confirmation_title')}
            list={confirmationList}
            isApproved={true}
            submitButtonText={t('staking.nth_unstaking', {
              round: selectedRound,
            })}
            handler={() => onPressUnstaking()}
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
      </View>
    );
  }

  return (
    <PaymentSelection
      value={parseFloat(value)}
      page="staking"
      stakingTxData={{
        type: 'unstake',
        unit: cryptoType,
        round: selectedRound,
        rewardValue: 0,
      }}
      contractAddress={stakingPoolAddress}
    />
  );
};

export default Unstake;
