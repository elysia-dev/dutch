import React, { useContext } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import AppColors from '../../../enums/AppColors';
import { H3Text, P2Text } from '../../../shared/components/Texts';
import Asset from '../../../types/Asset';
import AssetItem from './AssetItem';
import PreferenceContext from '../../../contexts/PreferenceContext';
import PriceContext from '../../../contexts/PriceContext';
import Skeleton from '../../../shared/components/Skeleton';
import AssetItemSkeleton from './AssetItemSkeleton';
import AssetContext from '../../../contexts/AssetContext';

interface IAssetListing {
  title: string;
  assets: Asset[];
  itemPressHandler: (asset: Asset) => void;
}

const AssetListing: React.FC<IAssetListing> = ({
  title,
  assets,
  itemPressHandler,
}) => {
  const { currencyFormatter } = useContext(PreferenceContext);
  const { getCryptoPrice } = useContext(PriceContext);
  const { t } = useTranslation();
  const { assetLoaded } = useContext(AssetContext);

  if (assetLoaded) {
    return (
      <View>
        <View
          style={{
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
              assets.reduce(
                (res, cur) => cur.value * getCryptoPrice(cur.type) + res,
                0,
              ),
              2,
            )}
          />
        </View>
        {assets.map((asset, index) => {
          return (
            <AssetItem key={index} asset={asset} onPress={itemPressHandler} />
          );
        })}
        {assets.length === 0 && (
          <View
            style={{
              height: 100,
            }}>
            <P2Text
              style={{ textAlign: 'center', marginTop: 40 }}
              label={t('assets.null_investment')}
            />
          </View>
        )}
        <View
          style={{
            height: 15,
            borderBottomWidth: 1,
            borderBottomColor: AppColors.GREY,
          }}
        />
      </View>
    );
  } else {
    return (
      <View>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingBottom: 15,
            marginBottom: 10,
            borderBottomWidth: 1,
            borderBottomColor: AppColors.GREY,
          }}>
          <H3Text label={title} />
          <Skeleton width={90} height={20} radius={5} />
        </View>
        <AssetItemSkeleton />
        <AssetItemSkeleton />
        <View
          style={{
            height: 15,
            borderBottomWidth: 1,
            borderBottomColor: AppColors.GREY,
          }}
        />
      </View>
    );
  }
};

export default AssetListing;
