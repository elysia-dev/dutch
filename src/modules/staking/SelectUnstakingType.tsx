import React from 'react';
import { View } from 'react-native';
import AppColors from '../../enums/AppColors';
import CryptoImage from '../../shared/components/CryptoImage';
import SheetHeader from '../../shared/components/SheetHeader';
import TouchableCardWithShadow from './components/TouchableCardWithShadow';
import CryptoType from '../../enums/CryptoType';
import { P1Text, P4Text } from '../../shared/components/Texts';
import AppFonts from '../../enums/AppFonts';

const SelectUnstakingType: React.FC<{ route: any }> = ({ route }) => {
  const { cryptoType } = route.params;
  return (
    <View style={{ backgroundColor: AppColors.WHITE, height: '100%' }}>
      <SheetHeader title={`${cryptoType} 언스테이킹`} />
      <View style={{ paddingHorizontal: 20, marginTop: 30 }}>
        <TouchableCardWithShadow
          onPress={() => console.log(1)}
          style={{
            height: 100,
            paddingHorizontal: 16,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View
            style={{
              flexDirection: 'row',
              width: '100%',
              justifyContent: 'space-between',
            }}>
            <View>
              <P4Text
                label="가스비 절감을 위해"
                style={{ color: AppColors.BLACK, lineHeight: 20 }}
              />
              <P1Text
                label="ELFI 토큰도 같이 출금하기"
                style={{ fontFamily: AppFonts.Bold }}
              />
            </View>
            <CryptoImage
              type={CryptoType.EL}
              style={{
                position: 'absolute',
                right: 28,
                zIndex: 2,
              }}
            />
            <CryptoImage type={CryptoType.ELFI} />
          </View>
        </TouchableCardWithShadow>
        <TouchableCardWithShadow
          onPress={() => console.log(1)}
          style={{
            height: 100,
            paddingHorizontal: 16,
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 20,
          }}>
          <View
            style={{
              flexDirection: 'row',
              width: '100%',
              justifyContent: 'space-between',
            }}>
            <View>
              <P4Text
                label="ELFI 토큰은 나중에 수취하고"
                style={{ color: AppColors.BLACK, lineHeight: 20 }}
              />
              <P1Text
                label="EL 토큰만 전송하기"
                style={{ fontFamily: AppFonts.Bold }}
              />
            </View>
            <CryptoImage type={CryptoType.EL} />
          </View>
        </TouchableCardWithShadow>
      </View>
    </View>
  );
};

export default SelectUnstakingType;
