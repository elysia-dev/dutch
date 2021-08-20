import React, { useState, useEffect, useContext } from 'react';
import { View, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import AppColors from '../../enums/AppColors';
import SheetHeader from '../../shared/components/SheetHeader';
import { TitleText } from '../../shared/components/Texts';
import BoxWithDivider from './components/BoxWithDivider';
import DotGraph from './components/DotGraph';
import CircularButtonWithLabel from '../../shared/components/CircularButtonWithLabel';
import StakingInfoCard from './components/StakingInfoCard';
import { getStakingPoolContract } from '../../utiles/getContract';
import CryptoType from '../../enums/CryptoType';
import calculateAPR, { aprFormatter } from '../../utiles/calculateAPR';
import { STAKING_POOL_ROUNDS } from '../../constants/staking';
import BoxWithDividerContent from './components/BoxWithDividerContent';
import { Page, StakingPage } from '../../enums/pageEnum';
import UserContext from '../../contexts/UserContext';
import WalletContext from '../../contexts/WalletContext';
import {
  ELFI_STAKING_POOL_ADDRESS,
  EL_STAKING_POOL_ADDRESS,
} from 'react-native-dotenv';
import { BigNumber, utils } from 'ethers';
import decimalFormatter from '../../utiles/decimalFormatter';
import commaFormatter from '../../utiles/commaFormatter';

const TotalDashboard: React.FC<{ route: any }> = ({ route }) => {
  const { cryptoType, round, stakingAmount, rewardAmount } = route.params;
  const rewardCryptoType =
    cryptoType === CryptoType.EL ? CryptoType.ELFI : CryptoType.DAI;
  const [selectedRound, setSelectedRound] = useState(round);
  const navigation = useNavigation();
  const [userReward, setUserReward] = useState('-');
  const [userPrincipal, setUserPrincipal] = useState('-');
  const { isWalletUser, user } = useContext(UserContext);
  const { wallet } = useContext(WalletContext);
  const address = isWalletUser // 이거 아예 함수로 만들어야겠는데...
    ? wallet?.getFirstAddress()
    : user.ethAddresses[0];
  const { t } = useTranslation();
  const { stakingAddress, signer } = {
    stakingAddress:
      cryptoType === CryptoType.EL
        ? EL_STAKING_POOL_ADDRESS
        : ELFI_STAKING_POOL_ADDRESS,
    signer: wallet?.getFirstSigner(),
  };
  const stakingPoolContract = getStakingPoolContract(stakingAddress, signer);
  const [currentRound, setCurrentRound] = useState(0);
  stakingPoolContract.currentRound().then((res: any) => {
    setCurrentRound(res);
  });

  const formatAmount = (amount: BigNumber) => {
    return commaFormatter(
      decimalFormatter(Number(utils.formatEther(amount)), 5),
    );
  };

  const indicateAmount = (amount: BigNumber) => {
    return amount.toHexString() !== '0x00' ? formatAmount(amount) : '-';
  };

  useEffect(() => {
    stakingPoolContract
      .getUserData(selectedRound, address || '')
      .then((res: BigNumber[]) => {
        setUserReward(indicateAmount(res[1]));
        setUserPrincipal(indicateAmount(res[2]));
      })
      .catch((e) => {
        console.log(e);
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
          currentRound={currentRound}
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
              unit="EL"
            />
            <StakingInfoCard
              roundEnded={false}
              label={t('staking.nth_principal', { round: selectedRound })}
              value={userPrincipal}
              unit={cryptoType}
              style={{ marginTop: 15 }}
            />
            <StakingInfoCard
              roundEnded={false}
              label={t('staking.nth_reward', { round: selectedRound })}
              value={userReward}
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
                  currentRound,
                },
              });
            }}
          />
          <CircularButtonWithLabel
            icon="-"
            disabled={userPrincipal === '-'}
            label={t('staking.unstake')}
            pressHandler={() => {
              navigation.navigate(Page.Staking, {
                screen:
                  userReward !== '-' || selectedRound !== currentRound
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
            disabled={userReward === '-'}
            label={t('staking.claim_rewards')}
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
