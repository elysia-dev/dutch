import React, { useState, useContext, useEffect } from 'react';
import { View, Text, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BigNumber } from '@ethersproject/bignumber';
import { ethers, utils, constants } from 'ethers';
import { useTranslation } from 'react-i18next';
import { useRoute, RouteProp } from '@react-navigation/native';
import AppColors from '../../enums/AppColors';
import SheetHeader from '../../shared/components/SheetHeader';
import LargeTextInput from './components/LargeTextInput';
import NumberPadShortcut from './components/NumberPadShortcut';
import NumberPad from '../../shared/components/NumberPad';
import NextButton from '../../shared/components/NextButton';
import UserContext from '../../contexts/UserContext';
import AppFonts from '../../enums/AppFonts';
import ConfirmationModal from '../../shared/components/ConfirmationModal';
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
import CryptoType from '../../enums/CryptoType';
import {
  getElStakingPoolContract,
  getElfiStakingPoolContract,
} from '../../utiles/getContract';

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
  const { getCryptoPrice, gasPrice } = useContext(PriceContext);
  const { getBalance } = useContext(AssetContext);
  const [selectionVisible, setSelectionVisible] = useState(false);
  const { wallet } = useContext(WalletContext);
  const [estimagedGasPrice, setEstimatedGasPrice] = useState('');
  const contract =
    cryptoType === CryptoType.EL
      ? getElStakingPoolContract()
      : getElfiStakingPoolContract();
  const { t } = useTranslation();

  const estimateGas = async (address: string) => {
    let estimateGas: BigNumber | undefined;

    try {
      estimateGas = await contract?.estimateGas.stake(
        utils.parseEther('0.01'),
        { from: address },
      );

      if (estimateGas) {
        setEstimatedGasPrice(utils.formatEther(estimateGas.mul(gasPrice)));
      }
    } catch (e) {
      setEstimatedGasPrice('');
    }
  };

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
            {`${aprFormatter(calculateAPR(cryptoType, selectedRound))} %`}
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
                setModalVisible(true);
              } else {
                setSelectionVisible(true);
              }
            }}
          />
        </View>
        <ConfirmationModal
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
            { label: t('staking.gas_price'), value: '(모름)' },
          ]}
          isApproved={true}
          submitButtonText={t('staking.nth_staking', { round: selectedRound })}
          handler={() => console.log('내부 지갑 계정 트랜잭션')}
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
      contractAddress={contract?.address}
    />
  );
};

export default Stake;
