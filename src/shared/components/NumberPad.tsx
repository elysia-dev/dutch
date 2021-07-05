import React, { FunctionComponent } from 'react';
import { TouchableHighlight, View, Image } from 'react-native';
import { H2Text } from '../../shared/components/Texts';
import AppFonts from '../../enums/AppFonts';

const DialButton: FunctionComponent<{ pressHandler: () => void, value?: string, img?: any }> = ({
  pressHandler,
  value,
  img,
}) => {
  let child;
  if (value) {
    child = <H2Text label={value} style={{ textAlign: 'center', fontFamily: AppFonts.Medium }} />;
  } else if (img) {
    child = (
      <View
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Image source={img} resizeMethod='scale' />
      </View>
    );
  }

  return (
    <TouchableHighlight
      style={{
        flex: 1,
        height: 50,
        borderRadius: 8,
        justifyContent: 'center',
        marginHorizontal: 4,
      }}
      onPress={() => pressHandler()}
      underlayColor='#F0F0F0'
      activeOpacity={0.5}
    >
      {child}
    </TouchableHighlight>
  );
};

const NumberPad: FunctionComponent<{ addValue: (text: string) => void, removeValue: () => void, height?: number }> = ({
  addValue,
  removeValue,
  height = 240,
}) => {
  return (
    <View>
      {
        [0, 1, 2].map((index) => {
          return (
            <View key={index} style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', height: height / 4 }}>
              {
                [0, 1, 2].map((index2) => {
                  const number = (index * 3 + index2 + 1).toString();
                  return <DialButton key={number} value={number} pressHandler={() => { addValue(number) }} />
                })
              }
            </View>
          )
        })
      }
      <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', height: height / 4, alignItems: 'center' }}>
        <DialButton key={'.'} value={'.'} pressHandler={() => addValue('.')} />
        <DialButton key={'0'} value={'0'} pressHandler={() => addValue('0')} />
        <DialButton key={'remove'} img={require('../assets/images/delete_icon.png')} pressHandler={() => removeValue()} />
      </View>
    </View>
  );
};

export default NumberPad;
