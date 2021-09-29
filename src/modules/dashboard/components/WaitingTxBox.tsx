import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import AppColors from '../../../enums/AppColors';
import { DashboardPage, Page } from '../../../enums/pageEnum';
import useWaitTx from '../../../hooks/useWaitTx';
import { H4Text, P3Text } from '../../../shared/components/Texts';

const WaitingTxBox = () => {
  const navigation = useNavigation();
  const { waitingTxs } = useWaitTx();

  return (
    <View
      style={{
        width: '100%',
        height: 82,
        backgroundColor: AppColors.GREY4,
        justifyContent: 'center',
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 23,
        paddingBottom: 22,
        borderRadius: 5,
        marginBottom: 40,
      }}>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate(Page.Dashboard, {
            screen: DashboardPage.WaitingTxList,
          });
        }}>
        <P3Text
          label={'대기 중인 트랜잭션'}
          style={{ color: AppColors.SUB_BLACK }}
        />
        <H4Text
          label={`현재 ${waitingTxs?.length || 0}건이 대기 중입니다.`}
          style={{ fontSize: 15 }}
        />
      </TouchableOpacity>
    </View>
  );
};

export default WaitingTxBox;
