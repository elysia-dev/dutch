import React, { useContext } from 'react';
import { View } from 'react-native';
import AppColors from '../../../enums/AppColors';
import { H3Text, P2Text } from '../../../shared/components/Texts';
import Asset from '../../../types/Asset';
import AssetItem from './AssetItem';
import { useTranslation } from 'react-i18next'
import PreferenceContext from '../../../contexts/PreferenceContext';

interface IAssetListing {
  title: string
  assets: Asset[]
  itemPressHandler: (asset: Asset) => void
}

export const AssetListing: React.FC<IAssetListing> = ({
  title,
  assets,
  itemPressHandler,
}) => {
  const { currencyFormatter } = useContext(PreferenceContext)
  const { t } = useTranslation();

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
        <H3Text
          label={currencyFormatter(
            assets.reduce((res, cur) => cur.currencyValue + res, 0),
            2
          )}
        />
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
            label={t('assets.null_investment')}
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
