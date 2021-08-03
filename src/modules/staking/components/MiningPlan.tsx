import React, { useContext } from 'react';
import AppFonts from '../../../enums/AppFonts';
import CryptoType from '../../../enums/CryptoType';
import { H4Text } from '../../../shared/components/Texts';
import BoxWithDivider from './BoxWithDivider';
import CardWithShadow from './CardWithShadow';
import PriceContext from '../../../contexts/PriceContext';

const MiningPlan: React.FC<{
  round: number;
  rewardCryptoType: CryptoType;
}> = ({ round, rewardCryptoType }) => {
  const { getCryptoPrice } = useContext(PriceContext);

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
            value: '(모름)\n~ (모름) (KST)',
          },
          {
            label: `${round}차 총 채굴량`,
            value: `500,000 ${rewardCryptoType}`,
          },
          { label: '1일 채굴량', value: `25,000 ${rewardCryptoType}` },
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
