import React, { useContext } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import AppColors from '../../../enums/AppColors';
import { H3Text, P1Text, P2Text } from '../../../shared/components/Texts';
import CryptoImage from '../../../shared/components/CryptoImage';
import RealEstateInfoBox from './RealEstateInfoBox';
import RealEstateListingSkeleton from './RealEstateListingSkeleton';
import Asset from '../../../types/Asset';
import AppFonts from '../../../enums/AppFonts';
import useUserTotalAsset from '../../../hooks/useUserTotalAsset';
import PreferenceContext from '../../../contexts/PreferenceContext';
import AssetContext from '../../../contexts/AssetContext';

const RealEstateListing: React.FC<{
  title: string;
  assets: Asset[];
  itemPressHandler: (asset: Asset) => void;
}> = ({ title, assets, itemPressHandler }) => {
  const { t } = useTranslation();
  const { totalRealEstate, totalInterest } = useUserTotalAsset();
  const { currencyFormatter } = useContext(PreferenceContext);
  const { assetLoaded } = useContext(AssetContext);

  if (assetLoaded) {
    return (
      <View
        style={{
          borderBottomWidth: 1,
          borderBottomColor: AppColors.GREY,
          paddingBottom: 12,
          marginTop: 12,
          marginBottom: 10,
        }}>
        <View
          style={{
            paddingBottom: 15,
            marginBottom: 10,
            borderBottomWidth: 1,
            borderBottomColor: AppColors.GREY,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <H3Text label={title} />
          <H3Text label={currencyFormatter(totalRealEstate + totalInterest)} />
        </View>
        {assets.map((asset) => {
          return (
            <View key={asset.productId}>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  height: 60,
                  paddingTop: 5,
                  paddingBottom: 5,
                  alignItems: 'center',
                }}>
                <CryptoImage type={asset.image!} />
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
                <P1Text
                  label={asset.title}
                  style={{ marginLeft: 15, fontFamily: AppFonts.Medium }}
                />
              </View>
              <View style={{ marginTop: 8 }}>
                <RealEstateInfoBox asset={asset} onPress={itemPressHandler} />
              </View>
            </View>
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
      </View>
    );
  } else {
    return <RealEstateListingSkeleton />;
  }
};

export default RealEstateListing;
