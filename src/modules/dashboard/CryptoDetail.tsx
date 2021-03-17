import React, { useState } from 'react';
import BasicLayout from '../../shared/components/BasicLayout';
import Asset from '../../types/Asset';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import AssetItem from './components/AssetItem';
import WrapperLayout from '../../shared/components/WrapperLayout';
import SelectBox from './components/SelectBox';
import { View, Modal } from 'react-native';
import AssetGraph from './components/AssetGraph';
import TransactionList from './components/TransactionList';
import CryptoType from '../../enums/CryptoType';
import AppColors from '../../enums/AppColors';
import NextButton from '../../shared/components/NextButton';
import Deposit from './components/Deposit';
import Withdrawal from './components/Withdrawal';

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

const CryptoDetail: React.FC = () => {
  const route = useRoute<RouteProp<ParamList, 'CryptoDetail'>>();
  const cryptoType = route.params.asset.type;
  const navigation = useNavigation();
  const [range, setRange] = useState<number>(0);
  const [filter, setFilter] = useState<number>(0);
  const [depositModalVisible, setDepositModalVisible] = useState<boolean>(false);
  const [withdrwalModalVisible, setWithdrawalModalVisible] = useState<boolean>(false);

  return (
    <>
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
      <View
        style={{
          marginLeft: '5%',
          marginRight: '5%',
          flexDirection: 'row',
          justifyContent: 'space-between',
          position: 'absolute',
          width: '90%',
          bottom: 10,
          backgroundColor: 'white',
        }}
      >
        <NextButton
          style={{
            width: 160,
          }}
          title={'입금하기'}
          handler={() => { setDepositModalVisible(true) }}
        />
        <NextButton
          style={{
            width: 160,
          }}
          title={'출금하기'}
          handler={() => { setWithdrawalModalVisible(true) }}
        />
      </View>
      {(depositModalVisible ||
        withdrwalModalVisible) && (
          <View
            style={{
              backgroundColor: 'rgba(0,0,0,0.5)',
              position: 'absolute',
              width: '100%',
              height: '100%',
            }} />
        )}
      <Modal
        transparent={true}
        animationType={'slide'}
        visible={depositModalVisible}
        onRequestClose={() =>
          setDepositModalVisible(false)
        }>
        <Deposit
          modalHandler={() => setDepositModalVisible(false)}
        />
      </Modal>
      <Modal
        transparent={true}
        animationType={'slide'}
        visible={withdrwalModalVisible}
        onRequestClose={() =>
          setWithdrawalModalVisible(false)
        }>
        <Withdrawal
          modalHandler={() => setWithdrawalModalVisible(false)}
          submitHandler={() => { }}
        />
      </Modal>
    </>
  );
};

export default CryptoDetail