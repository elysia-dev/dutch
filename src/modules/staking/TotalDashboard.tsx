import React from 'react';
import { View } from 'react-native';
import AppColors from '../../enums/AppColors';
import AppFonts from '../../enums/AppFonts';
import SheetHeader from '../../shared/components/SheetHeader';
import { TitleText, H4Text, SubTitleText } from '../../shared/components/Texts';
import BoxWithDivider from './components/BoxWithDivider';
import DotGraph from './components/DotGraph';
import CardWithShadow from './components/CardWithShadow';
import CircularButtonWithLabel from './components/CircularButtonWithLabel';

const TotalDashboard: React.FC<{ route: any }> = ({ route }) => {
  const { type } = route.params;

  return (
    <View
      style={{
        backgroundColor: AppColors.WHITE,
        height: '100%',
        width: '100%',
      }}>
      <SheetHeader title="" />
      <View style={{ paddingHorizontal: 20 }}>
        <TitleText
          label="EL 스테이킹 및 ELFI 리워드"
          style={{ fontSize: 22 }}
        />
        <DotGraph />
        <BoxWithDivider
          contents={[
            {
              label: '기간',
              value: '2021.07.25 19:00:00\n~ 2021.09.25 19:00:00 (KST)',
            },
            {
              label: (
                <>
                  <CardWithShadow>
                    <H4Text label="1차 스테이킹 APR" style={{ padding: 15 }} />
                    <View
                      style={{
                        flexDirection: 'row',
                        padding: 15,
                        justifyContent: 'flex-end',
                        borderTopColor: AppColors.SUB_GREY,
                        borderTopWidth: 1,
                      }}>
                      <H4Text label="130,000" style={{ fontSize: 18 }} />
                      <SubTitleText
                        label=" EL"
                        style={{
                          fontSize: 14,
                          fontFamily: AppFonts.Bold,
                        }}
                      />
                    </View>
                  </CardWithShadow>
                  <CardWithShadow style={{ marginTop: 15 }}>
                    <H4Text label="1차 스테이킹 수량" style={{ padding: 15 }} />
                    <View
                      style={{
                        flexDirection: 'row',
                        padding: 15,
                        justifyContent: 'flex-end',
                        borderTopColor: AppColors.SUB_GREY,
                        borderTopWidth: 1,
                      }}>
                      <H4Text label="4.07" style={{ fontSize: 18 }} />
                      <SubTitleText
                        label=" %"
                        style={{
                          fontSize: 14,
                          fontFamily: AppFonts.Bold,
                        }}
                      />
                    </View>
                  </CardWithShadow>
                  <CardWithShadow style={{ marginTop: 15 }}>
                    <H4Text label="1차 보상 수량" style={{ padding: 15 }} />
                    <View
                      style={{
                        flexDirection: 'row',
                        padding: 15,
                        justifyContent: 'flex-end',
                        borderTopColor: AppColors.SUB_GREY,
                        borderTopWidth: 1,
                      }}>
                      <H4Text
                        label="130,000"
                        style={{ fontSize: 18, color: '#00BFFF' }}
                      />
                      <SubTitleText
                        label=" ELFI"
                        style={{
                          fontSize: 14,
                          fontFamily: AppFonts.Bold,
                        }}
                      />
                    </View>
                  </CardWithShadow>
                </>
              ),
              value: '',
            },
          ]}
          boxStyle={{ marginTop: -10 }}
          innerBoxStyle={{ paddingVertical: 25, paddingHorizontal: 19 }}
        />
        <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
          <CircularButtonWithLabel
            cryptoType={type}
            actionType="staking"
            isActive={true}
          />
          <CircularButtonWithLabel
            cryptoType={type}
            actionType="unstaking"
            isActive={true}
          />
          <CircularButtonWithLabel
            cryptoType={type}
            actionType="reward"
            isActive={true}
          />
        </View>
      </View>
    </View>
  );
};

export default TotalDashboard;
