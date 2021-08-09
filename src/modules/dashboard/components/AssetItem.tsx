import React, { useContext, useState } from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import PreferenceContext from '../../../contexts/PreferenceContext';
import PriceContext from '../../../contexts/PriceContext';
import TransactionContext from '../../../contexts/TransactionContext';
import CryptoType from '../../../enums/CryptoType';
import CryptoImage from '../../../shared/components/CryptoImage';
import { P1Text, P2Text } from '../../../shared/components/Texts';
import Asset from '../../../types/Asset';
import commaFormatter from '../../../utiles/commaFormatter';

interface IAssetItem {
  asset: Asset;
  onPress?: (asset: Asset) => void;
  touchable?: boolean;
}

export const AssetItem: React.FC<IAssetItem> = ({
  asset,
  onPress = () => {},
  touchable = true,
}) => {
  const { currencyFormatter } = useContext(PreferenceContext);
  const { getCryptoPrice } = useContext(PriceContext);
  const { transactions } = useContext(TransactionContext);
  return (
    <TouchableOpacity
      onPress={() => onPress(asset)}
      disabled={!touchable}
      style={{
        display: 'flex',
        flexDirection: 'row',
        height: 60,
        paddingTop: 5,
        paddingBottom: 5,
        alignItems: 'center',
      }}>
      {asset.type === CryptoType.ELA ? (
        <>
          <CryptoImage
            type={asset.image!}
            style={{ borderColor: '#F1F1F1', borderWidth: 1 }}
          />
          <CryptoImage
            type={asset.paymentMethod!}
            style={{
              width: 25,
              height: 25,
              position: 'absolute',
              bottom: 5,
              left: 20,
            }}
          />
        </>
      ) : (
        <CryptoImage type={asset.type} />
      )}
      <View style={{ marginLeft: 15 }}>
        <P1Text label={asset.title} />
        {asset.value > 0 ? (
          <P2Text
            label={`${
              asset.value >= 0.01
                ? commaFormatter(Math.floor(asset.value * 100) / 100)
                : asset.value === 0
                ? 0
                : '0.00...'
            } ${asset.unit}`}
          />
        ) : (
          <P2Text label={`0 ${asset.unit}`} />
        )}
      </View>
      {asset.type === CryptoType.ELA && asset.value <= 0 ? (
        <P1Text style={{ marginLeft: 'auto' }} label={'거래대기중'} />
      ) : (
        <P1Text
          style={{ marginLeft: 'auto' }}
          label={currencyFormatter(asset.value * getCryptoPrice(asset.type), 2)}
        />
      )}
    </TouchableOpacity>
  );
};

export default AssetItem;
