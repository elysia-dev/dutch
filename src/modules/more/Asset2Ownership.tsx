import React, { FunctionComponent, useContext } from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { P1Text } from '../../shared/components/Texts';
import WrapperLayout from '../../shared/components/WrapperLayout';
import UserContext from '../../contexts/UserContext';
import commaFormatter from '../../utiles/commaFormatter';
import AppColors from '../../enums/AppColors';

const Asset2Ownership: FunctionComponent = () => {
  const { user } = useContext(UserContext);

  const navigation = useNavigation();

  return (
    <WrapperLayout
      isScrolling={true}
      title="My asset#2 ownership"
      backButtonHandler={() => navigation.goBack()}
      body={
        <>
          <View
            style={{
              paddingLeft: '5%',
              // paddingBottom: 20,
              borderBottomWidth: 5,
              borderBottomColor: AppColors.BACKGROUND_GREY,
            }}>
            <P1Text
              label={'상품설명'}
              style={{
                color: AppColors.TEXT_GREY,
                marginTop: 20,
                marginBottom: 5,
              }}
            />
            <P1Text
              label={
                '엘리시아의 한국 자회사(엘리시아 에셋 2호)가 부동산을 전세를 제외한 값으로 취득합니다. 이후 엘리시아 에셋 2호의 보통주 주식을 국내 거주자 대상으로 EL토큰과 교환해드립니다. 해당 상품은 부동산 갭투자 방식으로 매매가에서 전세가를 제외한 금액으로 부동산을 매입하여 시세 상승을 노리는 것을 목적으로 합니다. 즉, 실투자금을 최소화하면서도 시세 상승에 대한 이득은 원래 매매가의 상승분만큼 얻을 수 있어, 수익률이 극대화됩니다. 한국의 전세제도를 이용한 상품입니다.'
              }
              style={{ marginRight: '5%' }}
            />
            <P1Text
              label={'예상 수익률'}
              style={{
                color: AppColors.TEXT_GREY,
                marginTop: 20,
                marginBottom: 5,
              }}
            />
            <P1Text label={`2년 보유시 최대 20%`} />
            <P1Text
              label={'예상 매각일'}
              style={{
                color: AppColors.TEXT_GREY,
                marginTop: 20,
                marginBottom: 5,
              }}
            />
            <P1Text label={`2021.08`} />
            <P1Text
              label={'소유 개수'}
              style={{
                color: AppColors.TEXT_GREY,
                marginTop: 20,
                marginBottom: 5,
              }}
            />
            <P1Text label={`${user.legacyAsset2Value.toString()}개`} />
            <P1Text
              label={'총액'}
              style={{
                color: AppColors.TEXT_GREY,
                marginTop: 20,
                marginBottom: 5,
              }}
            />
            <P1Text
              label={`${commaFormatter(user.legacyAsset2Value * 625)}원`}
            />
            <P1Text
              label={'예상 최대 수익'}
              style={{
                color: AppColors.TEXT_GREY,
                marginTop: 20,
                marginBottom: 5,
              }}
            />
            <P1Text
              label={`${commaFormatter(user.legacyAsset2Value * 625 * 0.2)}원`}
              style={{ marginBottom: 20 }}
            />
          </View>
        </>
      }
    />
  );
};

export default Asset2Ownership;
