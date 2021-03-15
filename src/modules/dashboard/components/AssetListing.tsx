import React from 'react';
import { View } from 'react-native';
import AppColors from '../../../enums/AppColors';
import CurrencyIcon from '../../../enums/CurrencyIcon';
import { H3Text } from '../../../shared/components/Texts';
import AssetItem from './AssetItem';

type Asset = {
  icon: CurrencyIcon;
  title: string;
  currencyValue: string;
  unitValue: string;
}

interface IAssetListing {
  title: string
  totalValue: string
  assets: Asset[]
}

export const AssetListing: React.FC<IAssetListing> = ({
  title,
  totalValue,
  assets,
}) => {
  return (
    <View>
      <View style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingBottom: 15,
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: AppColors.GREY,
      }}>
        <H3Text label={title} />
        <H3Text label={totalValue} />
      </View>
      {
        assets.map((asset, index) => {
          return <AssetItem
            key={index}
            {...asset}
          />
        })
      }
      <View style={{
        height: 15,
        borderBottomWidth: 1,
        borderBottomColor: AppColors.GREY,
      }} />
    </View>
  );
};

export default AssetListing
