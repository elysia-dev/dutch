import React, { FunctionComponent } from 'react';
import { View } from 'react-native';
import { WebView } from 'react-native-webview';

const WhatsNew: FunctionComponent = () => {
  return (
    <View style={{ height: "100%", backgroundColor: 'white' }}>
      <WebView source={{ uri: 'https://www.notion.so/modoripage/Release-Note-cb3dabaf23a345af81e96696b1a47602' }} style={{ marginTop: 20 }} />
    </View>
  );
};

export default WhatsNew;