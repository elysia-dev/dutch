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

const Stake: React.FC<{ route: any }> = ({ route }) => {
  const { cryptoType, cycle } = route.params;
  const [value, setValue] = useState('');
  const { isWalletUser } = useContext(UserContext);
  const [modalVisible, setModalVisible] = useState(false);
  const insets = useSafeAreaInsets();

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
          1차 스테이킹 APR
        </Text>
        <Text
          style={{
            color: AppColors.BLACK,
            fontFamily: AppFonts.Bold,
            fontSize: 14,
          }}>
          120.32%
        </Text>
      </View>
      <View
        style={{
          marginTop: Platform.OS === 'android' ? 20 : 10,
          paddingHorizontal: 20,
          flex: 1,
        }}>
        <LargeTextInput value={value} />
        <InputInfoBox />
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
              (value.split('').reduce((res, cur) => res && cur === '0', true) &&
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
          { label: `스테이킹 회차`, value: `${cycle}차 스테이킹` },
          {
            label: `스테이킹 수량`,
            value: '1,000,000 EL',
            subvalue: '$ 5,000,000',
          },
          { label: '가스비', value: '0.5 ETH' },
        ]}
        isApproved={true}
        submitButtonText={`${cycle}차 스테이킹`}
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
