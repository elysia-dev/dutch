import React, { Dispatch, SetStateAction } from 'react';
import { View } from 'react-native';
import AppColors from '../../../enums/AppColors';
import Dot from './Dot';

const DotGraph: React.FC<{
  selectedRound: number;
  setSelectedRound: Dispatch<SetStateAction<number>>;
}> = ({ selectedRound, setSelectedRound }) => {
  const dots = [];
  // 나중에는 회차 목록 가져와서 돌리는 걸로
  for (let i = 1; i <= 6; i++) {
    // 날짜로 하는 게 나으려나...? 각 회차가 자기 상태도 갖고 있나??
    dots.push(
      <Dot
        key={i}
        round={i}
        status={'scheduled'}
        selected={selectedRound === i ? true : false}
        setSelectedRound={setSelectedRound}
      />,
    );
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
        {dots}
      </View>
    </View>
  );
};

export default DotGraph;
