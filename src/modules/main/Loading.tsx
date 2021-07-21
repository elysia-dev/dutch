import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import AppColors from '../../enums/AppColors';

const Loading: React.FC = () => {
  return (
    <View style={{ flex: 1, backgroundColor: AppColors.MAIN }}>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <ActivityIndicator size="large" color="#ffff" />
      </View>
    </View>
  );
};

export default Loading;
