import React, { FunctionComponent } from 'react';
import { TouchableHighlight, View, Image } from 'react-native';

const RemoveButton: FunctionComponent<{ pressHandler: () => void }> = ({
  pressHandler,
}) => {
  return (
    <TouchableHighlight
      style={{
        width: 100,
        height: 50,
        borderRadius: 8,
        justifyContent: 'center',
        marginHorizontal: 4,
      }}
      onPress={() => pressHandler()}
      underlayColor='#F0F0F0'
      activeOpacity={0.5}
    >
      <View
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Image
          source={require('../assets/images/delete_icon_xxhdpi.png')}
          resizeMethod='scale'
          style={{ width: 42, height: 42 }}
        />
      </View>
    </TouchableHighlight>
  );
};

export default RemoveButton;
