import React, {
  useContext,
  useEffect,
  useState,
  Dispatch,
  SetStateAction,
} from 'react';
import { View } from 'react-native';
import { Contract } from '@ethersproject/contracts';
import AppColors from '../../../enums/AppColors';
import { H3Text, P1Text } from '../../../shared/components/Texts';
import CryptoImage from '../../../shared/components/CryptoImage';
import CryptoType from '../../../enums/CryptoType';
import StakingInfoBox from './StakingInfoBox';
import { getElStakingPoolContract } from '../../../utiles/getContract';
import WalletContext from '../../../contexts/WalletContext';

const StakingListing: React.FC<{ user: any; isWalletUser: boolean }> = ({
  user,
  isWalletUser,
}) => {
  const { wallet } = useContext(WalletContext);
  const userAddress = isWalletUser
    ? wallet?.getFirstAddress()
    : user.ethAddresses[0];
  const elStakingPoolContract = getElStakingPoolContract();
  const elfiStakingPoolContract = null; // 나중에 elfi 컨트랙트도 추가
  const [elStakingInfoBoxes, setElStakingInfoBoxes] = useState(
    [] as React.ReactNode[],
  );
  const [elfiStakingInfoBoxes, setElfiStakingInfoBoxes] = useState(
    [] as React.ReactNode[],
  );

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
              cryptoType={CryptoType.EL}
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
        label="내 스테이킹 및 리워드"
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
        <P1Text label="EL 스테이킹 및 ELFI 리워드" style={{ marginLeft: 15 }} />
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
          label="ELFI 스테이킹 및 DAI 리워드"
          style={{ marginLeft: 15 }}
        />
      </View>
      <View style={{ marginTop: 8 }}>{elfiStakingInfoBoxes}</View>
    </View>
  );
};

export default StakingListing;
