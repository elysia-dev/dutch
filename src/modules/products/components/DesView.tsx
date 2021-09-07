import React from 'react';
import { View } from 'react-native';

const DesView: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <View
      style={{
        marginTop: 18,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
      }}>
      {children}
    </View>
  );
};

export default DesView;
