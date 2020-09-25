import { getStorybookUI, configure } from "@storybook/react-native";
import { AppRegistry } from 'react-native';

// import './rn-addons.ts'

configure(() => {
  require('./stories/stories.ts');
}, module);

const StorybookUIRoot = getStorybookUI({
  onDeviceUI: true,
  asyncStorage: require('react-native').AsyncStorage || null,
});

export default StorybookUIRoot;
AppRegistry.registerComponent('elysia.land', () => StorybookUIRoot);
