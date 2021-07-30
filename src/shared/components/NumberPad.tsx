import React, { FunctionComponent } from 'react';
import { View } from 'react-native';
import DialButton from './DialButton';
import RemoveButton from './RemoveButton';

const NumberPad: FunctionComponent<{
  addValue: (text: string) => void;
  removeValue: () => void;
  height?: number;
}> = ({ addValue, removeValue }) => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'space-around',
        paddingVertical: 12,
      }}>
      {[0, 1, 2].map((index) => {
        return (
          <View
            key={index}
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            {[0, 1, 2].map((index2) => {
              const number = (index * 3 + index2 + 1).toString();
              return (
                <DialButton
                  key={number}
                  value={number}
                  pressHandler={() => {
                    addValue(number);
                  }}
                />
              );
            })}
          </View>
        );
      })}
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <DialButton key={'.'} value={'.'} pressHandler={() => addValue('.')} />
        <DialButton key={'0'} value={'0'} pressHandler={() => addValue('0')} />
        <RemoveButton key={'remove'} pressHandler={() => removeValue()} />
      </View>
    </View>
  );
};

export default NumberPad;
