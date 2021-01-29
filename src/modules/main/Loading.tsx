import React, { FunctionComponent } from 'react';
import { View, ActivityIndicator } from 'react-native';

//backgroundColor: '#3679B5'
const Loading: FunctionComponent = () => {
  return (
    <View style={{ flex: 1, backgroundColor: '#3679B5' }}>
      <View style={{
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
