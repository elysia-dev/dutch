import React, {
  useContext,
  useEffect,
  useState,
  Dispatch,
  SetStateAction,
} from 'react';
import { View } from 'react-native';
import { Contract } from '@ethersproject/contracts';
import { useTranslation } from 'react-i18next';
import AppColors from '../../../enums/AppColors';
import { H3Text, P1Text } from '../../../shared/components/Texts';
import CryptoImage from '../../../shared/components/CryptoImage';
import CryptoType from '../../../enums/CryptoType';
import StakingInfoBox from './StakingInfoBox';
import {
  getElStakingPoolContract,
  getElfiStakingPoolContract,
} from '../../../utiles/getContract';
import WalletContext from '../../../contexts/WalletContext';
import UserContext from '../../../contexts/UserContext';

const StakingListing: React.FC<{}> = () => {
  const { wallet } = useContext(WalletContext);
  const { user, isWalletUser } = useContext(UserContext);
  const userAddress = isWalletUser
    ? wallet?.getFirstAddress()
    : user.ethAddresses[0];
  const elStakingPoolContract = getElStakingPoolContract();
  const elfiStakingPoolContract = getElfiStakingPoolContract();
  const [elStakingInfoBoxes, setElStakingInfoBoxes] = useState(
    [] as React.ReactNode[],
  );
  const [elfiStakingInfoBoxes, setElfiStakingInfoBoxes] = useState(
    [] as React.ReactNode[],
  );
  const { t } = useTranslation();

  async function getRoundData(type: CryptoType): Promise<void> {
    let contract: Contract | null;
    let infoBoxes: React.ReactNode[];
    let setInfoBoxes: Dispatch<SetStateAction<React.ReactNode[]>>;
    if (type === CryptoType.EL) {
      contract = elStakingPoolContract;
      infoBoxes = elStakingInfoBoxes;
      setInfoBoxes = setElStakingInfoBoxes;
    } else {
      // type === CryptoType.ELFI
      contract = elfiStakingPoolContract;
      infoBoxes = elfiStakingInfoBoxes;
      setInfoBoxes = setElfiStakingInfoBoxes;
    }

    const tempBoxes = [] as React.ReactNode[];
    for (let round = 1; round <= 6; round++) {
      tempBoxes.push(
        contract?.getUserData(round, userAddress).then((res: any) => {
          const stakingAmount = res[2].toNumber(); // principal
          const rewardAmount = res[1].toNumber();
          // if (stakingAmount) {
          return (
            <StakingInfoBox
              key={round}
              cryptoType={type}
              round={round}
              stakingAmount={stakingAmount}
              rewardAmount={rewardAmount}
            />
          );
          // }
        }),
      );
    }

    setInfoBoxes(await Promise.all(tempBoxes));
  }

  useEffect(() => {
    getRoundData(CryptoType.EL);
    getRoundData(CryptoType.ELFI);
  }, []);

  return (
    <View
      style={{
        borderBottomWidth: 1,
        borderBottomColor: AppColors.GREY,
        paddingBottom: 12,
        marginTop: 12,
        marginBottom: 10,
      }}>
      <H3Text
        label={t('main.my_staking')}
        style={{
          paddingBottom: 15,
          marginBottom: 10,
          borderBottomWidth: 1,
          borderBottomColor: AppColors.GREY,
        }}
      />
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          height: 60,
          paddingTop: 5,
          paddingBottom: 5,
          alignItems: 'center',
        }}>
        <CryptoImage type={CryptoType.EL} />
        <CryptoImage
          type={CryptoType.ELFI}
          style={{
            width: 25,
            height: 25,
            position: 'absolute',
            bottom: 5,
            left: 20,
            backgroundColor: 'lime',
          }}
        />
        <P1Text
          label={t('main.staking_by_crypto', {
            stakingCrypto: CryptoType.EL,
            rewardCrypto: CryptoType.ELFI,
          })}
          style={{ marginLeft: 15 }}
        />
      </View>
      <View style={{ marginTop: 8 }}>{elStakingInfoBoxes}</View>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          height: 60,
          paddingTop: 5,
          paddingBottom: 5,
          alignItems: 'center',
        }}>
        <CryptoImage type={CryptoType.ELFI} />
        <CryptoImage
          type={CryptoType.DAI}
          style={{
            width: 25,
            height: 25,
            position: 'absolute',
            bottom: 5,
            left: 20,
            backgroundColor: 'lime',
          }}
        />
        <P1Text
          label={t('main.staking_by_crypto', {
            stakingCrypto: CryptoType.ELFI,
            rewardCrypto: CryptoType.DAI,
          })}
          style={{ marginLeft: 15 }}
        />
      </View>
      <View style={{ marginTop: 8 }}>{elfiStakingInfoBoxes}</View>
    </View>
  );
};

export default StakingListing;
