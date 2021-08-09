import React, { Dispatch, SetStateAction } from 'react';
import { View } from 'react-native';
import moment from 'moment';
import AppColors from '../../../enums/AppColors';
import Dot from './Dot';
import { STAKING_POOL_ROUNDS_MOMENT } from '../../../constants/staking';

const DotGraph: React.FC<{
  currentRound: number;
  selectedRound: number;
  setSelectedRound: Dispatch<SetStateAction<number>>;
}> = ({ currentRound, selectedRound, setSelectedRound }) => {
  function getDotStatus(dotRound: number) {
    const roundStartDate = STAKING_POOL_ROUNDS_MOMENT[dotRound - 1].startedAt;
    const roundEndDate = STAKING_POOL_ROUNDS_MOMENT[dotRound - 1].endedAt;
    if (currentRound && dotRound < currentRound) {
      return 'ended';
    } else if (
      currentRound &&
      dotRound === currentRound &&
      moment().isBetween(roundStartDate, roundEndDate)
    ) {
      return 'inProgress';
    } else {
      return 'scheduled';
    }
  }

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
              status={getDotStatus(i)}
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
