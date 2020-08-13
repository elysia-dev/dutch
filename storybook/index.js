import { getStorybookUI, configure } from "@storybook/react-native";
import "./rn-addons";

// import stories
configure(() => {
  require("./stories");
}, module);

const StorybookUIRoot = getStorybookUI({
  onDeviceUI: false,
  asyncStorage: require('react-native').AsyncStorage || null
});

export default StorybookUIRoot;