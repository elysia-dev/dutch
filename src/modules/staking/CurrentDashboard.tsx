import React from 'react';
import { View, Text } from 'react-native';
import SheetHeader from '../../shared/components/SheetHeader';
import AppColors from '../../enums/AppColors';

const DashBoard: React.FC<{ route: any; navigation: any }> = ({ route }) => {
  const { type } = route.params;
  return (
    <View
      style={{
        backgroundColor: AppColors.WHITE,
        height: '100%',
      }}>
      <SheetHeader title="" />
      <Text>{type}</Text>
    </View>
  );
};

export default DashBoard;
