import React, { FunctionComponent } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { H2Text } from '../../shared/components/Texts';

const DialButton: FunctionComponent<{ pressHandler: () => void, value: string }> = ({
  pressHandler,
  value,
}) => {
  return (
    <TouchableOpacity
      style={{ width: 60, height: 50 }}
      onPress={() => pressHandler()}
    >
      <H2Text label={value} style={{ textAlign: 'center' }} />
    </TouchableOpacity>
  );
};

const NumberPad: FunctionComponent<{ addValue: (text: string) => void, removeValue: () => void }> = ({
  addValue,
  removeValue,
}) => {
  return (
    <View style={{ paddingLeft: '5%', paddingRight: '5%' }}>
      {
        [0, 1, 2].map((index) => {
          return (
            <View key={index} style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', height: 60 }}>
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
      <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', height: 60, alignItems: 'center' }}>
        <DialButton key={'.'} value={'.'} pressHandler={() => addValue('.')} />
        <DialButton key={'0'} value={'0'} pressHandler={() => addValue('0')} />
        <DialButton key={'remove'} value={'←'} pressHandler={() => removeValue()} />
      </View>
    </View>
  );
};

export default NumberPad;
