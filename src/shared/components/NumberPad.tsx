import React, { FunctionComponent } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { H1Text } from '../../shared/components/Texts';

const DialButton: FunctionComponent<{ pressHandler: () => void, value: string }> = ({
  pressHandler,
  value,
}) => {
  return (
    <TouchableOpacity
      style={{ width: 70, height: 70 }}
      onPress={() => pressHandler()}
    >
      <H1Text label={value} style={{ textAlign: 'center' }} />
    </TouchableOpacity>
  );
};

const NumberPad: FunctionComponent<{ addValue: (text: string) => void, removeValue: () => void }> = ({
  addValue,
  removeValue,
}) => {
  return (
    <View>
      {
        [0, 1, 2].map((index) => {
          return (
            <View key={index} style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', height: 70 }}>
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
      <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', height: 70, alignItems: 'center' }}>
        <DialButton key={'.'} value={'.'} pressHandler={() => { addValue('.') }} />
        <DialButton key={'0'} value={'0'} pressHandler={() => addValue('0')} />
        <DialButton key={'remove'} value={'←'} pressHandler={() => removeValue()} />
      </View>
    </View>
  );
};

export default NumberPad;
