import React, { FunctionComponent } from 'react';
import { TouchableHighlight, View } from 'react-native';
import { H2Text } from '../../shared/components/Texts';

const DialButton: FunctionComponent<{ pressHandler: () => void, value: string }> = ({
  pressHandler,
  value,
}) => {
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
      <H2Text label={value} style={{ textAlign: 'center' }} />
    </TouchableHighlight>
  );
};

const NumberPad: FunctionComponent<{ addValue: (text: string) => void, removeValue: () => void, height?: number }> = ({
  addValue,
  removeValue,
  height = 240,
}) => {
  return (
    <View style={{ paddingLeft: '5%', paddingRight: '5%' }}>
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
        <DialButton key={'remove'} value={'←'} pressHandler={() => removeValue()} />
      </View>
    </View>
  );
};

export default NumberPad;
