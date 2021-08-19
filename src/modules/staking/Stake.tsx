import { View, Text, Platform } from 'react-native';
import React, { useState, useContext, useEffect } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BigNumber } from '@ethersproject/bignumber';
import { ethers, utils, constants, ContractTransaction } from 'ethers';
import { useTranslation } from 'react-i18next';
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
import calculateAPR, { aprFormatter } from '../../utiles/calculateAPR';
import isNumericStringAppendable from '../../utiles/isNumericStringAppendable';
import newInputValueFormatter from '../../utiles/newInputValueFormatter';
import commaFormatter from '../../utiles/commaFormatter';
import WalletContext from '../../contexts/WalletContext';
import CryptoType from '../../enums/CryptoType';
import {
  provider,
  getErc20Contract,
  getStakingPoolContract,
} from '../../utiles/getContract';
import {
  ELFI_ADDRESS,
  ELFI_STAKING_POOL_ADDRESS,
  EL_ADDRESS,
  EL_STAKING_POOL_ADDRESS,
} from 'react-native-dotenv';
import { useNavigation } from '@react-navigation/native';
import useTxHandler from '../../hooks/useTxHandler';
import NetworkType from '../../enums/NetworkType';

const Stake: React.FC<{ route: any }> = ({ route }) => {
  const { cryptoType, selectedRound } = route.params;
  const [value, setValue] = useState('');
  const { isWalletUser, user } = useContext(UserContext);
  const [modalVisible, setModalVisible] = useState(false);
  const insets = useSafeAreaInsets();
  const { getCryptoPrice, gasPrice } = useContext(PriceContext);
  const { getBalance } = useContext(AssetContext);
  const { afterTxFailed, afterTxHashCreated, afterTxCreated } = useTxHandler();
  const crytoBalance = getBalance(cryptoType);
  const { wallet } = useContext(WalletContext);
  const [estimagedGasPrice, setEstimatedGasPrice] = useState('');
  const navigation = useNavigation();
  const { t } = useTranslation();
  const [allowanceInfo, setAllowanceInfo] = useState<{ value: string }>({
    value: '0',
  });
  const { ercAddress, stakingAddress, signer } = {
    ercAddress: cryptoType === CryptoType.EL ? EL_ADDRESS : ELFI_ADDRESS,
    stakingAddress:
      cryptoType === CryptoType.EL
        ? EL_STAKING_POOL_ADDRESS
        : ELFI_STAKING_POOL_ADDRESS,
    signer: wallet?.getFirstSigner() || provider,
  };
  const erc20Contract = getErc20Contract(ercAddress, signer);
  const stakingPoolContract = getStakingPoolContract(stakingAddress, signer);
  const address = isWalletUser
    ? wallet?.getFirstAddress()
    : user.ethAddresses[0];

  const estimateGas = async () => {
    let estimateGas: BigNumber | undefined;
    try {
      estimateGas = await stakingPoolContract?.estimateGas.stake(
        utils.parseEther('100'),
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

  const setAllowance = async () => {
    try {
      const allowance: BigNumber = await erc20Contract.allowance(
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
    return Number(allowanceInfo.value) < crytoBalance;
  };

  const setApporve = async () => {
    try {
      if (isAllowanceForApprove()) {
        await approve();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const approve = async () => {
    try {
      await erc20Contract.approve(
        EL_STAKING_POOL_ADDRESS,
        '1' + '0'.repeat(30),
      );
    } catch (error) {
      console.log(error);
    }
  };

  const stake = async () => {
    try {
      return await stakingPoolContract.stake(utils.parseUnits(value), {
        gasLimit: BigNumber.from('170000'),
      });
    } catch (error) {
      console.error(error);
    }
  };

  const onPressStaking = async () => {
    try {
      await setApporve();
      const resTx = await stake();
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
      setAllowance();
      estimateGas();
    }
  }, []);

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
              console.log('스테이킹 해야 함');
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
        handler={() => onPressStaking()}
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

export default Stake;
