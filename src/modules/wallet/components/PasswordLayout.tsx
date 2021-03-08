import React from 'react';
import { Platform, View } from 'react-native';

const PasswordLayout: React.FC = (props) => {
  return (
    <View style={{
      paddingTop: Platform.OS === 'android' ? 25 : 0,
      height: '100%',
      backgroundColor: 'white',
    }}>
      <View
        style={{
          paddingLeft: '5%',
          paddingRight: '5%',
          borderBottomWidth: 5,
          paddingBottom: 60,
          backgroundColor: 'white'
        }}>
        {props.children}
      </View>
    </View>
  );
};

export default PasswordLayout;