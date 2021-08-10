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
import AppFonts from '../../enums/AppFonts';
import ConfirmationModal from '../../shared/components/ConfirmationModal';
import InputInfoBox from './components/InputInfoBox';
import PriceContext from '../../contexts/PriceContext';
import AssetContext from '../../contexts/AssetContext';
import decimalFormatter from '../../utiles/decimalFormatter';
import calculateAPR, { aprFormatter } from '../../utiles/calculateAPR';
import isNumericStringAppendable from '../../utiles/isNumericStringAppendable';
import newInputValueFormatter from '../../utiles/newInputValueFormatter';

const Stake: React.FC<{ route: any }> = ({ route }) => {
  const { cryptoType, selectedRound } = route.params;
  const [value, setValue] = useState('');
  const { isWalletUser } = useContext(UserContext);
  const [modalVisible, setModalVisible] = useState(false);
  const insets = useSafeAreaInsets();
  const { getCryptoPrice } = useContext(PriceContext);
  const { getBalance } = useContext(AssetContext);

  return (
    <View style={{ backgroundColor: AppColors.WHITE, height: '100%' }}>
      <SheetHeader title={`${cryptoType} 스테이킹`} />
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
          {`${selectedRound}차 스테이킹 APR`}
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
          placeholder="몇 개를 스테이킹할까요?"
          value={value}
          unit={cryptoType}
        />
        <InputInfoBox
          list={[
            `스테이킹 달러 가치: $ ${decimalFormatter(
              parseFloat(value || '0') * getCryptoPrice(cryptoType),
              6,
            )}`,
            `스테이킹 가능 수량: ${decimalFormatter(
              getBalance(cryptoType),
              6,
            )} ${cryptoType}`,
            `예상 가스비: ${'(모름)'}`,
          ]}
          isInvalid={parseFloat(value) > getBalance(cryptoType)}
          invalidText={`보유하신 ${cryptoType} 잔액이 부족합니다.`}
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
          title="입력 완료"
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
        title={`${cryptoType} 스테이킹`}
        subtitle="최종 확인을 해 주세요!"
        list={[
          { label: `스테이킹 회차`, value: `${selectedRound}차 스테이킹` },
          {
            label: `스테이킹 수량`,
            value: `${value} ${cryptoType}`,
            subvalue: `$ ${decimalFormatter(
              parseFloat(value || '0') * getCryptoPrice(cryptoType),
              6,
            )}`,
          },
          { label: '가스비', value: '(모름)' },
        ]}
        isApproved={true}
        submitButtonText={`${selectedRound}차 스테이킹`}
        handler={() => console.log('스테이킹 해야 함')}
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
