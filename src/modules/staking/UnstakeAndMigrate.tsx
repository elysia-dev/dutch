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
import isNumericStringAppendable from '../../utiles/isNumericStringAppendable';
import newInputValueFormatter from '../../utiles/newInputValueFormatter';

const UnstakeAndMigrate: React.FC<{ route: any }> = ({ route }) => {
  const { cryptoType, selectedCycle, currentCycle, earnReward } = route.params;
  const [value, setValue] = useState('');
  const { isWalletUser } = useContext(UserContext);
  const [modalVisible, setModalVisible] = useState(false);
  const insets = useSafeAreaInsets();

  let confirmationList;
  if (earnReward) {
    confirmationList = [
      {
        label: `언스테이킹 회차`,
        value: `${selectedCycle}차 언스테이킹`,
      },
      {
        label: `언스테이킹 수량`,
        value: '1,000,000 EL',
        subvalue: '$ 5,000,000',
      },
      { label: '마이그레이션 수량', value: '1,000,000 EL' },
      {
        label: '마이그레이션 위치',
        value: `${selectedCycle}차 → ${currentCycle}차`,
      },
      { label: '보상 수량', value: '1,000 ELFI' },
      { label: '가스비', value: '0.5 ETH' },
    ];
  } else {
    confirmationList = [
      { label: `언스테이킹 회차`, value: `${selectedCycle}차 언스테이킹` },
      {
        label: `언스테이킹 수량`,
        value: '1,000,000 EL',
        subvalue: '$ 5,000,000',
      },
      { label: '마이그레이션 수량', value: '1,000,000 EL' },
      {
        label: '마이그레이션 위치',
        value: `${selectedCycle}차 → ${currentCycle}차`,
      },
      { label: '가스비', value: '0.5 ETH' },
    ];
  }

  return (
    <View style={{ backgroundColor: AppColors.WHITE, height: '100%' }}>
      <SheetHeader title={`${cryptoType} 언스테이킹`} />
      <View
        style={{
          marginTop: Platform.OS === 'android' ? 20 : 10,
          paddingHorizontal: 20,
          flex: 1,
        }}>
        <LargeTextInput placeholder="몇 개를 언스테이킹할까요?" value={value} />
        <LargeTextInput
          placeholder="몇 개를 마이그레이션할까요?"
          value={value}
          unit={cryptoType}
        />
        <InputInfoBox />
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
          disabled={!value}
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
        title={`${cryptoType} 언스테이킹`}
        subtitle="최종 확인을 해 주세요!"
        list={confirmationList}
        isApproved={true}
        submitButtonText={`${selectedCycle}차 언스테이킹`}
        handler={() => console.log('언스테이킹 해야 함')}
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
