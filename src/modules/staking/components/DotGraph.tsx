import React, { Dispatch, SetStateAction } from 'react';
import { View } from 'react-native';
import AppColors from '../../../enums/AppColors';
import Dot from './Dot';

const DotGraph: React.FC<{
  selectedCycle: number;
  setSelectedCycle: Dispatch<SetStateAction<number>>;
}> = ({ selectedCycle, setSelectedCycle }) => {
  return (
    <View>
      <View
        style={{
          height: 80,
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 40,
        }}>
        <View
          style={{
            width: '99%',
            borderColor: AppColors.GREY,
            borderWidth: 1,
          }}
        />
      </View>
      <View
        style={{
          width: '100%',
          position: 'absolute',
          top: 33,
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        {[1, 2, 3, 4, 5, 6].map((i) => {
          return (
            <Dot
              key={i}
              cycle={i}
              status={'scheduled'}
              selected={selectedCycle === i ? true : false}
              setSelectedCycle={setSelectedCycle}
            />
          );
        })}
      </View>
    </View>
  );
};

export default DotGraph;
