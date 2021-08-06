import React from 'react';
import AppFonts from '../../../enums/AppFonts';
import { H4Text } from '../../../shared/components/Texts';
import BoxWithDivider from './BoxWithDivider';
import CardWithShadow from './CardWithShadow';
import BoxWithDividerContent from './BoxWithDividerContent';

const MiningPlan: React.FC<{}> = () => {
  return (
    <CardWithShadow
      style={{
        paddingVertical: 16,
        paddingHorizontal: 12,
        marginVertical: 10,
        marginHorizontal: 6,
      }}>
      <H4Text
        label="1차 채굴 플랜"
        style={{ textAlign: 'center', marginBottom: 10 }}
      />
      <BoxWithDivider style={{ width: 300 }}>
        <BoxWithDividerContent
          isFirst={true}
          label="기간"
          value={`2021.07.25 19:00:00\n~ 2021.09.25 19:00:00 (KST)`}
          style={{
            paddingVertical: 12,
            paddingHorizontal: 15,
          }}
          labelStyle={{ fontSize: 12 }}
          valueStyle={{ fontSize: 12, fontFamily: AppFonts.Medium }}
        />
        <BoxWithDividerContent
          label="1차 총 채굴량"
          value="5,000,000 ELFI"
          style={{
            paddingVertical: 12,
            paddingHorizontal: 15,
          }}
          labelStyle={{ fontSize: 12 }}
          valueStyle={{ fontSize: 12, fontFamily: AppFonts.Medium }}
        />
        <BoxWithDividerContent
          label="1일 채굴량"
          value="25,000 ELFI"
          style={{
            paddingVertical: 12,
            paddingHorizontal: 15,
          }}
          labelStyle={{ fontSize: 12 }}
          valueStyle={{ fontSize: 12, fontFamily: AppFonts.Medium }}
        />
        <BoxWithDividerContent
          label="누적 채굴량"
          value="300,000 ELFI"
          style={{
            paddingVertical: 12,
            paddingHorizontal: 15,
          }}
          labelStyle={{ fontSize: 12 }}
          valueStyle={{ fontSize: 12, fontFamily: AppFonts.Medium }}
        />
        <BoxWithDividerContent
          label="잔여 채굴량"
          value="4,700,000 ELFI"
          style={{
            paddingVertical: 12,
            paddingHorizontal: 15,
          }}
          labelStyle={{ fontSize: 12 }}
          valueStyle={{ fontSize: 12, fontFamily: AppFonts.Medium }}
        />
        <BoxWithDividerContent
          label="ELFI 가격"
          value="$ 5,000"
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
