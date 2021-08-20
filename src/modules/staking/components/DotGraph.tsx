import React, { Dispatch, SetStateAction } from 'react';
import { View } from 'react-native';
import AppColors from '../../../enums/AppColors';
import Dot from './Dot';
import getRoundStatus from '../../../utiles/geRoundStatus';

const DotGraph: React.FC<{
  selectedRound: number;
  setSelectedRound: Dispatch<SetStateAction<number>>;
}> = ({ selectedRound, setSelectedRound }) => {
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
              round={i}
              status={getRoundStatus(i)}
              selected={selectedRound === i ? true : false}
              setSelectedRound={setSelectedRound}
            />
          );
        })}
      </View>
    </View>
  );
};

export default DotGraph;
