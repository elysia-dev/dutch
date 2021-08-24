import React, { useState, useEffect, useContext } from 'react';
import { View, ScrollView } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { BigNumber } from 'ethers';
import AppColors from '../../enums/AppColors';
import SheetHeader from '../../shared/components/SheetHeader';
import { TitleText } from '../../shared/components/Texts';
import BoxWithDivider from './components/BoxWithDivider';
import DotGraph from './components/DotGraph';
import CircularButtonWithLabel from '../../shared/components/CircularButtonWithLabel';
import StakingInfoCard from './components/StakingInfoCard';
import {
  getElStakingPoolContract,
  getElfiStakingPoolContract,
} from '../../utiles/getContract';
import CryptoType from '../../enums/CryptoType';
import calculateAPR, { aprFormatter } from '../../utiles/calculateAPR';
import { STAKING_POOL_ROUNDS } from '../../constants/staking';
import BoxWithDividerContent from './components/BoxWithDividerContent';
import { Page, StakingPage } from '../../enums/pageEnum';
import UserContext from '../../contexts/UserContext';
import WalletContext from '../../contexts/WalletContext';
import commaFormatter from '../../utiles/commaFormatter';

type ParamList = {
  TotalDashboard: {
    cryptoType: CryptoType;
    round: number;
    stakingAmount: BigNumber;
    rewardAmount: BigNumber;
  };
};

const TotalDashboard: React.FC = () => {
  const route = useRoute<RouteProp<ParamList, 'TotalDashboard'>>();
  const { cryptoType, round, stakingAmount, rewardAmount } = route.params;
  const rewardCryptoType =
    cryptoType === CryptoType.EL ? CryptoType.ELFI : CryptoType.DAI;
  const [selectedRound, setSelectedRound] = useState(round);
  const contract =
    cryptoType === CryptoType.EL
      ? getElStakingPoolContract()
      : getElfiStakingPoolContract();
  const [currentRound, setCurrentRound] = useState(0);
  contract?.currentRound().then((res: any) => {
    setCurrentRound(res);
  });
  const navigation = useNavigation();
  const [userReward, setUserReward] = useState(0);
  const [userPrincipal, setUserPrincipal] = useState(0);
  const { isWalletUser, user } = useContext(UserContext);
  const { wallet } = useContext(WalletContext);
  const userAddress = isWalletUser // 이거 아예 함수로 만들어야겠는데...
    ? wallet?.getFirstAddress()
    : user.ethAddresses[0];
  const { t } = useTranslation();

  useEffect(() => {
    contract?.getUserData(selectedRound, userAddress).then((res: any) => {
      setUserReward(res[1].toNumber());
      setUserPrincipal(res[2].toNumber());
    });
  }, [selectedRound]);

  return (
    <ScrollView
      style={{
        backgroundColor: AppColors.WHITE,
        height: '100%',
      }}>
      <SheetHeader title="" />
      <View style={{ paddingHorizontal: 20 }}>
        <TitleText
          label={t('main.staking_by_crypto', {
            stakingCrypto: cryptoType,
            rewardCrypto: rewardCryptoType,
          })}
          style={{ fontSize: 22 }}
        />
        <DotGraph
          selectedRound={selectedRound}
          setSelectedRound={setSelectedRound}
        />
        <BoxWithDivider style={{ marginTop: -10 }}>
          <BoxWithDividerContent
            isFirst={true}
            label={t('staking.schedule')}
            value={`${STAKING_POOL_ROUNDS[selectedRound - 1].startedAt}\n~ ${
              STAKING_POOL_ROUNDS[selectedRound - 1].endedAt
            } (KST)`}
            style={{
              paddingVertical: 25,
              paddingHorizontal: 19,
            }}
          />
          <View
            style={{
              justifyContent: 'center',
              borderTopColor: AppColors.SUB_GREY,
              borderTopWidth: 1,
              paddingVertical: 25,
              paddingHorizontal: 19,
            }}>
            <StakingInfoCard
              roundEnded={false}
              label={t('staking.nth_apr', { round: selectedRound })}
              value={aprFormatter(calculateAPR(cryptoType, selectedRound))}
              unit="%"
            />
            <StakingInfoCard
              roundEnded={false}
              label={t('staking.nth_principal', { round: selectedRound })}
              value={
                stakingAmount.isZero()
                  ? '-'
                  : commaFormatter(stakingAmount.toString())
              }
              unit={cryptoType}
              style={{ marginTop: 15 }}
            />
            <StakingInfoCard
              roundEnded={false}
              label={t('staking.nth_reward', { round: selectedRound })}
              value={
                rewardAmount.isZero()
                  ? '-'
                  : commaFormatter(rewardAmount.toString())
              }
              unit={rewardCryptoType}
              style={{ marginTop: 15 }}
            />
          </View>
        </BoxWithDivider>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            marginTop: 12,
            marginBottom: 24,
          }}>
          <CircularButtonWithLabel
            icon="+"
            disabled={!(currentRound && currentRound === selectedRound)} // 현재 '진행 중'인 라운드가 있는지 알아야 함...
            label={t('staking.stake')}
            pressHandler={() => {
              navigation.navigate(Page.Staking, {
                screen: StakingPage.Stake,
                params: {
                  cryptoType,
                  selectedRound,
                },
              });
            }}
          />
          <CircularButtonWithLabel
            icon="-"
            disabled={!userPrincipal}
            label={t('staking.unstake')}
            pressHandler={() => {
              navigation.navigate(Page.Staking, {
                screen: userReward
                  ? StakingPage.SelectUnstakingType
                  : StakingPage.Unstake,
                params: {
                  cryptoType,
                  selectedRound,
                  currentRound,
                  pageAfterSelection:
                    selectedRound <= currentRound
                      ? StakingPage.UnstakeAndMigrate
                      : StakingPage.Unstake,
                },
              });
            }}
          />
          <CircularButtonWithLabel
            icon="⤴"
            disabled={!userReward}
            label={t('staking.claim_rewards')}
            pressHandler={() => {
              navigation.navigate(Page.Staking, {
                screen: StakingPage.Reward,
                params: {
                  rewardCryptoType,
                  selectedRound,
                },
              });
            }}
          />
        </View>
      </View>
    </ScrollView>
  );
};

export default TotalDashboard;
