import React, { FunctionComponent } from 'react';
import { View } from 'react-native';
import { WebView } from 'react-native-webview';
import AppColors from '../../enums/AppColors';

const HelpDesk: FunctionComponent = () => {
  return (
    <View style={{ height: "100%", backgroundColor: AppColors.WHITE }}>
      <WebView source={{ uri: 'https://elysia.gitbook.io/elysia-guide/' }} style={{ marginTop: 20 }} />
    </View>
  );
};

export default HelpDesk;