import React, { useState, useEffect, useContext } from 'react';
import { View, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
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

const TotalDashboard: React.FC<{ route: any }> = ({ route }) => {
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
          label={`${cryptoType} 스테이킹 및 ${rewardCryptoType} 리워드`}
          style={{ fontSize: 22 }}
        />
        <DotGraph
          selectedRound={selectedRound}
          setSelectedRound={setSelectedRound}
          currentRound={currentRound}
        />
        <BoxWithDivider style={{ marginTop: -10 }}>
          <BoxWithDividerContent
            isFirst={true}
            label="기간"
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
              label={`${selectedRound}차 스테이킹 APR`}
              value={aprFormatter(calculateAPR(cryptoType, selectedRound))}
              unit="EL"
            />
            <StakingInfoCard
              roundEnded={false}
              label={`${selectedRound}차 스테이킹 수량`}
              value={stakingAmount || '-'}
              unit={cryptoType}
              style={{ marginTop: 15 }}
            />
            <StakingInfoCard
              roundEnded={false}
              label={`${selectedRound}차 보상 수량`}
              value={rewardAmount || '-'}
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
            label="스테이킹"
            pressHandler={() => {
              navigation.navigate(Page.Staking, {
                screen: StakingPage.Stake,
                params: {
                  cryptoType,
                  selectedRound,
                  currentRound,
                },
              });
            }}
          />
          <CircularButtonWithLabel
            icon="-"
            disabled={!userPrincipal}
            label="언스테이킹"
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
            label="보상 수령"
            pressHandler={() => {
              navigation.navigate(Page.Staking, {
                screen: StakingPage.Reward,
                params: {
                  rewardCryptoType,
                  selectedRound,
                  currentRound,
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
