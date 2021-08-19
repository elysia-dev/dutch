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
import isNumericStringAppendable from '../../utiles/isNumericStringAppendable';
import newInputValueFormatter from '../../utiles/newInputValueFormatter';
import commaFormatter from '../../utiles/commaFormatter';
import useTxHandler from '../../hooks/useTxHandler';
import {
<<<<<<< HEAD
=======
  ELFI_ADDRESS,
>>>>>>> d9e5108c92fd13ccec01fad348ea61864b162f96
  ELFI_STAKING_POOL_ADDRESS,
  EL_ADDRESS,
  EL_STAKING_POOL_ADDRESS,
} from 'react-native-dotenv';
import { useNavigation } from '@react-navigation/native';
import NetworkType from '../../enums/NetworkType';

const Unstake: React.FC<{ route: any }> = ({ route }) => {
  const { cryptoType, selectedRound, earnReward } = route.params;
  const [value, setValue] = useState('');
  const { isWalletUser, user } = useContext(UserContext);
  const [modalVisible, setModalVisible] = useState(false);
  const insets = useSafeAreaInsets();
  const { getCryptoPrice, gasPrice } = useContext(PriceContext);
  const { afterTxFailed, afterTxHashCreated, afterTxCreated } = useTxHandler();
  const navigation = useNavigation();
  const { wallet } = useContext(WalletContext);
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

  let principal = 0;
  let reward = 0;
  stakingPoolContract
    ?.getUserData(selectedRound, address || '')
    .then((res: any) => {
      principal = res[2]; // userPrincipal
      reward = res[1]; // userReward
    });

  const confirmationList = earnReward
    ? [
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
          label: t('staking.reward_supply'),
          value: `${reward} ${rewardCryptoType}`,
        },
        { label: t('staking.gas_price'), value: '(모름)' },
      ]
    : [
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
        { label: t('staking.gas_price'), value: '(모름)' },
      ];

  const estimateGas = async () => {
    let estimateGas: BigNumber | undefined;

    try {
      estimateGas = await stakingPoolContract.estimateGas.withdraw(
        utils.parseEther('1'),
        selectedRound, //round
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
    if (address) {
      estimateGas();
    }
  }, []);

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
        title={t('staking.staking_by_crypto', { stakingCrypto: cryptoType })}
        subtitle={t('staking.confirmation_title')}
        list={confirmationList}
        isApproved={true}
        submitButtonText={t('staking.nth_unstaking', { round: selectedRound })}
        handler={() => onPressUnstaking()}
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

export default Unstake;
