import React, { useState, useContext } from 'react';
import { View, Text, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppColors from '../../../enums/AppColors';
import GuideText from '../../../shared/components/GuideText';
import SheetHeader from '../../../shared/components/SheetHeader';
import LargeTextInput from './LargeTextInput';
import NumberPadShortcut from './NumberPadShortcut';
import NumberPad from '../../../shared/components/NumberPad';
import NextButton from '../../../shared/components/NextButton';
import UserContext from '../../../contexts/UserContext';
import AppFonts from '../../../enums/AppFonts';
import ConfirmationModal from '../../../shared/components/ConfirmationModal';
import CryptoType from '../../../enums/CryptoType';

const StakingInput: React.FC<{
  cryptoType: CryptoType;
  actionType: 'staking' | 'unstaking' | 'reward';
  cycle: number;
}> = ({ cryptoType, actionType, cycle }) => {
  const [value, setValue] = useState('');
  const { isWalletUser } = useContext(UserContext);
  const [modalVisible, setModalVisible] = useState(false);
  const insets = useSafeAreaInsets();
  const action = actionType === 'staking' ? '스테이킹' : '언스테이킹'; // 보상수령은 나중에..

  return (
    <View style={{ backgroundColor: AppColors.WHITE, height: '100%' }}>
      <SheetHeader title={`${cryptoType} ${action}`} />
      {actionType === 'staking' && (
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
      )}
      <View
        style={{
          marginTop: Platform.OS === 'android' ? 20 : 10,
          paddingHorizontal: 20,
          flex: 1,
        }}>
        <LargeTextInput value={value} />
        <View
          style={{
            marginTop: 10,
            width: '100%',
            borderColor: AppColors.SUB_GREY,
            borderWidth: 1,
            borderRadius: 5,
            paddingVertical: 12,
            paddingHorizontal: 10,
            marginBottom: Platform.OS === 'android' ? 60 : 30,
          }}>
          <GuideText text={`${action} 달러 가치 : $100.00`} />
          <GuideText
            text={`${action} 가능 수량 : 100,000 EL`}
            style={{ marginTop: 6 }}
          />
          <GuideText text="예상 가스비 : 0.01 ETH" style={{ marginTop: 6 }} />
        </View>
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
              console.log('스테이킹/언스테이킹/보상수령 해야 함');
            }
          }}
        />
      </View>
      <ConfirmationModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        title={`${cryptoType} ${action}`}
        subtitle="최종 확인을 해 주세요!"
        list={[
          { label: `${action} 회차`, value: `${cycle}차 스테이킹` },
          {
            label: `${action} 수량`,
            value: '1,000,000 EL',
            subvalue: '$ 5,000,000',
          },
          { label: '가스비', value: '0.5 ETH' },
        ]}
        isApproved={true}
        submitButtonText={`${cycle}차 ${action}`}
        handler={() => console.log('스테이킹/언스테이킹/보상수령 해야 함')}
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

export default StakingInput;
