import React, { useState, useContext } from 'react';
import { View, Text, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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
import {
  getElStakingPoolContract,
  getElfiStakingPoolContract,
} from '../../utiles/getContract';
import WalletContext from '../../contexts/WalletContext';
import CryptoType from '../../enums/CryptoType';
import PaymentSelection from '../../shared/components/PaymentSelection';

const Unstake: React.FC<{ route: any }> = ({ route }) => {
  const { cryptoType, selectedRound, earnReward } = route.params;
  const [value, setValue] = useState('');
  const { isWalletUser, user } = useContext(UserContext);
  const [modalVisible, setModalVisible] = useState(false);
  const insets = useSafeAreaInsets();
  const { getCryptoPrice } = useContext(PriceContext);
  const [selectionVisible, setSelectionVisible] = useState(false);
  const contract =
    cryptoType === CryptoType.EL
      ? getElStakingPoolContract()
      : getElfiStakingPoolContract();
  const { wallet } = useContext(WalletContext);
  const rewardCryptoType =
    cryptoType === CryptoType.EL ? CryptoType.ELFI : CryptoType.DAI;

  let principal = 0;
  let reward = 0;
  contract
    ?.getUserData(
      selectedRound,
      isWalletUser ? wallet?.getFirstAddress() : user.ethAddresses[0],
    )
    .then((res: any) => {
      principal = res[2]; // userPrincipal
      reward = res[1]; // userReward
    });

  let confirmationList;
  if (earnReward) {
    confirmationList = [
      { label: `언스테이킹 회차`, value: `${selectedRound}차 언스테이킹` },
      {
        label: `언스테이킹 수량`,
        value: `${value} ${cryptoType}`,
        subvalue: `$ ${decimalFormatter(
          parseFloat(value || '0') * getCryptoPrice(cryptoType),
          6,
        )}`,
      },
      { label: '보상 수량', value: `${reward} ${rewardCryptoType}` },
      { label: '가스비', value: '(모름)' },
    ];
  } else {
    confirmationList = [
      { label: `언스테이킹 회차`, value: `${selectedRound}차 언스테이킹` },
      {
        label: `언스테이킹 수량`,
        value: `${value} ${cryptoType}`,
        subvalue: `$ ${decimalFormatter(
          parseFloat(value || '0') * getCryptoPrice(cryptoType),
          6,
        )}`,
      },
      { label: '가스비', value: '(모름)' },
    ];
  }

  if (!selectionVisible) {
    return (
      <View style={{ backgroundColor: AppColors.WHITE, height: '100%' }}>
        <SheetHeader title={`${cryptoType} 언스테이킹`} />
        <View
          style={{
            marginTop: Platform.OS === 'android' ? 20 : 10,
            paddingHorizontal: 20,
            flex: 1,
          }}>
          <LargeTextInput
            placeholder="몇 개를 언스테이킹할까요?"
            value={value}
            unit={cryptoType}
          />
          <InputInfoBox
            list={[
              `언스테이킹 달러 가치: $ ${decimalFormatter(
                parseFloat(value || '0') * getCryptoPrice(cryptoType),
                6,
              )}`,
              `언스테이킹 가능 수량: ${decimalFormatter(
                principal,
                6,
              )} ${cryptoType}`,
              `예상 가스비: ${'(모름)'}`,
            ]}
          />
          <NumberPadShortcut
            values={[0.01, 1, 10, 100, 1000]}
            inputValue={value}
            setValue={setValue}
          />
          <NumberPad
            addValue={(text) => {
              const includesComma = value.includes('.');
              if (
                (text === '.' && includesComma) ||
                (text !== '.' && !includesComma && value.length >= 12) ||
                (includesComma && value.split('.')[1].length >= 6) ||
                (value
                  .split('')
                  .reduce((res, cur) => res && cur === '0', true) &&
                  text === '0')
              ) {
                return;
              }

              const next =
                text === '.' && !value
                  ? '0.'
                  : text !== '0' && value === '0'
                  ? text
                  : value + text;

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
            title="입력 완료"
            disabled={!value}
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
          title={`${cryptoType} 언스테이킹`}
          subtitle="최종 확인을 해 주세요!"
          list={confirmationList}
          isApproved={true}
          submitButtonText={`${selectedRound}차 언스테이킹`}
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
        type: 'unstake',
        rewardValue: earnReward && reward,
      }}
      contractAddress={contract?.address}
    />
  );
};

export default Unstake;
