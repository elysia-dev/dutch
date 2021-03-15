import React, { useState } from 'react';
import BasicLayout from '../../shared/components/BasicLayout';
import Asset from '../../types/Asset';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import AssetItem from './components/AssetItem';
import WrapperLayout from '../../shared/components/WrapperLayout';
import SelectBox from './components/SelectBox';
import { View } from 'react-native';
import AssetGraph from './components/AssetGraph';
import TransactionList from './components/TransactionList';

const testCryptoTx = [
  { type: 'in', value: '10', txHash: '0x949857f121c55c2ed4b32e8e9eace1d38a9d59ddef11956e65854bb12288995e', createdAt: Date.now() },
  { type: 'out', value: '10', txHash: '0x949857f121c55c2ed4b32e8e9eace1d38a9d59ddef11956e65854bb12288995e', createdAt: Date.now() },
  { type: 'in', value: '100', txHash: '0x949857f121c55c2ed4b32e8e9eace1d38a9d59ddef11956e65854bb12288995e', createdAt: Date.now() }
]

type ParamList = {
  CryptoDetail: {
    asset: Asset;
  };
};

const CryptoDetail: React.FC = () => {
  const route = useRoute<RouteProp<ParamList, 'CryptoDetail'>>();
  const navigation = useNavigation();
  const [range, setRange] = useState<number>(0);
  const [filter, setFilter] = useState<number>(0);

  return (
    <WrapperLayout
      title={`${route.params.asset.title} 보유수량`}
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
            options={['1개월', '1년', '최대']}
            selected={range}
            select={(range) => setRange(range)}
          />
          <AssetGraph data={[]} />
          <SelectBox
            options={['ALL', 'OUT', 'IN']}
            selected={filter}
            select={(filter) => setFilter(filter)}
          />
          <TransactionList data={testCryptoTx} unit={route.params.asset.unit} />
        </BasicLayout>
      }
    />
  );
};

export default CryptoDetail
