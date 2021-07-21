
import React, { Component } from 'react';
import { View, Platform } from 'react-native';

class StatusBarBackground extends Component {
  render() {
    return (
      <View
        style={{
          height: (Platform.OS === 'ios') ? 180 : 0,
          backgroundColor: 'white',
        }}
      />
    );
  }
}

export default StatusBarBackground;
