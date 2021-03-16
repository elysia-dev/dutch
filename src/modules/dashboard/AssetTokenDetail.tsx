import React, {
  FunctionComponent,
  useState,
} from 'react';
import { View, ScrollView, Image, Modal, Text } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { BackButton } from '../../shared/components/BackButton';
import { H2Text, H4Text, P1Text, TitleText } from '../../shared/components/Texts';
import Asset from '../../types/Asset';
import SelectBox from './components/SelectBox';
import TransactionList from './components/TransactionList';
import { TouchableOpacity } from 'react-native-gesture-handler';
import i18n from '../../i18n/i18n';
import AppColors from '../../enums/AppColors';

const now = Date.now()

const testCryptoTx = [
  { type: 'in', value: '10', txHash: '0x949857f121c55c2ed4b32e8e9eace1d38a9d59ddef11956e65854bb12288995e', createdAt: now },
  { type: 'out', value: '10', txHash: '0x949857f121c55c2ed4b32e8e9eace1d38a9d59ddef11956e65854bb12288995e', createdAt: now },
  { type: 'in', value: '100', txHash: '0x949857f121c55c2ed4b32e8e9eace1d38a9d59ddef11956e65854bb12288995e', createdAt: now }
]

type ParamList = {
  AssetTokenDetail: {
    asset: Asset;
  };
};

const AssetTokenDetail: FunctionComponent = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<ParamList, 'AssetTokenDetail'>>();
  const asset = route.params.asset;
  const [filter, setFilter] = useState<number>(0);
  const [state, setState] = useState({
    refundModalVisible: false,
    purchaseModalVisible: false,
    interestModalVisible: false,
  });

  return (
    <>
      <ScrollView
        scrollEnabled={true}
        scrollToOverflowEnabled={true}
        style={{ height: '100%', backgroundColor: '#fff' }}>
        <View
          style={{
            top: 0,
            width: '100%',
            height: 293,
            borderBottomLeftRadius: 10,
            borderBottomRightRadius: 10,
          }}>
          <Image
            source={{ uri: 'https://elysia.land/static/media/elysia-asset-6.033509fa.png' }}
            style={{
              borderBottomLeftRadius: 10,
              borderBottomRightRadius: 10,
              position: 'absolute',
              top: 0,
              width: '100%',
              height: 293,
              resizeMode: 'cover',
            }}
          />
          <View style={{ position: 'absolute', padding: 20 }}>
            <BackButton handler={() => navigation.goBack()} />
          </View>
        </View>
        <View style={{ marginLeft: '5%', marginRight: '5%' }}>
          <H4Text
            style={{ marginTop: 20, color: AppColors.BLACK2 }}
            label={`${asset.unit} 투자금`}
          />
          <TitleText
            style={{ marginTop: 10, color: AppColors.BLACK }}
            label={asset.currencyValue}
          />
          <View style={{ marginTop: 20, height: 1, backgroundColor: AppColors.GREY }} />
          {
            [
              { left: '상품명', right: asset.title },
              { left: '보유량', right: asset.unitValue },
              { left: '지분률', right: '6.28%' },
            ].map((data, index) => {
              return (
                <View
                  key={index}
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    height: 60,
                    borderBottomWidth: 1,
                    borderBottomColor: AppColors.GREY
                  }}
                >
                  <P1Text
                    style={{ color: AppColors.BLACK2 }}
                    label={data.left}
                  />
                  <H4Text
                    style={{ color: AppColors.BLACK }}
                    label={data.right}
                  />
                </View>
              )
            })
          }
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              height: 60,
              borderBottomWidth: 1,
              borderBottomColor: AppColors.GREY
            }}
          >
            <H4Text
              style={{ color: AppColors.BLACK }}
              label={'총 누적수익금'}
            />
            <View>
              <H4Text
                style={{ color: AppColors.MAIN, textAlign: 'right' }}
                label={'$ 5.1'}
              />
              <H4Text
                style={{ color: AppColors.BLACK2, textAlign: 'right' }}
                label={'0.123 ETH'}
              />
            </View>
          </View>
          <View style={{ marginTop: 20, marginBottom: 20, flexDirection: 'row', justifyContent: 'space-around' }}>
            {
              [
                { title: '구매', icon: '+' },
                { title: '환불', icon: '−' },
                { title: '이자', icon: '⤴' },
              ].map((data, index) => {
                return (
                  <TouchableOpacity
                    key={index}
                    style={{ flexDirection: 'column', alignItems: 'center' }}
                  >
                    <View
                      style={{
                        width: 55,
                        height: 55,
                        borderRadius: 27.5,
                        backgroundColor: AppColors.MAIN,
                        justifyContent: 'center'
                      }}
                    >
                      <Text
                        style={{
                          color: AppColors.WHITE,
                          fontSize: 27,
                          textAlign: 'center'
                        }}
                      >{data.icon}</Text>
                    </View>
                    <H4Text label={data.title} style={{ marginTop: 10 }} />
                  </TouchableOpacity>
                )
              })
            }
          </View>
        </View>
        <View style={{ height: 15, backgroundColor: AppColors.BACKGROUND_GREY }} />
        <View style={{ marginLeft: '5%', marginRight: '5%' }}>
          <H2Text label={'거래기록'} style={{ marginTop: 20 }} />
          <View style={{ height: 20 }} />
          <SelectBox
            options={['ALL', 'OUT', 'IN']}
            selected={filter}
            select={(filter) => setFilter(filter)}
          />
          <TransactionList data={testCryptoTx} unit={route.params.asset.unit} />
          <TouchableOpacity
            style={{
              width: '100%',
              height: 50,
              borderRadius: 5,
              borderWidth: 1,
              borderColor: AppColors.MAIN,
              justifyContent: 'center',
              alignContent: 'center',
              marginTop: 15,
              marginBottom: 15
            }}>
            <P1Text
              style={{
                color: AppColors.MAIN,
                fontSize: 17,
                textAlign: 'center',
              }}
              label={i18n.t('dashboard_label.more_transactions')}
            />
          </TouchableOpacity>
        </View>
      </ScrollView>
      {(state.purchaseModalVisible ||
        state.refundModalVisible ||
        state.interestModalVisible) && (
          <View
            style={{
              backgroundColor: 'rgba(0,0,0,0.5)',
              position: 'absolute',
              width: '100%',
              height: '100%',
            }}></View>
        )}
      <Modal
        transparent={true}
        animationType={'slide'}
        visible={state.refundModalVisible}
        onRequestClose={() =>
          setState({ ...state, refundModalVisible: false })
        }>
      </Modal>
      <Modal
        transparent={true}
        animationType={'slide'}
        visible={state.interestModalVisible}
        onRequestClose={() =>
          setState({ ...state, interestModalVisible: false })
        }>
      </Modal>
      <Modal
        transparent={true}
        animationType={'slide'}
        visible={state.purchaseModalVisible}
        onRequestClose={() =>
          setState({ ...state, purchaseModalVisible: false })
        }>
      </Modal>
    </>
  );
};

export default AssetTokenDetail;
