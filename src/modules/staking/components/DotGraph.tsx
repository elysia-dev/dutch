import React, { Dispatch, SetStateAction } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import AppColors from '../../../enums/AppColors';
import Dot from './Dot';
import getRoundStatus from '../../../utiles/geRoundStatus';
import range from '../../../utiles/range';
import { NUMBER_OF_ROUNDS } from '../../../constants/staking';

const DotGraph: React.FC<{
  selectedRound: number;
  setSelectedRound?: Dispatch<SetStateAction<number>>;
  currentRound: number;
}> = ({ selectedRound, setSelectedRound, currentRound }) => {
  const { i18n } = useTranslation();
  const lineLength = i18n.language === 'zhHans' ? 93 : 97;
  const stakingRounds = range(1, NUMBER_OF_ROUNDS, 1);

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
            width: `${lineLength}%`,
            borderColor: AppColors.GREY,
            borderWidth: 1,
          }}
        />
        {setSelectedRound && (
          <View
            style={{
              position: 'absolute',
              left: `${(100 - lineLength) / 2}%`,
              width: `${
                currentRound === 1 ? 0 : (lineLength / 3) * (currentRound - 1)
              }%`,
              borderColor: AppColors.MAIN,
              borderWidth: 1,
            }}
          />
        )}
      </View>
      <View
        style={{
          width: '100%',
          position: 'absolute',
          top: 33,
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        {stakingRounds.map((i) => {
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
