import React, { useContext, useState, useEffect } from 'react';
import AppFonts from '../../../enums/AppFonts';
import CryptoType from '../../../enums/CryptoType';
import { H4Text } from '../../../shared/components/Texts';
import BoxWithDivider from './BoxWithDivider';
import CardWithShadow from './CardWithShadow';
import PriceContext from '../../../contexts/PriceContext';
import commaFormatter from '../../../utiles/commaFormatter';
import {
  ELFI_PER_DAY_ON_EL_STAKING_POOL,
  DAI_PER_DAY_ON_ELFI_STAKING_POOL,
  ELFI_PER_ROUND_ON_EL_STAKING_POOL,
  DAI_PER_ROUND_ON_ELFI_STAKING_POOL,
  STAKING_POOL_ROUNDS,
} from '../../../constants/staking';
import {
  getElStakingPoolContract,
  getElfiStakingPoolContract,
} from '../../../utiles/getContract';

const MiningPlan: React.FC<{
  round: number;
  rewardCryptoType: CryptoType;
}> = ({ round, rewardCryptoType }) => {
  const { getCryptoPrice } = useContext(PriceContext);
  const contract =
    rewardCryptoType === CryptoType.ELFI
      ? getElStakingPoolContract()
      : getElfiStakingPoolContract();
  const [poolData, setPoolData] = useState({
    rewardPerSecond: 0,
    rewardIndex: 0,
    startTimestamp: 0,
    endTimestamp: 0,
    totalPrincipal: 0,
    lastUpdateTimestamp: 0,
  });

  let rewardPerDay;
  let rewardPerRound;
  if (rewardCryptoType === CryptoType.ELFI) {
    rewardPerDay = ELFI_PER_DAY_ON_EL_STAKING_POOL;
    rewardPerRound = ELFI_PER_ROUND_ON_EL_STAKING_POOL;
  } else {
    rewardPerDay = DAI_PER_DAY_ON_ELFI_STAKING_POOL;
    rewardPerRound = DAI_PER_ROUND_ON_ELFI_STAKING_POOL;
  }

  useEffect(() => {
    contract?.getPoolData(round).then((res: any) => {
      setPoolData({
        rewardPerSecond: res[0],
        rewardIndex: res[1],
        startTimestamp: res[2],
        endTimestamp: res[3],
        totalPrincipal: res[4],
        lastUpdateTimestamp: res[5],
      });
    });
  }, []);

  return (
    <CardWithShadow
      style={{
        paddingVertical: 16,
        paddingHorizontal: 12,
        marginVertical: 10,
        marginHorizontal: 6,
      }}>
      <H4Text
        label={`${round}차 채굴 플랜`}
        style={{ textAlign: 'center', marginBottom: 10 }}
      />
      <BoxWithDivider
        contents={[
          {
            label: '기간',
            value: `${STAKING_POOL_ROUNDS[round - 1].startedAt}\n~ ${
              STAKING_POOL_ROUNDS[round - 1].endedAt
            } (KST)`,
          },
          {
            label: `${round}차 총 채굴량`,
            value: `${commaFormatter(rewardPerRound)} ${rewardCryptoType}`,
          },
          {
            label: '1일 채굴량',
            value: `${commaFormatter(rewardPerDay)} ${rewardCryptoType}`,
          },
          { label: '누적 채굴량', value: `${'(모름)'} ${rewardCryptoType}` },
          { label: '잔여 채굴량', value: `${'(모름)'} ${rewardCryptoType}` },
          {
            label: `${rewardCryptoType} 가격`,
            value: `$ ${getCryptoPrice(rewardCryptoType)}`,
          },
        ]}
        boxStyle={{ width: 300 }}
        innerBoxStyle={{
          paddingVertical: 12,
          paddingHorizontal: 15,
        }}
        labelStyle={{ fontSize: 12 }}
        valueStyle={{ fontSize: 12, fontFamily: AppFonts.Medium }}
      />
    </CardWithShadow>
  );
};

export default MiningPlan;
