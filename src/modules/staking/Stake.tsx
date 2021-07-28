import React, { useState, useContext } from 'react';
import { View, Text, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppColors from '../../enums/AppColors';
import GuideText from '../../shared/components/GuideText';
import SheetHeader from '../../shared/components/SheetHeader';
import LargeTextInput from './components/LargeTextInput';
import NumberPadShortcut from './components/NumberPadShortcut';
import NumberPad from '../../shared/components/NumberPad';
import NextButton from '../../shared/components/NextButton';
import UserContext from '../../contexts/UserContext';
import AppFonts from '../../enums/AppFonts';

const Stake: React.FC<{ route: any }> = ({ route }) => {
  const { type } = route.params;
  const [value, setValue] = useState('');
  const { isWalletUser } = useContext(UserContext);
  const [modalVisible, setModalVisible] = useState(false);
  const insets = useSafeAreaInsets();

  return (
    <View style={{ backgroundColor: AppColors.WHITE, height: '100%' }}>
      <SheetHeader title={`${type} 스테이킹`} />
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
          marginTop: Platform.OS === 'android' ? 40 : 20,
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
          <GuideText text="스테이킹 달러 가치 : $100.00" />
          <GuideText
            text="스테이킹 가능 수량 : 100,000 EL"
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
              console.log('스테이킹해야함');
            }
          }}
        />
      </View>
      {/* <ConfirmationModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        title={title}
        purpose={purpose}
        assetTitle={assetInToken.title}
        assetUnit={assetInToken.unit}
        values={values}
        priceInCryptocurrency={cryptoPrice}
        cryptocurrencyType={assetInCrypto.type}
        estimateGas={estimateGas}
        gasCrypto={gasCrypto}
        isApproved={isApproved}
        createTx={createTx}
      />
      <OverlayLoading
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
