import React from 'react';
import { View } from 'react-native';
import AppColors from '../../../enums/AppColors';
import { H3Text, P2Text } from '../../../shared/components/Texts';
import Asset from '../../../types/Asset';
import AssetItem from './AssetItem';
import i18n from '../../../i18n/i18n';

interface IAssetListing {
  title: string
  totalValue: string
  assets: Asset[]
  itemPressHandler: (asset: Asset) => void
}

export const AssetListing: React.FC<IAssetListing> = ({
  title,
  totalValue,
  assets,
  itemPressHandler,
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
            asset={asset}
            onPress={itemPressHandler}
          />
        })
      }
      {
        assets.length === 0 && <View
          style={{
            height: 100,
          }}
        >
          <P2Text
            style={{ textAlign: 'center', marginTop: 40 }}
            label={i18n.t('assets.null_investment')}
          />
        </View>
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
