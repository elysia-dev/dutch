import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import AppFonts from '../../../enums/AppFonts';
import CryptoType from '../../../enums/CryptoType';
import { H4Text } from '../../../shared/components/Texts';
import BoxWithDivider from './BoxWithDivider';
import CardWithShadow from './CardWithShadow';
import BoxWithDividerContent from './BoxWithDividerContent';
import PriceContext from '../../../contexts/PriceContext';
import commaFormatter from '../../../utiles/commaFormatter';
import {
  ELFI_PER_DAY_ON_EL_STAKING_POOL,
  DAI_PER_DAY_ON_ELFI_STAKING_POOL,
  ELFI_PER_ROUND_ON_EL_STAKING_POOL,
  DAI_PER_ROUND_ON_ELFI_STAKING_POOL,
  STAKING_POOL_ROUNDS_MOMENT,
} from '../../../constants/staking';
import calculateMined from '../../../utiles/calculateMined';
import decimalFormatter from '../../../utiles/decimalFormatter';

const MiningPlan: React.FC<{
  round: number;
  cryptoType: CryptoType;
  currentRound: number;
}> = ({ round, cryptoType, currentRound }) => {
  const { getCryptoPrice } = useContext(PriceContext);
  const rewardCryptoType =
    cryptoType === CryptoType.EL ? CryptoType.ELFI : CryptoType.DAI;
  const { t } = useTranslation();

  let rewardPerDay;
  let rewardPerRound;
  if (cryptoType === CryptoType.EL) {
    rewardPerDay = ELFI_PER_DAY_ON_EL_STAKING_POOL;
    rewardPerRound = ELFI_PER_ROUND_ON_EL_STAKING_POOL;
  } else {
    rewardPerDay = DAI_PER_DAY_ON_ELFI_STAKING_POOL;
    rewardPerRound = DAI_PER_ROUND_ON_ELFI_STAKING_POOL;
  }

  const cumulativeMined = calculateMined(cryptoType, round, currentRound);

  return (
    <CardWithShadow
      style={{
        paddingVertical: 16,
        paddingHorizontal: 12,
        marginVertical: 10,
        marginHorizontal: 6,
      }}>
      <H4Text
        label={t('staking.nth_mining_plan', { round })}
        style={{ textAlign: 'center', marginBottom: 10 }}
      />
      <BoxWithDivider>
        <BoxWithDividerContent
          isFirst={true}
          label={t('staking.schedule')}
          value={`${STAKING_POOL_ROUNDS_MOMENT[round - 1].startedAt.format(
            t('datetime_format'),
          )}\n~ ${STAKING_POOL_ROUNDS_MOMENT[round - 1].endedAt.format(
            t('datetime_format'),
          )} (KST)`}
          style={{
            paddingVertical: 12,
            paddingHorizontal: 15,
          }}
          labelStyle={{ fontSize: 12, width: 88 }}
          valueStyle={{ fontSize: 12, fontFamily: AppFonts.Medium }}
        />
        <BoxWithDividerContent
          label={t('staking.nth_mining_supply', { round })}
          value={`${commaFormatter(rewardPerRound)} ${rewardCryptoType}`}
          style={{
            paddingVertical: 12,
            paddingHorizontal: 15,
          }}
          labelStyle={{ fontSize: 12 }}
          valueStyle={{ fontSize: 12, fontFamily: AppFonts.Medium }}
        />
        <BoxWithDividerContent
          label={t('staking.mining_supply_per_day')}
          value={`${commaFormatter(rewardPerDay)} ${rewardCryptoType}`}
          style={{
            paddingVertical: 12,
            paddingHorizontal: 15,
          }}
          labelStyle={{ fontSize: 12 }}
          valueStyle={{ fontSize: 12, fontFamily: AppFonts.Medium }}
        />
        <BoxWithDividerContent
          label={t('staking.cumulative mining supply')}
          value={`${commaFormatter(
            decimalFormatter(cumulativeMined, 5),
          )} ${rewardCryptoType}`}
          style={{
            paddingVertical: 12,
            paddingHorizontal: 15,
          }}
          labelStyle={{ fontSize: 12 }}
          valueStyle={{ fontSize: 12, fontFamily: AppFonts.Medium }}
        />
        <BoxWithDividerContent
          label={t('staking.remaining mining supply')}
          value={`${commaFormatter(
            decimalFormatter(rewardPerRound - cumulativeMined, 5),
          )} ${rewardCryptoType}`}
          style={{
            paddingVertical: 12,
            paddingHorizontal: 15,
          }}
          labelStyle={{ fontSize: 12 }}
          valueStyle={{ fontSize: 12, fontFamily: AppFonts.Medium }}
        />
        <BoxWithDividerContent
          label={t('staking.reward_price', { rewardCrypto: rewardCryptoType })}
          value={`$ ${getCryptoPrice(rewardCryptoType)}`}
          style={{
            paddingVertical: 12,
            paddingHorizontal: 15,
          }}
          labelStyle={{ fontSize: 12 }}
          valueStyle={{ fontSize: 12, fontFamily: AppFonts.Medium }}
        />
      </BoxWithDivider>
    </CardWithShadow>
  );
};

export default MiningPlan;
