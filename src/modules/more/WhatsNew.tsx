import React, { FunctionComponent } from 'react';
import { View } from 'react-native';
import { WebView } from 'react-native-webview';
import AppColors from '../../enums/AppColors';

const WhatsNew: FunctionComponent = () => {
  return (
    <View style={{ height: '100%', backgroundColor: AppColors.WHITE }}>
      <WebView
        source={{
          uri: 'https://www.notion.so/modoripage/Release-Note-cb3dabaf23a345af81e96696b1a47602',
        }}
        style={{ marginTop: 20 }}
      />
    </View>
  );
};

export default WhatsNew;
