import React, { useContext, useState } from 'react';
import BasicLayout from '../../shared/components/BasicLayout';
import Asset from '../../types/Asset';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import AssetItem from '../dashboard/components/AssetItem';
import WrapperLayout from '../../shared/components/WrapperLayout';
import SelectBox from './components/SelectBox';
import { View, Dimensions } from 'react-native';
import AssetGraph from './components/AssetGraph';
import TransactionList from './components/TransactionList';
import CryptoType from '../../enums/CryptoType';
import AppColors from '../../enums/AppColors';
import NextButton from '../../shared/components/NextButton';
import { useTranslation } from 'react-i18next';
import UserContext from '../../contexts/UserContext';
import { CryptoPage } from '../../enums/pageEnum';

const now = Date.now();

const testCryptoTx = [
  { type: 'in', value: '10', txHash: '0x949857f121c55c2ed4b32e8e9eace1d38a9d59ddef11956e65854bb12288995e', createdAt: now },
  { type: 'out', value: '10', txHash: '0x949857f121c55c2ed4b32e8e9eace1d38a9d59ddef11956e65854bb12288995e', createdAt: now },
  { type: 'in', value: '100', txHash: '0x949857f121c55c2ed4b32e8e9eace1d38a9d59ddef11956e65854bb12288995e', createdAt: now }
]

const graphData = [
  { y: 7, x: now - 8 * 86400000 },
  { y: 8, x: now - 7 * 86400000 },
  { y: 9, x: now - 6 * 86400000 },
  { y: 15, x: now - 5 * 86400000 },
  { y: 0, x: now - 4 * 86400000 },
  { y: 1, x: now - 3 * 86400000 },
  { y: 2, x: now - 2 * 86400000 },
  { y: 3, x: now - 86400000 },
  { y: 20, x: now },
]

type ParamList = {
  CryptoDetail: {
    asset: Asset;
  };
};

const Detail: React.FC = () => {
  const route = useRoute<RouteProp<ParamList, 'CryptoDetail'>>();
  const cryptoType = route.params.asset.type;
  const navigation = useNavigation();
  const [range, setRange] = useState<number>(0);
  const [filter, setFilter] = useState<number>(0);
  const { isWalletUser, user } = useContext(UserContext);
  const { t } = useTranslation();

  return (
    <>
      <WrapperLayout
        title={route.params.asset.title + " " + t('wallet.crypto_value')}
        isScrolling={true}
        backButtonHandler={() => navigation.goBack()}
        body={
          <BasicLayout>
            <AssetItem
              asset={route.params.asset}
              touchable={false}
            />
            <View style={{ height: 30 }} />
            <SelectBox
              options={[t('wallet.month'), t('wallet.year'), t('wallet.all')]}
              selected={range}
              select={(range) => setRange(range)}
            />
            <AssetGraph
              data={graphData}
              lineColor={
                cryptoType === CryptoType.EL ?
                  AppColors.EL_BLUE :
                  cryptoType === CryptoType.ETH ?
                    AppColors.ETH_BLUE :
                    AppColors.BNB_YELLOW
              }
            />
            <View style={{ height: 20 }} />
            <SelectBox
              options={['ALL', 'OUT', 'IN']}
              selected={filter}
              select={(filter) => setFilter(filter)}
            />
            <TransactionList data={testCryptoTx} unit={route.params.asset.unit} />
            <View style={{ height: 100 }} />
          </BasicLayout>
        }
      />
      {
        user.ethAddresses[0] || isWalletUser &&
        <View
          style={{
            marginLeft: '5%',
            marginRight: '5%',
            flexDirection: 'row',
            justifyContent: 'space-between',
            position: 'absolute',
            bottom: 10,
            backgroundColor: 'white',
            width: '90%',
          }}
        >
          <NextButton
            style={{
              // width: isWalletUser ? 160 : ,
              width: Dimensions.get('window').width * 0.9
            }}
            title={t('wallet.deposit')}
            handler={() => {
              navigation.navigate(CryptoPage.Deposit)
            }}
          />
        </View>
      }
    </>
  );
};

export default Detail
