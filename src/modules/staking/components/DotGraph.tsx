import React, { Dispatch, SetStateAction } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import AppColors from '../../../enums/AppColors';
import Dot from './Dot';
import getRoundStatus from '../../../utiles/geRoundStatus';

const DotGraph: React.FC<{
  selectedRound: number;
  setSelectedRound?: Dispatch<SetStateAction<number>>;
  currentRound: number;
}> = ({ selectedRound, setSelectedRound, currentRound }) => {
  const { i18n } = useTranslation();
  const lineLength = i18n.language === 'zhHans' ? 93 : 97;

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
                currentRound === 1 ? 0 : (lineLength / 5) * (currentRound - 1)
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
        {[1, 2, 3, 4].map((i) => {
          return (
            <Dot
              key={i}
              round={i}
              status={getRoundStatus(i)}
              selected={selectedRound === i ? true : false}
              setSelectedRound={setSelectedRound} // 이거를 선택으로 해야 할 듯...?
            />
          );
        })}
      </View>
    </View>
  );
};

export default DotGraph;
