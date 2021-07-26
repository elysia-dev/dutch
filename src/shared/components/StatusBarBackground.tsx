
import React, { Component } from 'react';
import { View, Platform } from 'react-native';
import AppColors from '../../enums/AppColors';

class StatusBarBackground extends Component {
  render() {
    return (
      <View
        style={{
          height: (Platform.OS === 'ios') ? 180 : 0,
          backgroundColor: AppColors.WHITE,
        }}
      />
    );
  }
}

export default StatusBarBackground;
