import React from 'react';
import { Platform, View } from 'react-native';

const Layout: React.FC = (props) => {
  return (
    <View style={{
      paddingTop: Platform.OS === 'android' ? 25 : 0,
      height: '100%',
      backgroundColor: 'white',
      overflow: 'hidden',
    }}>
      <View
        style={{
          height: '100%',
          marginRight: '5%',
          marginLeft: '5%',
          backgroundColor: 'white',
        }}>
        {props.children}
      </View>
    </View>
  );
};

export default Layout;
